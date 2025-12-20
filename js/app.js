const { useState, useEffect, useMemo } = React;
const Icons = window.Icons;
const client = window.client;
const getGasStatus = window.getGasStatus;
const getSoundLevel = window.getSoundLevel;
const NavBar = window.NavBar;
const Dashboard = window.Dashboard;
const Analytics = window.Analytics;
const History = window.History;
const About = window.About;
const Documentation = window.Documentation;
const Login = window.Login;
const UserSettings = window.UserSettings;

try {
    const App = () => {
        const [user, setUser] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [activeTab, setActiveTab] = useState('dashboard');
        const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [currentTime, setCurrentTime] = useState(new Date());
        const [connectionStatus, setConnectionStatus] = useState('Checking...');
        const [historyFilter, setHistoryFilter] = useState({
            sortBy: 'created_at',
            sortOrder: 'desc',
            startDate: '',
            endDate: '',
            alertsOnly: false
        });

        // --- CHECK AUTH STATE ON MOUNT ---
        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const { data: { session }, error } = await client.auth.getSession();
                    if (error) throw error;
                    setUser(session?.user || null);
                } catch (err) {
                    console.error('Auth check error:', err);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();

            // Listen for auth changes
            const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
                setUser(session?.user || null);
            });

            return () => subscription?.unsubscribe();
        }, []);

        // --- THEME MANAGEMENT ---
        useEffect(() => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('theme', theme);
        }, [theme]);

        const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

        // --- CLOCK & CONNECTION TICKER ---
        useEffect(() => {
            const timer = setInterval(() => {
                const now = new Date();
                setCurrentTime(now);

                if (data.length > 0) {
                    const lastDataTime = new Date(data[0].created_at).getTime();
                    const diff = now.getTime() - lastDataTime;
                    setConnectionStatus(diff < 60000 ? 'Connected' : 'Disconnected');
                }
            }, 1000);
            return () => clearInterval(timer);
        }, [data]);

        // --- DATA FETCHING ---
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: sensorData, error } = await client
                    .from('new_sensor_data')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (error) throw error;
                if (sensorData) setData(sensorData);
            } catch (err) {
                console.error("Error fetching:", err);
            } finally {
                setLoading(false);
            }
        };

        // Initial Load & Realtime Sub
        useEffect(() => {
            fetchData();
            const sub = client
                .channel('public:new_sensor_data')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'new_sensor_data' }, (payload) => {
                    setData(curr => [payload.new, ...curr].slice(0, 100));
                })
                .subscribe();
            return () => sub.unsubscribe();
        }, []);

        // --- DERIVED DATA ---
        const latest = data[0] || {};
        const gasStatus = useMemo(() => getGasStatus(latest.gas_level), [latest.gas_level]);
        const soundLevel = useMemo(() => getSoundLevel(latest.sound_level), [latest.sound_level]);
        
        const windSpeed = useMemo(() => {
            if (data.length < 2) return 0;
            const now = new Date();
            const twoMinsAgo = new Date(now.getTime() - 2 * 60 * 1000);
            const recent = data.filter(d => new Date(d.created_at) > twoMinsAgo);
            const count = recent.filter(d => d.hall_status === 'DETECTED').length;
            return (count * 2.5).toFixed(1);
        }, [data]);

        const analytics = useMemo(() => {
            if (data.length < 10) return null;
            const currentSet = data.slice(0, 5);
            const previousSet = data.slice(5, 10);
            const avgPressCurr = currentSet.reduce((a, b) => a + b.pressure, 0) / 5;
            const avgPressPrev = previousSet.reduce((a, b) => a + b.pressure, 0) / 5;
            const pressDiff = avgPressCurr - avgPressPrev;
            const avgTempCurr = currentSet.reduce((a, b) => a + Number(b.temperature), 0) / 5;
            const avgTempPrev = previousSet.reduce((a, b) => a + Number(b.temperature), 0) / 5;
            const tempDiff = avgTempCurr - avgTempPrev;

            let forecast = "Stable";
            if (pressDiff < -0.5) forecast = "Storm Alert";
            else if (pressDiff > 0.5) forecast = "Clearing Up";
            else if (avgPressCurr < 1000) forecast = "Low Pressure";
            else forecast = "Fair Weather";

            return {
                pressDiff,
                tempDiff,
                forecast,
                avgTemp: avgTempCurr,
                avgPress: avgPressCurr,
                trendIcon: pressDiff < 0 ? Icons.TrendingDown : (pressDiff > 0 ? Icons.TrendingUp : Icons.Minus)
            };
        }, [data]);

        const statistics = useMemo(() => {
            if (data.length < 20 || !window.ss) return null;
            const ss = window.ss;
            const temps = data.map(d => Number(d.temperature)).filter(t => !isNaN(t));
            const humidity = data.map(d => Number(d.humidity)).filter(h => !isNaN(h));
            const pressure = data.map(d => Number(d.pressure)).filter(p => !isNaN(p));
            
            const calcStats = (arr) => ({
                mean: ss.mean(arr),
                median: ss.median(arr),
                stdDev: ss.standardDeviation(arr),
                variance: ss.variance(arr),
                min: ss.min(arr),
                max: ss.max(arr),
                q1: ss.quantile(arr, 0.25),
                q3: ss.quantile(arr, 0.75),
                iqr: ss.quantile(arr, 0.75) - ss.quantile(arr, 0.25)
            });
            
            return {
                temperature: calcStats(temps),
                humidity: calcStats(humidity),
                pressure: calcStats(pressure)
            };
        }, [data]);

        const forecastData = useMemo(() => {
            if (data.length < 30 || !window.ss) return null;
            const forecastHorizon = 6;
            const forecastSeries = (series) => {
                const n = series.length;
                const recentData = series.slice(0, Math.min(30, n));
                const alpha = 0.3;
                const beta = 0.1;
                const gamma = 0.1;
                let level = recentData[0];
                let trend = recentData[1] - recentData[0];
                let seasonal = new Array(4).fill(0);
                for (let i = 1; i < recentData.length; i++) {
                    const prevLevel = level;
                    level = alpha * recentData[i] + (1 - alpha) * (level + trend);
                    trend = beta * (level - prevLevel) + (1 - beta) * trend;
                    seasonal[i % 4] = gamma * (recentData[i] - level) + (1 - gamma) * seasonal[i % 4];
                }
                const predictions = [];
                for (let i = 1; i <= forecastHorizon; i++) {
                    const forecast = level + i * trend + seasonal[i % 4];
                    predictions.push(forecast);
                }
                return predictions;
            };
            const temps = data.map(d => Number(d.temperature)).filter(t => !isNaN(t));
            const pressures = data.map(d => Number(d.pressure)).filter(p => !isNaN(p));
            const humidities = data.map(d => Number(d.humidity)).filter(h => !isNaN(h));
            return {
                temperature: forecastSeries(temps),
                pressure: forecastSeries(pressures),
                humidity: forecastSeries(humidities)
            };
        }, [data]);

        const filteredData = useMemo(() => {
            let filtered = [...data];
            if (historyFilter.startDate) {
                const start = new Date(historyFilter.startDate).getTime();
                filtered = filtered.filter(d => new Date(d.created_at).getTime() >= start);
            }
            if (historyFilter.endDate) {
                const end = new Date(historyFilter.endDate).getTime() + 86400000;
                filtered = filtered.filter(d => new Date(d.created_at).getTime() < end);
            }
            if (historyFilter.alertsOnly) {
                filtered = filtered.filter(d => d.rain_alert === 'ALERT' || d.gas_alert === 'ALERT');
            }
            filtered.sort((a, b) => {
                const aVal = historyFilter.sortBy === 'created_at' ? new Date(a.created_at).getTime() : Number(a[historyFilter.sortBy]);
                const bVal = historyFilter.sortBy === 'created_at' ? new Date(b.created_at).getTime() : Number(b[historyFilter.sortBy]);
                return historyFilter.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            });
            return filtered;
        }, [data, historyFilter]);

        const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false });

        // --- HANDLE LOGIN SUCCESS ---
        const handleLoginSuccess = () => {
            setActiveTab('dashboard');
        };

        // --- HANDLE LOGOUT ---
        const handleLogout = () => {
            setActiveTab('dashboard');
            setUser(null);
            setData([]);
        };

        // --- LOADING SCREEN ---
        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-3 border-nothing-red border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[var(--text-secondary)] text-sm font-mono">Initializing system...</p>
                    </div>
                </div>
            );
        }

        // --- APP LAYOUT ---
        return (
            <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto transition-colors duration-300 relative">
                <div className="fixed inset-0 bg-dots pointer-events-none z-0"></div>
                
                <header className="relative z-50 mb-12 border-b border-[var(--border-color)] pb-8">
                    {/* Navigation Bar First */}
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <NavBar 
                            activeTab={activeTab} 
                            setTab={setActiveTab} 
                            theme={theme} 
                            toggleTheme={toggleTheme}
                            user={user}
                            onSettingsClick={() => setActiveTab('settings')}
                        />
                        <button 
                            onClick={toggleTheme}
                            className="hidden md:block p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-nothing-red transition-all group shadow-sm"
                            data-tooltip={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            {theme === 'dark' ? <Icons.Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-12 transition-transform" /> : <Icons.Moon className="w-6 h-6 text-blue-500 group-hover:-rotate-12 transition-transform" />}
                        </button>
                    </div>
                    
                    {/* Title Section Below Nav */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 ${connectionStatus === 'Connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500 animate-blink'}`}></div>
                                <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${connectionStatus === 'Connected' ? 'text-green-500' : 'text-nothing-red'}`}>
                                    {connectionStatus === 'Connected' ? 'System Online' : 'System Offline'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-3xl font-bold tracking-tighter leading-none text-[var(--text-primary)]">Environmental Data Monitoring Station</h1>
                            <div className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.15em] font-medium">IoT Data Analytics & Monitoring Dashboard</div>
                        </div>
                        
                        <div className="flex items-center gap-8 self-end md:self-center">
                            <div className="text-right hidden sm:block">
                                <div className="text-4xl font-bold tracking-tight numeric-tabular text-[var(--text-primary)]">{formattedTime}</div>
                                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium">{formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="relative z-10">

                    <main className="animate-fade-in mt-8">
                        {loading && !data.length && activeTab !== 'settings' && activeTab !== 'about' && activeTab !== 'docs' && activeTab !== 'login' ? (
                            <div className="h-64 flex items-center justify-center text-[var(--text-secondary)] font-mono animate-pulse">
                                INITIALIZING SENSORS...
                            </div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && <Dashboard latest={latest} windSpeed={windSpeed} gasStatus={gasStatus} soundLevel={soundLevel} />}
                                {activeTab === 'analytics' && <Analytics analytics={analytics} statistics={statistics} forecast={forecastData} data={data} />}
                                {activeTab === 'history' && <History filteredData={filteredData} data={data} historyFilter={historyFilter} setHistoryFilter={setHistoryFilter} fetchData={fetchData} />}
                                {activeTab === 'about' && <About />}
                                {activeTab === 'docs' && <Documentation />}
                                {activeTab === 'settings' && <UserSettings user={user} onLogout={handleLogout} />}
                                {activeTab === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
                            </>
                        )}
                    </main>

                    <footer className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                        System Operational • ID: {latest.id || 'N/A'} • <span className={connectionStatus === 'Connected' ? 'text-green-500' : 'text-nothing-red'}>{connectionStatus}</span> • {new Date().getFullYear()}
                    </footer>
                </div>
            </div>
        );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
} catch (err) {
    console.error('App Error:', err);
    document.getElementById('root').innerHTML = `
        <div style="padding: 20px; color: red; font-family: monospace; background: #1a1a1a; color: #ff6b6b; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <h1>⚠️ Application Error</h1>
                <p>${err.message}</p>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">Check browser console (F12) for details</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff6b6b; border: none; color: white; cursor: pointer; border-radius: 4px;">Reload Page</button>
            </div>
        </div>
    `;
}
