const Icons = window.Icons;
const SensorCard = window.SensorCard;

window.Dashboard = ({ latest, windSpeed, gasStatus, soundLevel }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* 1. Temp */}
        <SensorCard 
            icon={Icons.Thermometer} 
            label="Temperature" 
            value={latest.temperature?.toFixed(1) || '--'} 
            unit="°C"
            status="ok"
            subtext="Ambient Air"
            tooltip="Ambient air temperature measured by DHT/BME sensor in °C"
        />
        
        {/* 2. Humidity */}
        <SensorCard 
            icon={Icons.Droplets} 
            label="Humidity" 
            value={latest.humidity?.toFixed(1) || '--'} 
            unit="%"
            status={latest.humidity > 80 ? "warning" : "ok"}
            subtext={latest.humidity > 80 ? "High Humidity" : "Optimal Range"}
            tooltip="Relative humidity percentage of surrounding air"
        />

        {/* 3. Pressure */}
        <SensorCard 
            icon={Icons.Gauge} 
            label="Pressure" 
            value={Math.round(latest.pressure) || '--'} 
            unit="hPa"
            status="ok"
            subtext="Barometric"
            tooltip="Atmospheric pressure measured in hectopascals (hPa)"
        />

        {/* 4. Wind */}
        <SensorCard 
            icon={Icons.Wind} 
            label="Wind Speed" 
            value={windSpeed} 
            unit="km/h"
            status="ok"
            subtext={latest.hall_status === "DETECTED" ? "Active" : "Calm"}
            tooltip="Estimated wind speed based on Hall Effect sensor rotations"
        />

        {/* 5. Gas */}
        <SensorCard 
            icon={Icons.Waves} 
            label="Gas Level" 
            value={gasStatus.ppm || '--'} 
            unit="ppm"
            status={gasStatus.status}
            color={gasStatus.color}
            subtext={`${gasStatus.text} • MQ-2`}
            tooltip="Combustible gas concentration detected by MQ-2 sensor"
        />

        {/* 6. Sound */}
        <SensorCard 
            icon={Icons.Speaker} 
            label="Sound Level" 
            value={soundLevel.dB} 
            unit="dB"
            status="ok"
            color={soundLevel.color}
            subtext={`${soundLevel.category}`}
            tooltip="Ambient noise level measured in decibels (dB)"
        />

        {/* 7. Rain (Double Width) */}
        <div className="sensor-card h-52 p-6 flex flex-col justify-between group md:col-span-2" data-tooltip="Rain detection status based on analog threshold">
             <div className="absolute inset-0 bg-dots pointer-events-none"></div>
             <div className="relative flex justify-between items-start z-10">
                <div className="p-2.5 border border-[var(--border-color)] bg-[var(--bg-primary)] group-hover:border-nothing-red transition-colors">
                    <Icons.CloudRain className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-nothing-red transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                        {latest.rain_alert === 'ALERT' ? 'Precipitation' : 'Clear'}
                    </span>
                    <div className={`w-2.5 h-2.5 ${latest.rain_alert === 'ALERT' ? 'bg-nothing-red animate-pulse shadow-[0_0_8px_rgba(235,0,41,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}></div>
                </div>
            </div>
            <div className="relative z-10">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold mb-2">Raindrop Detector</div>
                <div className={`text-5xl font-bold tracking-tighter numeric-tabular ${latest.rain_alert === 'ALERT' ? 'text-nothing-red' : 'text-[var(--text-primary)]'}`}>
                    {latest.rain_alert === 'ALERT' ? "RAINING" : "DRY"}
                </div>
                 <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] flex items-center gap-2 font-medium uppercase tracking-wider">
                    <div className={`w-1.5 h-1.5 rounded-full ${latest.rain_alert === 'ALERT' ? 'bg-nothing-red' : 'bg-blue-500'}`}></div>
                    Analog Value: {latest.rain_level} • Threshold: 500
                </div>
            </div>
        </div>
    </div>
);
