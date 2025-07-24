import React from 'react';

const changelogItems = [
    { version: "v1.5Beta", description: "Generated mode structure and creative beta test" },
    { version: "v1.4", description: "Dokumentasi panduan terpasang" },
    { version: "v1.3", description: "Menambahkan fitur hapus riwayat per item." },
    { version: "v1.2", description: "Implementasi Negative Prompt cerdas." },
    { version: "v1.1", description: "Perbaikan bug tata letak dan UI." },
    { version: "v1.0", description: "Rilis awal Prompt Generator." },
];

const Changelog: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 h-full">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Changelog</h3>
            <ul className="space-y-4">
                {changelogItems.map(item => (
                    <li key={item.version}>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{item.version}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Changelog;
