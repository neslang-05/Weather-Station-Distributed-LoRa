const { useState, useEffect, useMemo } = React;
const { createClient } = supabase;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

// --- SUPABASE CONFIG ---
const SUPABASE_URL = "https://wpiamopnovthqpesfbuw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFtb3Bub3Z0aHFwZXNmYnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI2ODYsImV4cCI6MjA3OTc5ODY4Nn0.cJzs_6F_W971tRs8TkvYHUF_CljQSZ2lqgwsMVLqNwE";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ICONS (Inline SVG for reliability) ---
const Icons = {
    Thermometer: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
    Droplets: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.8-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 10a6 6 0 0 0-1.11 7.7"/><path d="M18 17.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S18.29 7.75 18 6.3c-.29 1.45-1.14 2.8-2.29 3.76S14 12.1 14 13.25c0 2.22 1.8 4.05 4 4.05z"/></svg>,
    Gauge: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
    Wind: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>,
    Waves: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>,
    Speaker: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.785a1 1 0 0 0-1.272-.736L4.5 5.5H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2.5l5.228 1.451A1 1 0 0 0 11 19.215V4.785z"/><path d="M15.5 8a4.5 4.5 0 0 1 0 8"/></svg>,
    CloudRain: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 20v-4"/><path d="M8 20v-4"/><path d="M12 20v-4"/></svg>,
    Info: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    List: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    Activity: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    TrendingUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
};

// --- COMPONENTS ---

