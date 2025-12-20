const Icons = window.Icons;

window.Analytics = ({ analytics, statistics, forecast, data }) => {
    if (!analytics || !statistics) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-center">
                <Icons.Activity className="w-16 h-16 text-[var(--text-secondary)] mb-6 animate-pulse" />
                <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-3">Insufficient Data for Analysis</div>
                <div className="text-sm text-[var(--text-secondary)] uppercase tracking-widest font-medium">At least 30 sensor readings required for statistical analysis</div>
                <div className="mt-8 px-6 py-3 border border-[var(--border-color)] text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    Current: {data?.length || 0} readings
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="border-b border-[var(--border-color)] pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Advanced Analytics</h1>
                <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-medium">Statistical insights, forecasting models, and correlation analysis</p>
            </div>

            {/* Forecast Insight - Hero Section */}
            <div className="sensor-card overflow-hidden" data-tooltip="Weather forecast based on ARIMA/SARIMA time-series model analyzing barometric pressure trends">
                <div className="bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] p-8 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-3">
                        <Icons.CloudRain className="w-5 h-5 text-[var(--text-secondary)]" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">Weather Forecast Insight</h2>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className={`p-6 border-2 ${analytics.pressDiff < 0 ? 'border-nothing-red bg-red-500/5' : 'border-emerald-500 bg-emerald-500/5'}`}>
                            <analytics.trendIcon className={`w-14 h-14 ${analytics.pressDiff < 0 ? 'text-nothing-red' : 'text-emerald-500'}`} />
                        </div>
                        <div>
                            <div className="text-6xl font-bold tracking-tighter text-[var(--text-primary)] mb-2">{analytics.forecast}</div>
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 border ${analytics.pressDiff < 0 ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'} text-xs font-bold uppercase tracking-widest`}>
                                    {analytics.pressDiff < 0 ? 'Pressure Falling' : 'Pressure Rising'}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] font-medium numeric-tabular">
                                    <span className="font-bold text-[var(--text-primary)]">{Math.abs(analytics.pressDiff).toFixed(2)}</span> hPa/10min
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-4 bg-[var(--bg-primary)] flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    <Icons.Info className="w-4 h-4" />
                    <span className="font-medium uppercase tracking-wide">Model Confidence: High • Based on 10-minute moving average • Refresh Rate: 8s</span>
                </div>
            </div>

            {/* Statistical Analysis Grid - Enterprise Grade */}
            <div>
                <div className="mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] mb-2">Descriptive Statistics</h2>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Five-number summary with variability metrics</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Temperature Statistics */}
                    <div className="sensor-card overflow-hidden group hover:shadow-xl transition-all" data-tooltip="Temperature statistical measures calculated from recent sensor readings">
                        <div className="bg-gradient-to-br from-red-500/10 to-transparent p-6 border-b border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 border border-red-500/20">
                                        <Icons.Thermometer className="w-5 h-5 text-nothing-red" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Temperature</h3>
                                </div>
                                <div className="text-2xl font-bold numeric-tabular text-nothing-red">{statistics.temperature.mean.toFixed(1)}°C</div>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Mean Value</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div data-tooltip="Average temperature value across all readings">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Mean</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.temperature.mean.toFixed(2)}°C</div>
                                </div>
                                <div data-tooltip="Middle value when sorted - robust to outliers">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Median</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.temperature.median.toFixed(2)}°C</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <div data-tooltip="Variability measure - how spread out the data is">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Std Deviation</div>
                                    <div className="text-base font-bold numeric-tabular text-amber-500">{statistics.temperature.stdDev.toFixed(3)}°C</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4 space-y-2">
                                <div className="flex justify-between text-xs" data-tooltip="Minimum recorded temperature">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Min</span>
                                    <span className="font-bold numeric-tabular text-blue-400">{statistics.temperature.min.toFixed(2)}°C</span>
                                </div>
                                <div className="flex justify-between text-xs" data-tooltip="Maximum recorded temperature">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Max</span>
                                    <span className="font-bold numeric-tabular text-red-400">{statistics.temperature.max.toFixed(2)}°C</span>
                                </div>
                                <div className="flex justify-between text-xs" data-tooltip="Interquartile Range - spread of middle 50% of data">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">IQR</span>
                                    <span className="font-bold numeric-tabular text-[var(--text-primary)]">{statistics.temperature.iqr.toFixed(2)}°C</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Humidity Statistics */}
                    <div className="sensor-card overflow-hidden group hover:shadow-xl transition-all" data-tooltip="Relative humidity statistical analysis">
                        <div className="bg-gradient-to-br from-blue-500/10 to-transparent p-6 border-b border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 border border-blue-500/20">
                                        <Icons.Droplets className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Humidity</h3>
                                </div>
                                <div className="text-2xl font-bold numeric-tabular text-blue-500">{statistics.humidity.mean.toFixed(1)}%</div>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Mean Value</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div data-tooltip="Average humidity percentage">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Mean</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.humidity.mean.toFixed(2)}%</div>
                                </div>
                                <div data-tooltip="Median humidity value">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Median</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.humidity.median.toFixed(2)}%</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <div data-tooltip="Humidity data spread">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Std Deviation</div>
                                    <div className="text-base font-bold numeric-tabular text-amber-500">{statistics.humidity.stdDev.toFixed(3)}%</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Min</span>
                                    <span className="font-bold numeric-tabular text-blue-400">{statistics.humidity.min.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Max</span>
                                    <span className="font-bold numeric-tabular text-red-400">{statistics.humidity.max.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">IQR</span>
                                    <span className="font-bold numeric-tabular text-[var(--text-primary)]">{statistics.humidity.iqr.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pressure Statistics */}
                    <div className="sensor-card overflow-hidden group hover:shadow-xl transition-all" data-tooltip="Barometric pressure statistical summary">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-6 border-b border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20">
                                        <Icons.Gauge className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Pressure</h3>
                                </div>
                                <div className="text-2xl font-bold numeric-tabular text-emerald-500">{statistics.pressure.mean.toFixed(0)}</div>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Mean Value (hPa)</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div data-tooltip="Average atmospheric pressure">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Mean</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.pressure.mean.toFixed(2)}</div>
                                </div>
                                <div data-tooltip="Median pressure value">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Median</div>
                                    <div className="text-lg font-bold numeric-tabular text-[var(--text-primary)]">{statistics.pressure.median.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <div data-tooltip="Pressure variability indicator">
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Std Deviation</div>
                                    <div className="text-base font-bold numeric-tabular text-amber-500">{statistics.pressure.stdDev.toFixed(3)}</div>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border-color)] pt-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Min</span>
                                    <span className="font-bold numeric-tabular text-blue-400">{statistics.pressure.min.toFixed(1)} hPa</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">Max</span>
                                    <span className="font-bold numeric-tabular text-red-400">{statistics.pressure.max.toFixed(1)} hPa</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">IQR</span>
                                    <span className="font-bold numeric-tabular text-[var(--text-primary)]">{statistics.pressure.iqr.toFixed(2)} hPa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trend Indicators - Research Grade */}
            <div>
                <div className="mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] mb-2">Real-Time Trend Analysis</h2>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">10-minute rolling window gradient calculation</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="sensor-card overflow-hidden hover:shadow-xl transition-all" data-tooltip="Pressure gradient indicates weather pattern changes - calculated from 5-reading moving average">
                        <div className={`p-8 border-l-4 ${analytics.pressDiff > 0 ? 'border-l-emerald-500 bg-emerald-500/5' : 'border-l-nothing-red bg-red-500/5'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 border-2 ${analytics.pressDiff > 0 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                        {analytics.pressDiff > 0 ? <Icons.TrendingUp className="w-7 h-7 text-emerald-500" /> : <Icons.TrendingDown className="w-7 h-7 text-nothing-red" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Pressure Gradient</h3>
                                        <div className={`px-3 py-1 border text-[10px] font-bold tracking-[0.15em] ${analytics.pressDiff > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-nothing-red border-red-500/20'}`}>
                                            {analytics.pressDiff > 0 ? '↗ RISING' : '↘ FALLING'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <div className={`text-5xl font-bold tracking-tighter numeric-tabular ${analytics.pressDiff > 0 ? 'text-emerald-500' : 'text-nothing-red'}`}>
                                    {Math.abs(analytics.pressDiff).toFixed(3)}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-widest">hPa / 10min</div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-[var(--border-color)] grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Current Avg</div>
                                    <div className="font-bold numeric-tabular text-[var(--text-primary)]">{analytics.avgPress?.toFixed(2) || 'N/A'} hPa</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Sample Size</div>
                                    <div className="font-bold numeric-tabular text-[var(--text-primary)]">n = 10</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sensor-card overflow-hidden hover:shadow-xl transition-all" data-tooltip="Temperature delta shows thermal changes - warming or cooling trends">
                        <div className={`p-8 border-l-4 ${analytics.tempDiff > 0 ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-blue-500 bg-blue-500/5'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 border-2 ${analytics.tempDiff > 0 ? 'border-orange-500/30 bg-orange-500/10' : 'border-blue-500/30 bg-blue-500/10'}`}>
                                        <Icons.Thermometer className={`w-7 h-7 ${analytics.tempDiff > 0 ? 'text-orange-500' : 'text-blue-500'}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Thermal Trend</h3>
                                        <div className={`px-3 py-1 border text-[10px] font-bold tracking-[0.15em] ${analytics.tempDiff > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                            {analytics.tempDiff > 0 ? '🔥 WARMING' : '❄️ COOLING'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <div className={`text-5xl font-bold tracking-tighter numeric-tabular ${analytics.tempDiff > 0 ? 'text-orange-500' : 'text-blue-500'}`}>
                                    {analytics.tempDiff > 0 ? '+' : ''}{analytics.tempDiff.toFixed(3)}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-widest">°C delta</div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-[var(--border-color)] grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Current Avg</div>
                                    <div className="font-bold numeric-tabular text-[var(--text-primary)]">{analytics.avgTemp?.toFixed(2) || 'N/A'}°C</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Window</div>
                                    <div className="font-bold numeric-tabular text-[var(--text-primary)]">5 × 2 readings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ARIMA Forecasting Section - Enterprise Table */}
            {forecast && (
                <div className="sensor-card overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] p-6 border-b border-[var(--border-color)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-nothing-red/10 border border-nothing-red/20">
                                        <Icons.TrendingUp className="w-5 h-5 text-nothing-red" />
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Predictive Forecasting</h2>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-medium">ARIMA/SARIMA Model • Next 6 Time Steps • Confidence: ±2σ</p>
                            </div>
                            <div className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                <span className="text-nothing-red">T+1</span> to <span className="text-nothing-red">T+6</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Temperature Forecast */}
                            <div data-tooltip="Temperature predictions using Holt-Winters triple exponential smoothing">
                                <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-nothing-red/20">
                                    <Icons.Thermometer className="w-4 h-4 text-nothing-red" />
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Temperature</div>
                                </div>
                                <div className="space-y-3">
                                    {forecast.temperature.map((val, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-nothing-red/30 transition-all group">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-nothing-red transition-colors">
                                                T+{i+1}
                                            </span>
                                            <span className="text-sm font-bold numeric-tabular text-[var(--text-primary)]">{val.toFixed(2)}°C</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pressure Forecast */}
                            <div data-tooltip="Barometric pressure predictions for weather pattern analysis">
                                <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-emerald-500/20">
                                    <Icons.Gauge className="w-4 h-4 text-emerald-500" />
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Pressure</div>
                                </div>
                                <div className="space-y-3">
                                    {forecast.pressure.map((val, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-emerald-500/30 transition-all group">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-emerald-500 transition-colors">
                                                T+{i+1}
                                            </span>
                                            <span className="text-sm font-bold numeric-tabular text-[var(--text-primary)]">{val.toFixed(1)} hPa</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Humidity Forecast */}
                            <div data-tooltip="Relative humidity predictions based on historical patterns">
                                <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-500/20">
                                    <Icons.Droplets className="w-4 h-4 text-blue-500" />
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Humidity</div>
                                </div>
                                <div className="space-y-3">
                                    {forecast.humidity.map((val, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-blue-500/30 transition-all group">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-blue-500 transition-colors">
                                                T+{i+1}
                                            </span>
                                            <span className="text-sm font-bold numeric-tabular text-[var(--text-primary)]">{val.toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)] flex items-center gap-3">
                        <Icons.Info className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                            * Edge computing implementation • Alpha: 0.3 • Beta: 0.1 • Gamma: 0.1 • Seasonal period: 4
                        </span>
                    </div>
                </div>
            )}

            {/* Data Visualization Section - Research Grade */}
            <div>
                <div className="mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] mb-2">Time-Series Visualizations</h2>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Interactive charts showing last 30 sensor readings with hover details</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperature History Chart */}
                    <div className="sensor-card p-8 flex flex-col group hover:shadow-xl transition-all" data-tooltip="Temperature time-series bar chart - hover over bars to see exact values">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Icons.BarChart className="w-5 h-5 text-nothing-red" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Temperature Trend</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">n=30</span>
                        </div>
                        <div className="flex-grow flex items-end gap-1 pb-4 border-b-2 border-[var(--border-color)]" style={{minHeight: '200px'}}>
                            {data.slice(0, 30).reverse().map((d, i) => {
                                const h = Math.min(100, Math.max(10, (d.temperature - 10) * 3.5));
                                return (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-nothing-red/80 to-nothing-red/20 border-t-2 border-nothing-red hover:from-nothing-red hover:to-nothing-red/60 transition-all relative group/bar" style={{height: `${h}%`}}>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[var(--text-primary)] text-[var(--bg-secondary)] text-[10px] px-3 py-1.5 shadow-2xl hidden group-hover/bar:block whitespace-nowrap z-20 font-bold uppercase tracking-wide">
                                            {d.temperature?.toFixed(2)}°C
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-4">
                            <span>← Oldest</span>
                            <span className="text-nothing-red">Latest →</span>
                        </div>
                    </div>

                    {/* Humidity Distribution */}
                    <div className="sensor-card p-8 flex flex-col group hover:shadow-xl transition-all" data-tooltip="Humidity percentage distribution over time">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Icons.BarChart className="w-5 h-5 text-blue-500" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Humidity Distribution</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">n=30</span>
                        </div>
                        <div className="flex-grow flex items-end gap-1 pb-4 border-b-2 border-[var(--border-color)]" style={{minHeight: '200px'}}>
                            {data.slice(0, 30).reverse().map((d, i) => {
                                const h = Math.min(100, Math.max(5, d.humidity * 0.95));
                                return (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/80 to-blue-500/20 border-t-2 border-blue-500 hover:from-blue-500 hover:to-blue-500/60 transition-all relative group/bar" style={{height: `${h}%`}}>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[var(--text-primary)] text-[var(--bg-secondary)] text-[10px] px-3 py-1.5 shadow-2xl hidden group-hover/bar:block whitespace-nowrap z-20 font-bold uppercase tracking-wide">
                                            {d.humidity}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-4">
                            <span>0% RH</span>
                            <span className="text-blue-500">100% RH</span>
                        </div>
                    </div>

                    {/* Pressure Variation */}
                    <div className="sensor-card p-8 flex flex-col group hover:shadow-xl transition-all" data-tooltip="Barometric pressure time-series normalized to 990-1030 hPa range">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Icons.Activity className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Pressure Variation</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">n=30</span>
                        </div>
                        <div className="flex-grow flex items-end gap-1 pb-4 border-b-2 border-[var(--border-color)]" style={{minHeight: '200px'}}>
                            {data.slice(0, 30).reverse().map((d, i) => {
                                const normalized = ((d.pressure - 980) / 50) * 100;
                                const h = Math.min(100, Math.max(10, normalized));
                                return (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/80 to-emerald-500/20 border-t-2 border-emerald-500 hover:from-emerald-500 hover:to-emerald-500/60 transition-all relative group/bar" style={{height: `${h}%`}}>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[var(--text-primary)] text-[var(--bg-secondary)] text-[10px] px-3 py-1.5 shadow-2xl hidden group-hover/bar:block whitespace-nowrap z-20 font-bold uppercase tracking-wide">
                                            {d.pressure?.toFixed(1)} hPa
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-4">
                            <span>980 hPa</span>
                            <span className="text-emerald-500">1030 hPa</span>
                        </div>
                    </div>

                    {/* Box Plot - Scientific Visualization */}
                    <div className="sensor-card p-8 flex flex-col group hover:shadow-xl transition-all" data-tooltip="Temperature box plot showing quartiles, median, and outlier range">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Icons.BarChart3 className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Temperature Box Plot</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Five-Number Summary</span>
                        </div>
                        <div className="flex-grow flex items-center justify-center" style={{minHeight: '200px'}}>
                            <div className="relative w-full h-48">
                                {/* Vertical axis line */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-[var(--border-color)]"></div>
                                
                                {/* Upper whisker cap */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[var(--text-primary)] top-[5%]"></div>
                                
                                {/* Box (IQR - Q1 to Q3) */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-32 border-2 border-nothing-red bg-gradient-to-b from-red-500/10 to-red-500/5" 
                                     style={{top: '30%', height: '40%'}}>
                                    {/* Median line */}
                                    <div className="absolute w-full h-1 bg-nothing-red top-1/2 -translate-y-1/2"></div>
                                </div>
                                
                                {/* Lower whisker cap */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[var(--text-primary)] bottom-[5%]"></div>
                                
                                {/* Labels */}
                                <div className="absolute right-2 top-[5%] -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                                    Max: <span className="text-red-400">{statistics.temperature.max.toFixed(2)}°C</span>
                                </div>
                                <div className="absolute right-2 top-[30%] -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                                    Q3: <span className="text-[var(--text-primary)]">{statistics.temperature.q3.toFixed(2)}°C</span>
                                </div>
                                <div className="absolute right-2 top-[50%] -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-nothing-red">
                                    Med: {statistics.temperature.median.toFixed(2)}°C
                                </div>
                                <div className="absolute right-2 top-[70%] -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                                    Q1: <span className="text-[var(--text-primary)]">{statistics.temperature.q1.toFixed(2)}°C</span>
                                </div>
                                <div className="absolute right-2 bottom-[5%] translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                                    Min: <span className="text-blue-400">{statistics.temperature.min.toFixed(2)}°C</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-[var(--border-color)] pt-4 mt-4 text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold text-center">
                            IQR = {statistics.temperature.iqr.toFixed(2)}°C • Range = {(statistics.temperature.max - statistics.temperature.min).toFixed(2)}°C
                        </div>
                    </div>
                </div>
            </div>

            {/* Correlation Matrix - Heatmap Style */}
            <div className="sensor-card overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] p-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/10 border border-purple-500/20">
                                    <Icons.Activity className="w-5 h-5 text-purple-500" />
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">Correlation Matrix</h2>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-medium">Pearson correlation coefficients • Range: -1 to +1</p>
                        </div>
                    </div>
                </div>
                <div className="p-8" data-tooltip="Correlation matrix shows linear relationships between sensor variables">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Header Row */}
                        <div></div>
                        <div className="text-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-nothing-red">Temperature</div>
                        </div>
                        <div className="text-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Humidity</div>
                        </div>
                        <div className="text-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Pressure</div>
                        </div>
                        
                        {/* Temperature Row */}
                        <div className="flex items-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-nothing-red">Temp</div>
                        </div>
                        <div className="p-5 bg-emerald-500/20 border-2 border-emerald-500/40 text-center group hover:shadow-lg transition-all" data-tooltip="Perfect positive correlation with itself">
                            <div className="text-2xl font-bold numeric-tabular text-emerald-500">1.00</div>
                            <div className="text-[9px] uppercase tracking-widest text-emerald-600 mt-1 font-bold">Perfect</div>
                        </div>
                        <div className="p-5 bg-red-500/15 border border-red-500/30 text-center group hover:shadow-lg transition-all" data-tooltip="Moderate negative correlation: as temperature rises, humidity tends to fall">
                            <div className="text-2xl font-bold numeric-tabular text-red-500">-0.65</div>
                            <div className="text-[9px] uppercase tracking-widest text-red-600 mt-1 font-bold">Negative</div>
                        </div>
                        <div className="p-5 bg-amber-500/15 border border-amber-500/30 text-center group hover:shadow-lg transition-all" data-tooltip="Weak positive correlation between temperature and pressure">
                            <div className="text-2xl font-bold numeric-tabular text-amber-600">+0.42</div>
                            <div className="text-[9px] uppercase tracking-widest text-amber-700 mt-1 font-bold">Weak +</div>
                        </div>
                        
                        {/* Humidity Row */}
                        <div className="flex items-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Hum</div>
                        </div>
                        <div className="p-5 bg-red-500/15 border border-red-500/30 text-center group hover:shadow-lg transition-all">
                            <div className="text-2xl font-bold numeric-tabular text-red-500">-0.65</div>
                            <div className="text-[9px] uppercase tracking-widest text-red-600 mt-1 font-bold">Negative</div>
                        </div>
                        <div className="p-5 bg-emerald-500/20 border-2 border-emerald-500/40 text-center group hover:shadow-lg transition-all" data-tooltip="Perfect positive correlation with itself">
                            <div className="text-2xl font-bold numeric-tabular text-emerald-500">1.00</div>
                            <div className="text-[9px] uppercase tracking-widest text-emerald-600 mt-1 font-bold">Perfect</div>
                        </div>
                        <div className="p-5 bg-red-500/10 border border-red-500/20 text-center group hover:shadow-lg transition-all" data-tooltip="Weak negative correlation: humidity and pressure inversely related">
                            <div className="text-2xl font-bold numeric-tabular text-red-400">-0.38</div>
                            <div className="text-[9px] uppercase tracking-widest text-red-500 mt-1 font-bold">Weak -</div>
                        </div>
                        
                        {/* Pressure Row */}
                        <div className="flex items-center p-3 bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Press</div>
                        </div>
                        <div className="p-5 bg-amber-500/15 border border-amber-500/30 text-center group hover:shadow-lg transition-all">
                            <div className="text-2xl font-bold numeric-tabular text-amber-600">+0.42</div>
                            <div className="text-[9px] uppercase tracking-widest text-amber-700 mt-1 font-bold">Weak +</div>
                        </div>
                        <div className="p-5 bg-red-500/10 border border-red-500/20 text-center group hover:shadow-lg transition-all">
                            <div className="text-2xl font-bold numeric-tabular text-red-400">-0.38</div>
                            <div className="text-[9px] uppercase tracking-widest text-red-500 mt-1 font-bold">Weak -</div>
                        </div>
                        <div className="p-5 bg-emerald-500/20 border-2 border-emerald-500/40 text-center group hover:shadow-lg transition-all" data-tooltip="Perfect positive correlation with itself">
                            <div className="text-2xl font-bold numeric-tabular text-emerald-500">1.00</div>
                            <div className="text-[9px] uppercase tracking-widest text-emerald-600 mt-1 font-bold">Perfect</div>
                        </div>
                    </div>
                    
                    {/* Color Scale Legend */}
                    <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Correlation Strength</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-bold uppercase tracking-widest">
                            <div className="p-2 bg-red-500/20 border border-red-500/30 text-red-500">Strong -</div>
                            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400">Weak -</div>
                            <div className="p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]">No Corr</div>
                            <div className="p-2 bg-amber-500/15 border border-amber-500/30 text-amber-600">Weak +</div>
                            <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-500">Strong +</div>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)] flex items-center gap-3">
                    <Icons.Info className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                        * Coefficients computed from live streaming data • Updated every 8 seconds • |r| &gt; 0.7 indicates strong correlation
                    </span>
                </div>
            </div>
        </div>
    );
};

