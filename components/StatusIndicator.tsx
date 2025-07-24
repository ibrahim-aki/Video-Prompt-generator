import React, { useState, useEffect } from 'react';

// Define the possible statuses with updated text
const statusTypes = {
    OPERATIONAL: { text: 'Normal Load', color: 'bg-green-500' },
    HIGH_LOAD: { text: 'High Load', color: 'bg-yellow-500' },
    ERROR: { text: 'Full Load', color: 'bg-red-500' },
};

const StatusIndicator: React.FC = () => {
    // State to hold the current status object
    const [currentStatus, setCurrentStatus] = useState(statusTypes.HIGH_LOAD); // Start with High Load as it's the most common

    useEffect(() => {
        const interval = setInterval(() => {
            const rand = Math.random(); // Get a random number between 0 and 1

            if (rand < 0.05) { // 5% chance for Normal Load
                setCurrentStatus(statusTypes.OPERATIONAL);
            } else if (rand < 0.85) { // 80% chance for High Load (from 0.05 to 0.849...)
                setCurrentStatus(statusTypes.HIGH_LOAD);
            } else { // 15% chance for Full Load (from 0.85 to 1.00)
                setCurrentStatus(statusTypes.ERROR);
            }
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>BSAS Status:</span>
            <span className={`relative flex h-3 w-3`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.color} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStatus.color}`}></span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-24 ltr:text-left rtl:text-right">{currentStatus.text}</span>
        </div>
    );
};

export default StatusIndicator;