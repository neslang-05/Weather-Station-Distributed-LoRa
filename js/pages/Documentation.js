window.Documentation = () => (
    <div className="space-y-8">
        <div className="sensor-card p-8">
            <h2 className="text-3xl font-bold tracking-tighter text-nothing-red mb-8 uppercase">System Documentation</h2>
            
            <div className="space-y-12">
                {/* 1. System Architecture */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">1. System Architecture</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        The project follows a classic <strong>Three-Tier IoT Architecture</strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <li><strong>Perception Layer (Hardware):</strong> ESP32 microcontroller and sensor suite for data acquisition.</li>
                        <li><strong>Network Layer (Connectivity):</strong> WiFi connectivity using HTTPS protocols for secure data transmission.</li>
                        <li><strong>Application Layer (Software):</strong> Supabase cloud database and React.js dashboard for visualization and analytics.</li>
                    </ul>
                </section>

                {/* 2. Hardware Implementation */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">2. Hardware Implementation</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        The core processing unit is the <strong>ESP32 WROOM-32E</strong>, chosen for its dual-core architecture and integrated WiFi/Bluetooth capabilities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--bg-primary)] p-6 border border-[var(--border-color)]">
                            <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Sensor Suite</h4>
                            <ul className="text-xs space-y-3 text-[var(--text-primary)] font-bold">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> DHT11: Temperature & Humidity</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> BMP180: Barometric Pressure</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> DS18B20: Precision Temperature</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> MQ-2: Gas & Smoke Detection</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> Sound Sensor: Noise Level Monitoring</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-nothing-red"></div> Rain Sensor: Precipitation Detection</li>
                            </ul>
                        </div>
                        <div className="bg-[var(--bg-primary)] p-6 border border-[var(--border-color)]">
                            <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Pin Configuration</h4>
                            <ul className="text-xs space-y-3 text-[var(--text-primary)] font-bold">
                                <li>GPIO 4: DHT11 Data</li>
                                <li>GPIO 21 (SDA), 22 (SCL): BMP180 (I2C)</li>
                                <li>GPIO 5: DS18B20 Data</li>
                                <li>GPIO 34 (ADC): MQ-2 Analog Out</li>
                                <li>GPIO 35 (ADC): Rain Sensor Analog Out</li>
                                <li>GPIO 32 (ADC): Sound Sensor Analog Out</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Firmware Overview */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">3. Firmware Overview</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        Developed in <strong>C++ / Arduino</strong>, the firmware manages the sensor polling cycle and data transmission.
                    </p>
                    <div className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <p><strong>Logic Flow:</strong></p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Initialize Serial communication and connect to WiFi.</li>
                            <li>Poll all sensors sequentially (non-blocking).</li>
                            <li>Format data into a JSON object.</li>
                            <li>Send HTTP POST request to Supabase REST API.</li>
                            <li>Enter deep sleep or delay loop (8 seconds) to conserve power.</li>
                        </ol>
                    </div>
                </section>

                {/* 4. Software & Analytics Stack */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">4. Software & Analytics Stack</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <h4 className="text-xs font-bold text-nothing-red uppercase tracking-widest mb-2">Supabase</h4>
                            <p className="text-xs text-[var(--text-secondary)]">Open-source Firebase alternative providing a PostgreSQL database and real-time subscriptions.</p>
                        </div>
                        <div className="p-4 border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <h4 className="text-xs font-bold text-nothing-red uppercase tracking-widest mb-2">React.js</h4>
                            <p className="text-xs text-[var(--text-secondary)]">Frontend library for building the dynamic, single-page application dashboard.</p>
                        </div>
                        <div className="p-4 border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <h4 className="text-xs font-bold text-nothing-red uppercase tracking-widest mb-2">Edge Analytics</h4>
                            <p className="text-xs text-[var(--text-secondary)]">Client-side processing for statistical analysis and forecasting to reduce server load.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Forecasting & Algorithms */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">5. Forecasting & Algorithms</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        The system implements the <strong>Holt-Winters Exponential Smoothing</strong> method for time-series forecasting.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <li><strong>Level:</strong> The baseline value of the data series.</li>
                        <li><strong>Trend:</strong> The direction (increasing/decreasing) of the data.</li>
                        <li><strong>Seasonality:</strong> Repeating patterns over time (not fully utilized in short-term demo).</li>
                        <li>Used to predict Temperature and Pressure trends for the next 5 intervals.</li>
                    </ul>
                </section>

                {/* 6. Database Schema */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">6. Database Schema</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        Data is stored in a single table <code>sensor_readings</code> in PostgreSQL.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="p-2">Column</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                <tr><td className="p-2">id</td><td className="p-2">int8</td><td className="p-2">Primary Key</td></tr>
                                <tr><td className="p-2">created_at</td><td className="p-2">timestamptz</td><td className="p-2">Record timestamp</td></tr>
                                <tr><td className="p-2">temperature</td><td className="p-2">float4</td><td className="p-2">DS18B20 reading</td></tr>
                                <tr><td className="p-2">humidity</td><td className="p-2">float4</td><td className="p-2">DHT11 reading</td></tr>
                                <tr><td className="p-2">pressure</td><td className="p-2">float4</td><td className="p-2">BMP180 reading</td></tr>
                                <tr><td className="p-2">gas_level</td><td className="p-2">int4</td><td className="p-2">MQ-2 ADC value</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 7. Security Considerations */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">7. Security Considerations</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <li><strong>HTTPS Encryption:</strong> All data transmission between ESP32 and Supabase is encrypted using SSL/TLS.</li>
                        <li><strong>API Key Management:</strong> Supabase API keys are restricted to specific domains and operations.</li>
                        <li><strong>Input Validation:</strong> Firmware validates sensor readings before transmission to prevent injection of malformed data.</li>
                    </ul>
                </section>

                {/* 8. Testing & Validation */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">8. Testing & Validation</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                        The system underwent rigorous testing phases:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <li><strong>Unit Testing:</strong> Individual sensor modules were tested with standard calibration instruments.</li>
                        <li><strong>Integration Testing:</strong> Verified data flow from hardware to cloud to dashboard.</li>
                        <li><strong>Stress Testing:</strong> Continuous operation for 48 hours to check for memory leaks and connection stability.</li>
                    </ul>
                </section>

                {/* 9. Future Scope */}
                <section>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight border-b border-[var(--border-color)] pb-2">9. Future Scope</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                        <li>Integration of LoRaWAN for long-range, low-power communication.</li>
                        <li>Implementation of a dedicated mobile application using React Native.</li>
                        <li>Addition of solar charging capabilities for off-grid deployment.</li>
                        <li>Machine Learning models for more accurate local weather prediction.</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
);