// 1. Reusable Sensor Card (Matching Reference Image 55208c)
const SensorCard = ({ icon: Icon, label, value, unit, status, subtext, color = "text-white" }) => (
    <div className="sensor-card h-48 p-4 flex flex-col justify-between group">
        {/* Dotted Background */}
        <div className="absolute inset-0 bg-dots pointer-events-none"></div>
        
        {/* Header: Icon + Status Dot */}
        <div className="relative flex justify-between items-start z-10">
            <div className="p-2 border border-[#333] rounded bg-black">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            {/* Status Dot */}
            <div className={`w-2 h-2 rounded-full ${status === 'alert' ? 'bg-nothing-red animate-pulse' : 'bg-green-500'}`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</div>
            <div className={`text-4xl font-normal font-dot ${color}`}>
                {value} <span className="text-sm font-sans text-gray-500 ml-1">{unit}</span>
            </div>
            {subtext && (
                <div className="mt-2 pt-2 border-t border-[#333] text-[10px] text-gray-400 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'alert' ? 'bg-nothing-red' : 'bg-blue-500'}`}></div>
                        {subtext}
                </div>
            )}
        </div>
    </div>
);

// 2. Navigation Tab
const NavBar = ({ activeTab, setTab }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity },
        { id: 'history', label: 'History', icon: Icons.List },
        { id: 'predictions', label: 'Predictions', icon: Icons.TrendingUp },
        { id: 'about', label: 'About', icon: Icons.Info },
    ];

    return (
        <nav className="flex gap-1 bg-[#111] p-1 rounded-full border border-[#333] mb-6 inline-flex">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-nothing-red text-white shadow-lg shadow-red-900/20' 
                        : 'text-gray-400 hover:text-white hover:bg-[#222]'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [connectionStatus, setConnectionStatus] = useState('Checking...');

    // History Tab State
    const [historyPage, setHistoryPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);
    const [historyFilter, setHistoryFilter] = useState('');

    // --- CLOCK & CONNECTION TICKER ---
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Connection Check (Wait 1 minute timeout)
            if (data.length > 0) {
                const lastDataTime = new Date(data[0].created_at).getTime();
                const diff = now.getTime() - lastDataTime;
                // 60000ms = 1 minute
                setConnectionStatus(diff < 60000 ? 'Connected' : 'Disconnected');
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [data]);

    // --- DATA FETCHING ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch more rows for history
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
                setData(curr => [payload.new, ...curr].slice(0, 100)); // Keep last 100 in memory
            })
            .subscribe();
        return () => sub.unsubscribe();
    }, []);

    // --- DERIVED DATA ---
    const latest = data[0] || {};
    
    // Wind Speed Calc
    const windSpeed = useMemo(() => {
        if (data.length < 2) return 0;
        const now = new Date();
        const twoMinsAgo = new Date(now.getTime() - 2 * 60 * 1000);
        const recent = data.filter(d => new Date(d.created_at) > twoMinsAgo);
        const count = recent.filter(d => d.hall_status === 'DETECTED').length;
        return (count * 2.5).toFixed(1); // Calibration factor
    }, [data]);

    // Date Formatting
    const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false });

    // --- RENDER PAGES ---

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Temp */}
            <SensorCard 
                icon={Icons.Thermometer} 
                label="Temperature" 
                value={latest.temperature?.toFixed(1) || '--'} 
                unit="°C"
                status="ok"
                subtext="Live Monitoring"
            />
            
            {/* 2. Humidity */}
            <SensorCard 
                icon={Icons.Droplets} 
                label="Humidity" 
                value={latest.humidity?.toFixed(1) || '--'} 
                unit="%"
                status="ok"
                subtext={latest.humidity > 80 ? "High Humidity" : "Normal"}
            />

            {/* 3. Pressure */}
            <SensorCard 
                icon={Icons.Gauge} 
                label="Atmospheric Pressure" 
                value={Math.round(latest.pressure) || '--'} 
                unit="hPa"
                status="ok"
                subtext="Barometric"
            />

            {/* 4. Wind */}
            <SensorCard 
                icon={Icons.Wind} 
                label="Wind Speed" 
                value={windSpeed} 
                unit="km/h"
                status="ok"
                subtext={latest.hall_status === "DETECTED" ? "Hall Effect Active" : "Calm"}
            />

            {/* 5. Gas */}
            <SensorCard 
                icon={Icons.Waves} 
                label="Gas Level" 
                value={latest.gas_level || '--'} 
                unit="ADC"
                status={latest.gas_alert === 'ALERT' ? 'alert' : 'ok'}
                color={latest.gas_alert === 'ALERT' ? 'text-nothing-red' : 'text-white'}
                subtext={latest.gas_alert === 'ALERT' ? "GAS LEAK DETECTED" : "Air Quality Safe"}
            />

            {/* 6. Sound */}
            <SensorCard 
                icon={Icons.Speaker} 
                label="Sound Level" 
                value={latest.sound_level || '--'} 
                unit="dB"
                status="ok"
                subtext="Ambient Noise"
            />

            {/* 7. Rain (Double Width) */}
            <div className="sensor-card h-48 p-4 flex flex-col justify-between group md:col-span-2">
                    <div className="absolute inset-0 bg-dots pointer-events-none"></div>
                    <div className="relative flex justify-between items-start z-10">
                    <div className="p-2 border border-[#333] rounded bg-black">
                        <Icons.CloudRain className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className={`w-2 h-2 rounded-full ${latest.rain_alert === 'ALERT' ? 'bg-nothing-red animate-pulse' : 'bg-green-500'}`}></div>
                </div>
                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Raindrop Detector</div>
                    <div className={`text-4xl font-normal font-dot ${latest.rain_alert === 'ALERT' ? 'text-nothing-red' : 'text-white'}`}>
                        {latest.rain_alert === 'ALERT' ? "RAINING" : "DRY"}
                    </div>
                        <div className="mt-2 pt-2 border-t border-[#333] text-[10px] text-gray-400">
                        Analog Value: {latest.rain_level}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHistory = () => {
        // 1. Filter Data
        const filteredData = data.filter(item => {
            if (!historyFilter) return true;
            const searchStr = historyFilter.toLowerCase();
            const dateStr = new Date(item.created_at).toLocaleString().toLowerCase();
            return dateStr.includes(searchStr) || 
                   item.temperature?.toString().includes(searchStr) ||
                   item.humidity?.toString().includes(searchStr);
        });

        // 2. Pagination
        const totalPages = Math.ceil(filteredData.length / historyItemsPerPage);
        const startIndex = (historyPage - 1) * historyItemsPerPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + historyItemsPerPage);

        // 3. Statistics (on filtered data)
        const stats = useMemo(() => {
            if (filteredData.length === 0) return null;
            const temps = filteredData.map(d => d.temperature);
            const hums = filteredData.map(d => d.humidity);
            return {
                temp: {
                    min: Math.min(...temps).toFixed(1),
                    max: Math.max(...temps).toFixed(1),
                    avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
                },
                hum: {
                    min: Math.min(...hums).toFixed(1),
                    max: Math.max(...hums).toFixed(1),
                    avg: (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(1)
                }
            };
        }, [filteredData]);

        // 4. Chart Data (Reverse for chronological order)
        const chartData = [...filteredData].reverse();

        // 5. Export Functions
        const exportCSV = () => {
            const headers = ["Time", "Temperature", "Humidity", "Pressure", "Wind", "Rain", "Gas"];
            const rows = filteredData.map(row => [
                new Date(row.created_at).toLocaleString(),
                row.temperature,
                row.humidity,
                row.pressure,
                row.hall_status,
                row.rain_alert,
                row.gas_alert
            ]);
            const csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n" 
                + rows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "weather_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const exportJSON = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredData));
            const link = document.createElement("a");
            link.setAttribute("href", dataStr);
            link.setAttribute("download", "weather_data.json");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <div className="space-y-6">
                {/* Controls & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="sensor-card p-6 lg:col-span-1 flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase text-gray-500">Data Controls</h3>
                        
                        {/* Filter */}
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Search / Filter</label>
                            <input 
                                type="text" 
                                placeholder="Search date, temp..." 
                                className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 text-sm rounded focus:border-gray-500 outline-none"
                                value={historyFilter}
                                onChange={(e) => { setHistoryFilter(e.target.value); setHistoryPage(1); }}
                            />
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-2">
                            <button onClick={exportCSV} className="flex-1 bg-[#222] hover:bg-[#333] text-white text-xs py-2 rounded border border-[#333]">
                                Export CSV
                            </button>
                            <button onClick={exportJSON} className="flex-1 bg-[#222] hover:bg-[#333] text-white text-xs py-2 rounded border border-[#333]">
                                Export JSON
                            </button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="sensor-card p-6 lg:col-span-2">
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Quick Statistics (Visible Data)</h3>
                        {stats ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#111] p-3 rounded border border-[#222]">
                                    <div className="text-xs text-gray-500">Avg Temp</div>
                                    <div className="text-xl font-mono text-white">{stats.temp.avg}°C</div>
                                </div>
                                <div className="bg-[#111] p-3 rounded border border-[#222]">
                                    <div className="text-xs text-gray-500">Max Temp</div>
                                    <div className="text-xl font-mono text-red-400">{stats.temp.max}°C</div>
                                </div>
                                <div className="bg-[#111] p-3 rounded border border-[#222]">
                                    <div className="text-xs text-gray-500">Avg Humidity</div>
                                    <div className="text-xl font-mono text-white">{stats.hum.avg}%</div>
                                </div>
                                <div className="bg-[#111] p-3 rounded border border-[#222]">
                                    <div className="text-xs text-gray-500">Max Humidity</div>
                                    <div className="text-xl font-mono text-blue-400">{stats.hum.max}%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No data available</div>
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div className="sensor-card p-4 h-80">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Trend Visualization</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis 
                                dataKey="created_at" 
                                tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                stroke="#666"
                                tick={{fontSize: 10}}
                            />
                            <YAxis stroke="#666" tick={{fontSize: 10}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}}
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="temperature" stroke="#ff4d4d" dot={false} name="Temp (°C)" />
                            <Line type="monotone" dataKey="humidity" stroke="#3b82f6" dot={false} name="Humidity (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Table */}
                <div className="bg-[#0a0a0a] border border-[#333] rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-[#333] flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Data Log</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Rows per page:</span>
                            <select 
                                value={historyItemsPerPage} 
                                onChange={(e) => { setHistoryItemsPerPage(Number(e.target.value)); setHistoryPage(1); }}
                                className="bg-[#111] border border-[#333] text-white text-xs rounded px-2 py-1 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#111] text-gray-500">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Temp</th>
                                    <th className="p-3">Hum</th>
                                    <th className="p-3">Pres</th>
                                    <th className="p-3">Wind</th>
                                    <th className="p-3">Rain</th>
                                    <th className="p-3">Gas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222] text-gray-300">
                                {paginatedData.map((row) => (
                                    <tr key={row.id} className="hover:bg-[#151515]">
                                        <td className="p-3 text-gray-500">{new Date(row.created_at).toLocaleTimeString()}</td>
                                        <td className="p-3">{row.temperature?.toFixed(1)}°</td>
                                        <td className="p-3">{row.humidity}%</td>
                                        <td className="p-3">{Math.round(row.pressure)}</td>
                                        <td className="p-3">{row.hall_status === 'DETECTED' ? 'ACTV' : '-'}</td>
                                        <td className={`p-3 ${row.rain_alert === 'ALERT' ? 'text-nothing-red font-bold' : ''}`}>
                                            {row.rain_alert === 'ALERT' ? 'RAIN' : 'DRY'}
                                        </td>
                                        <td className={`p-3 ${row.gas_alert === 'ALERT' ? 'text-nothing-red font-bold' : ''}`}>
                                            {row.gas_alert === 'ALERT' ? 'LEAK' : 'OK'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-[#333] flex justify-between items-center">
                        <button 
                            onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                            disabled={historyPage === 1}
                            className="text-xs bg-[#222] px-3 py-1 rounded hover:text-white text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-500">
                            Page {historyPage} of {totalPages || 1}
                        </span>
                        <button 
                            onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}
                            disabled={historyPage === totalPages || totalPages === 0}
                            className="text-xs bg-[#222] px-3 py-1 rounded hover:text-white text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderPredictions = () => {
        if (data.length < 10) {
            return (
                <div className="text-center text-gray-500 py-12">
                    <div className="mb-4">NOT ENOUGH DATA FOR PREDICTIONS</div>
                    <div className="text-xs">Need at least 10 data points. Current: {data.length}</div>
                </div>
            );
        }

        // 1. Prepare Data for Linear Regression (Temperature)
        // We use the latest 50 points for better local trend
        const recentData = data.slice(0, 50).reverse(); // Reverse to have chronological order
        const n = recentData.length;
        
        // X = Time (minutes from start), Y = Temperature
        const startTime = new Date(recentData[0].created_at).getTime();
        const points = recentData.map(d => {
            const x = (new Date(d.created_at).getTime() - startTime) / 60000; // minutes
            const y = d.temperature;
            return { x, y };
        });

        const sumX = points.reduce((acc, p) => acc + p.x, 0);
        const sumY = points.reduce((acc, p) => acc + p.y, 0);
        const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
        const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predict next hour (current last time + 60 mins)
        const lastTimeX = points[points.length - 1].x;
        const nextHourX = lastTimeX + 60;
        const predictedTemp = slope * nextHourX + intercept;
        const trendDirection = slope > 0.02 ? 'Rising' : slope < -0.02 ? 'Falling' : 'Stable';

        // 2. Pressure Trend (Simple Delta)
        const currentPressure = recentData[recentData.length - 1].pressure;
        const oldPressure = recentData[0].pressure;
        const pressureDiff = currentPressure - oldPressure;
        const pressureTrend = pressureDiff > 1 ? 'Rising' : pressureDiff < -1 ? 'Falling' : 'Stable';
        
        // 3. Rain Prediction Logic (Rule based)
        // Falling pressure + High Humidity = Rain likely
        const currentHum = recentData[recentData.length - 1].humidity;
        let rainPrediction = "Unlikely";
        let rainColor = "text-green-500";
        
        if (pressureTrend === 'Falling' && currentHum > 70) {
            rainPrediction = "High Chance";
            rainColor = "text-nothing-red";
        } else if (currentHum > 85) {
            rainPrediction = "Possible";
            rainColor = "text-yellow-500";
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prediction Summary Card */}
                <div className="sensor-card p-6 md:col-span-2 border-l-4 border-l-blue-500">
                    <h2 className="text-xl font-dot mb-2">Edge ML Forecast</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Predictions based on linear regression of last {n} data points.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-xs uppercase text-gray-500 mb-1">Temp Trend</div>
                            <div className="text-2xl font-mono">{trendDirection}</div>
                            <div className="text-xs text-gray-600 mt-1">Slope: {slope.toFixed(4)} °C/min</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase text-gray-500 mb-1">Next Hour Temp</div>
                            <div className="text-2xl font-mono text-blue-400">{predictedTemp.toFixed(1)}°C</div>
                            <div className="text-xs text-gray-600 mt-1">Estimated</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase text-gray-500 mb-1">Rain Forecast</div>
                            <div className={`text-2xl font-mono ${rainColor}`}>{rainPrediction}</div>
                            <div className="text-xs text-gray-600 mt-1">Based on Pressure/Hum</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="sensor-card p-6">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Model Metrics</h3>
                    <div className="space-y-4 text-sm font-mono">
                        <div className="flex justify-between border-b border-[#222] pb-2">
                            <span>Sample Size</span>
                            <span className="text-white">{n} points</span>
                        </div>
                        <div className="flex justify-between border-b border-[#222] pb-2">
                            <span>Time Span</span>
                            <span className="text-white">{Math.round(lastTimeX)} mins</span>
                        </div>
                        <div className="flex justify-between border-b border-[#222] pb-2">
                            <span>R² Approximation</span>
                            <span className="text-white">Linear</span>
                        </div>
                    </div>
                </div>

                <div className="sensor-card p-6">
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Algorithm Logic</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            The system uses <strong>Ordinary Least Squares (OLS)</strong> regression to calculate the temperature gradient. 
                            <br/><br/>
                            y = {slope.toFixed(2)}x + {intercept.toFixed(2)}
                            <br/><br/>
                            Pressure tendency analysis is used to correlate barometric changes with humidity saturation for rain probability.
                        </p>
                </div>
            </div>
        );
    };

    const renderAbout = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Info */}
            <div className="space-y-6">
                <div className="sensor-card p-6 bg-dots">
                        <h2 className="text-xl font-dot mb-4 text-nothing-red">About Project</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                        This IoT Weather Station is a comprehensive environmental monitoring system powered by ESP32. 
                        It utilizes a sensor fusion approach to gather real-time data on atmospheric conditions, 
                        including Temperature (DS18B20), Humidity (DHT11), Pressure (BMP180), Rain, Gas, and Noise levels.
                        </p>
                        <p className="text-sm text-gray-400 mt-4">
                        Data is transmitted securely to Supabase and visualized in real-time on this Nothing OS-inspired dashboard.
                        </p>
                </div>
                
                    <div className="sensor-card p-6">
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Development Team</h3>
                        <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#222] rounded-full flex items-center justify-center text-xs">01</div>
                            <div>
                                <div className="font-bold">Lead Developer</div>
                                <div className="text-gray-500 text-xs">Embedded Systems & Frontend</div>
                            </div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#222] rounded-full flex items-center justify-center text-xs">02</div>
                            <div>
                                <div className="font-bold">Sensor Fusion Team</div>
                                <div className="text-gray-500 text-xs">Hardware Calibration</div>
                            </div>
                        </li>
                        </ul>
                </div>
            </div>

            {/* Future Enhancements */}
            <div className="space-y-6">
                    <div className="sensor-card p-6 border-l-4 border-l-nothing-red">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Icons.Activity className="w-5 h-5 text-nothing-red"/>
                        Future Roadmap
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-mono text-sm mb-1">LoRa Integration</h4>
                                <p className="text-xs text-gray-500">
                                    Implementing Long Range (LoRa) peer-to-peer communication to enable sensor nodes to transmit data over kilometers without WiFi dependency.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-mono text-sm mb-1">Predictive Analytics</h4>
                                <p className="text-xs text-gray-500">
                                    Using historical data to predict local weather patterns using simple ML models on the edge.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-mono text-sm mb-1">Solar Power</h4>
                                <p className="text-xs text-gray-500">
                                    Transitioning to a fully autonomous power system with solar panels and BMS.
                                </p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );

    // --- MAIN LAYOUT ---
    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
            
            {/* TOP HEADER ROW */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#333] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-nothing-red' : 'bg-gray-500 animate-blink'}`}></div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-nothing-red">
                            {connectionStatus === 'Connected' ? 'Live Monitoring' : 'Offline / Reconnecting'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-normal tracking-tight">Weather Station</h1>
                    <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">IoT Sensor Dashboard</div>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-mono font-light">{formattedTime}</div>
                    <div className="text-sm text-gray-500 font-mono">{formattedDate}</div>
                </div>
            </header>

            {/* NAVIGATION */}
            <NavBar activeTab={activeTab} setTab={setActiveTab} />

            {/* DYNAMIC CONTENT */}
            <main className="animate-fade-in">
                {loading && !data.length ? (
                    <div className="h-64 flex items-center justify-center text-gray-500 font-mono animate-pulse">
                        INITIALIZING SENSORS...
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'history' && renderHistory()}
                        {activeTab === 'predictions' && renderPredictions()}
                        {activeTab === 'about' && renderAbout()}
                    </>
                )}
            </main>

            <footer className="mt-12 text-center text-[10px] text-gray-700 font-mono uppercase">
                System Operational • ID: {latest.id || 'N/A'} • {connectionStatus}
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);