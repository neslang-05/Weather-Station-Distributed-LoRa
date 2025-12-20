// Function to convert MQ-2 ADC value to human-readable status with PPM estimation
window.getGasStatus = (adcValue) => {
    if (!adcValue || adcValue === '--') {
        return { text: 'No Data', ppm: 0, color: 'text-gray-500', status: 'ok', detail: 'Waiting for sensor data' };
    }
    
    const value = Number(adcValue);
    
    // MQ-2 PPM Estimation (calibrated for LPG)
    let ppm = 0;
    if (value < 500) {
        ppm = 300 + (value / 500) * 100; // 300-400 ppm
    } else if (value < 1000) {
        ppm = 400 + ((value - 500) / 500) * 100; // 400-500 ppm
    } else if (value < 2000) {
        ppm = 500 + ((value - 1000) / 1000) * 300; // 500-800 ppm
    } else if (value < 3000) {
        ppm = 800 + ((value - 2000) / 1000) * 400; // 800-1200 ppm
    } else {
        ppm = 1200 + ((value - 3000) / 1095) * 800; // 1200-2000+ ppm
    }
    ppm = Math.round(ppm);
    
    if (value < 1000) {
        return { 
            text: 'Air Clean', 
            ppm: ppm,
            color: 'text-green-500', 
            status: 'ok',
            detail: `${ppm} ppm - Safe air quality`
        };
    } else if (value < 2000) {
        return { 
            text: 'Minor Detection', 
            ppm: ppm,
            color: 'text-yellow-400', 
            status: 'ok',
            detail: `${ppm} ppm - Trace amounts detected`
        };
    } else if (value < 3000) {
        return { 
            text: 'Gas Leak Possible', 
            ppm: ppm,
            color: 'text-orange-500', 
            status: 'warning',
            detail: `${ppm} ppm - Check for leaks`
        };
    } else {
        return { 
            text: 'DANGER - High Gas!', 
            ppm: ppm,
            color: 'text-nothing-red', 
            status: 'alert',
            detail: `${ppm} ppm - Evacuate immediately!`
        };
    }
};

// Function to convert sound sensor ADC value to dB
window.getSoundLevel = (adcValue) => {
    if (!adcValue || adcValue === '--') {
        return { dB: '--', category: 'No Data', color: 'text-gray-500' };
    }
    
    const value = Number(adcValue);
    
    // Convert ADC (0-4095) to dB (30-100 dB range for typical environments)
    const minDB = 30;  // Quiet library
    const maxDB = 100; // Very loud environment
    const dB = Math.round(minDB + (value / 4095) * (maxDB - minDB));
    
    let category = '';
    let color = 'text-white';
    
    if (dB < 40) {
        category = 'Very Quiet';
        color = 'text-green-500';
    } else if (dB < 55) {
        category = 'Quiet';
        color = 'text-blue-400';
    } else if (dB < 70) {
        category = 'Moderate';
        color = 'text-yellow-400';
    } else if (dB < 85) {
        category = 'Loud';
        color = 'text-orange-500';
    } else {
        category = 'Very Loud';
        color = 'text-nothing-red';
    }
    
    return { dB, category, color, adcValue: value };
};
