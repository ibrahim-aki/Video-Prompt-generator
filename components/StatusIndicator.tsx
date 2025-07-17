import React, { useState, useEffect } from 'react';

const statuses = [
    { text: 'Busy', color: 'bg-yellow-500' },
];

const StatusIndicator: React.FC = () => {
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatusIndex(prevIndex => (prevIndex + 1) % statuses.length);
        }, 4000); // Change status every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const currentStatus = statuses[currentStatusIndex];

    return (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Status Aplikasi:</span>
            <span className={`relative flex h-3 w-3`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.color} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStatus.color}`}></span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{currentStatus.text}</span>
        </div>
    );
};

export default StatusIndicator;