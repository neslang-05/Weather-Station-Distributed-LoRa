window.SensorCard = ({ icon: Icon, label, value, unit, status, subtext, color = "text-[var(--text-primary)]", customValue, tooltip }) => (
    <div className="sensor-card h-52 p-6 flex flex-col justify-between group" data-tooltip={tooltip}>
        {/* Dotted Background */}
        <div className="absolute inset-0 bg-dots pointer-events-none"></div>
        
        {/* Header: Icon + Status Dot */}
        <div className="relative flex justify-between items-start z-10">
            <div className="p-2.5 border border-[var(--border-color)] bg-[var(--bg-primary)] group-hover:border-nothing-red transition-colors">
                <Icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-nothing-red transition-colors" />
            </div>
            {/* Status Dot */}
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-tighter text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {status === 'alert' ? 'Critical' : (status === 'warning' ? 'Warning' : 'Optimal')}
                </span>
                <div className={`w-2.5 h-2.5 ${status === 'alert' ? 'bg-nothing-red animate-pulse shadow-[0_0_8px_rgba(235,0,41,0.5)]' : (status === 'warning' ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]')}`}></div>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold mb-2">{label}</div>
            <div className={`text-5xl font-bold tracking-tighter numeric-tabular ${color}`}>
                {customValue || value} <span className="text-lg font-medium text-[var(--text-secondary)] ml-1">{unit}</span>
            </div>
            {subtext && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] flex items-center gap-2 font-medium uppercase tracking-wider">
                     <div className={`w-1.5 h-1.5 rounded-full ${status === 'alert' ? 'bg-nothing-red' : (status === 'warning' ? 'bg-amber-500' : 'bg-blue-500')}`}></div>
                     {subtext}
                </div>
            )}
        </div>
    </div>
);
