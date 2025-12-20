const Icons = window.Icons;

window.About = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Project Info */}
        <div className="space-y-8">
            <div className="sensor-card p-8">
                 <h2 className="text-2xl font-bold tracking-tighter mb-4 text-nothing-red uppercase">About the Project</h2>
                 <p className="text-sm text-[var(--text-primary)] leading-relaxed font-semibold mb-6 max-w-4xl">
                    The <strong>IoT Weather Station</strong> is a real-time environmental monitoring system built on the <strong>ESP32 WROOM-32E</strong> platform with secure cloud integration and modern web visualization. 
                    Developed as a full-stack IoT solution, it integrates hardware sensing, <strong>Supabase PostgreSQL</strong> storage, and <strong>React 18</strong> frontend analytics to provide a holistic view of environmental conditions.
                 </p>
                 <p className="text-sm text-[var(--text-primary)] leading-relaxed font-semibold mb-6 max-w-4xl">
                    The system monitors key parameters including <strong>Temperature, Humidity, Atmospheric Pressure, Combustible Gas, Rain Detection, Noise Levels, and Wind Speed</strong>. 
                    It serves as a practical demonstration of modern IoT architecture, bridging the gap between physical sensors and digital analytics.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)] font-mono border-t border-[var(--border-color)] pt-4">
                    <div className="flex items-center gap-2">
                        <Icons.Cpu className="w-4 h-4 text-nothing-red" />
                        <span>Platform: ESP32 WROOM-32E</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icons.Database className="w-4 h-4 text-nothing-red" />
                        <span>Backend: Supabase PostgreSQL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icons.Code className="w-4 h-4 text-nothing-red" />
                        <span>Frontend: React 18</span>
                    </div>
                 </div>
            </div>
            
             <div className="sensor-card p-8">
                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-8">Development Team</h3>
                 <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-nothing-red">01</div>
                        <div>
                            <div className="font-bold text-sm">Nilambar Elangbam</div>
                            <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">Hardware & Backend Architecture</div>
                        </div>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-nothing-red">02</div>
                        <div>
                            <div className="font-bold text-sm">Joymangol Chingangbam</div>
                            <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">UX Design & 3D Modeling</div>
                        </div>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-nothing-red">03</div>
                        <div>
                            <div className="font-bold text-sm">Justin Ngangbam</div>
                            <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">Calibration & Documentation</div>
                        </div>
                    </li>
                 </ul>
            </div>
        </div>

        {/* Future Enhancements */}
        <div className="space-y-8">
             <div className="sensor-card p-8 border-l-4 border-l-nothing-red">
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-3 uppercase tracking-tighter">
                    <Icons.Activity className="w-6 h-6 text-nothing-red"/>
                    Future Roadmap
                 </h2>
                 
                 <div className="space-y-8">
                     <div className="relative pl-6 border-l border-[var(--border-color)]">
                         <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-nothing-red"></div>
                         <h4 className="text-[var(--text-primary)] font-bold text-sm mb-2 uppercase tracking-widest">LoRa Integration</h4>
                         <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                             Implementing Long Range (LoRa) peer-to-peer communication to enable sensor nodes to transmit data over kilometers without WiFi dependency.
                         </p>
                     </div>
                     <div className="relative pl-6 border-l border-[var(--border-color)]">
                         <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-amber-500"></div>
                         <h4 className="text-[var(--text-primary)] font-bold text-sm mb-2 uppercase tracking-widest">Solar Power</h4>
                         <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                             Transitioning to a fully autonomous power system with high-efficiency solar panels and integrated BMS.
                         </p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
);