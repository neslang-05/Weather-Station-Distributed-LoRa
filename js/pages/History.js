const Icons = window.Icons;

window.History = ({ filteredData, data, historyFilter, setHistoryFilter, fetchData }) => {
    // Export Functions
    const exportToCSV = () => {
        const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Rain Alert', 'Gas Alert', 'Sound (dB)', 'Gas Level', 'Rain Level', 'Hall Status'];
        const rows = filteredData.map(d => [
            new Date(d.created_at).toLocaleString(),
            d.temperature,
            d.humidity,
            d.pressure,
            d.rain_alert,
            d.gas_alert,
            d.sound_level,
            d.gas_level,
            d.rain_level,
            d.hall_status
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weather_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const exportToJSON = () => {
        const jsonContent = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weather_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const exportToExcel = () => {
        const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Rain Alert', 'Gas Alert', 'Sound (dB)', 'Gas Level', 'Rain Level', 'Hall Status'];
        let html = '<table><thead><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';
        
        filteredData.forEach(d => {
            html += '<tr>';
            html += `<td>${new Date(d.created_at).toLocaleString()}</td>`;
            html += `<td>${d.temperature}</td>`;
            html += `<td>${d.humidity}</td>`;
            html += `<td>${d.pressure}</td>`;
            html += `<td>${d.rain_alert}</td>`;
            html += `<td>${d.gas_alert}</td>`;
            html += `<td>${d.sound_level}</td>`;
            html += `<td>${d.gas_level}</td>`;
            html += `<td>${d.rain_level}</td>`;
            html += `<td>${d.hall_status}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weather_data_${new Date().toISOString().split('T')[0]}.xls`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            {/* Header & Info Section */}
            <div className="sensor-card p-8">
                <h2 className="text-2xl font-bold tracking-tighter mb-4 text-nothing-red uppercase">Historical Data Stream</h2>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed font-semibold mb-6 max-w-4xl">
                    This archive presents a chronological record of environmental sensor data for analysis, validation, and export. 
                    Data originates from the ESP32 microcontroller, is transmitted via secure HTTPS POST requests, and stored in a Supabase PostgreSQL database. 
                    For optimal dashboard performance, the view defaults to a rolling window of the latest 100 records, though full datasets can be exported.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)] font-mono border-t border-[var(--border-color)] pt-4">
                    <div className="flex items-center gap-2">
                        <Icons.Database className="w-4 h-4 text-nothing-red" />
                        <span>Source: ESP32 → Supabase</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icons.Clock className="w-4 h-4 text-nothing-red" />
                        <span>Retention: Rolling 100 Records</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icons.FileText className="w-4 h-4 text-nothing-red" />
                        <span>Formats: CSV, JSON, Excel</span>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="sensor-card p-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-8 flex items-center gap-2">
                    <Icons.Filter className="w-4 h-4 text-nothing-red" />
                    Data Filters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Date Range Filters */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-3">Start Date</label>
                        <input 
                            type="date" 
                            value={historyFilter.startDate}
                            onChange={(e) => setHistoryFilter({...historyFilter, startDate: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-nothing-red outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-3">End Date</label>
                        <input 
                            type="date" 
                            value={historyFilter.endDate}
                            onChange={(e) => setHistoryFilter({...historyFilter, endDate: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-nothing-red outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-3">Sort By</label>
                        <select 
                            value={historyFilter.sortBy}
                            onChange={(e) => setHistoryFilter({...historyFilter, sortBy: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-nothing-red outline-none transition-all appearance-none"
                        >
                            <option value="created_at">Timestamp</option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                            <option value="pressure">Pressure</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-3">Order</label>
                        <select 
                            value={historyFilter.sortOrder}
                            onChange={(e) => setHistoryFilter({...historyFilter, sortOrder: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-nothing-red outline-none transition-all appearance-none"
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={() => setHistoryFilter({...historyFilter, alertsOnly: !historyFilter.alertsOnly})}
                            className={`w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                historyFilter.alertsOnly 
                                ? 'bg-nothing-red text-white border-nothing-red shadow-lg shadow-red-900/20' 
                                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-nothing-red'
                            }`}
                        >
                            {historyFilter.alertsOnly ? 'Alerts Only ✓' : 'Show All Data'}
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={() => setHistoryFilter({startDate: '', endDate: '', alertsOnly: false, sortBy: 'created_at', sortOrder: 'desc'})}
                    className="mt-8 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-nothing-red transition-colors flex items-center gap-2"
                >
                    <Icons.X className="w-3 h-3" /> Clear All Filters
                </button>
            </div>

            {/* Export Panel */}
            <div className="sensor-card p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                            <Icons.Download className="w-4 h-4 text-blue-500" />
                            Export Data
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">{filteredData.length} records matching current filters</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <button onClick={exportToCSV} className="px-5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-emerald-500 hover:text-emerald-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                            <Icons.FileSpreadsheet className="w-4 h-4" /> CSV
                        </button>
                        <button onClick={exportToJSON} className="px-5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-blue-500 hover:text-blue-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                            <Icons.Code2 className="w-4 h-4" /> JSON
                        </button>
                        <button onClick={exportToExcel} className="px-5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-500 hover:text-purple-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                            <Icons.Table2 className="w-4 h-4" /> Excel
                        </button>
                        <button onClick={fetchData} className="px-5 py-2.5 bg-nothing-red text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="sensor-card overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                        Historical Data Stream • {filteredData.length} Records
                    </h2>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--bg-primary)] text-[var(--text-secondary)] sticky top-0 z-10">
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Time of data capture">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Ambient Temperature (DS18B20)">Temp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Relative Humidity (DHT11)">Hum</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Atmospheric Pressure (BMP180)">Press</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Wind Speed (Hall Effect)">Wind</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Rain Sensor Value">Rain</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Gas Sensor Value (MQ-2)">Gas</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" title="Noise Level (Sound Sensor)">Sound</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">
                                        No data matches the current filters
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.id} className="hover:bg-[var(--bg-primary)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-primary)]">{new Date(row.created_at).toLocaleTimeString()}</div>
                                            <div className="text-[10px] font-medium text-[var(--text-secondary)] uppercase">{new Date(row.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold numeric-tabular">{row.temperature?.toFixed(1)}°C</td>
                                        <td className="px-6 py-4 text-xs font-bold numeric-tabular">{row.humidity}%</td>
                                        <td className="px-6 py-4 text-xs font-bold numeric-tabular">{Math.round(row.pressure)} hPa</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-tighter uppercase ${row.hall_status === 'DETECTED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
                                                {row.hall_status === 'DETECTED' ? 'Active' : 'Calm'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-tighter uppercase ${row.rain_alert === 'ALERT' ? 'bg-nothing-red text-white shadow-sm' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
                                                {row.rain_alert === 'ALERT' ? 'Rain' : 'Dry'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-tighter uppercase ${row.gas_alert === 'ALERT' ? 'bg-nothing-red text-white shadow-sm' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
                                                {row.gas_alert === 'ALERT' ? 'Leak' : 'OK'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold numeric-tabular text-[var(--text-secondary)]">{row.sound_level} dB</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

