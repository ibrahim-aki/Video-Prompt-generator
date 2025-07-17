import React, { useState, useEffect } from 'react';
import { credentials } from '../auth/credentials';
import { Icon } from '../components/Icon';
import Changelog from '../components/Changelog';
import FakeChat from '../components/FakeChat';
import StatusIndicator from '../components/StatusIndicator';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [theme, setTheme] = useState< 'light' | 'dark' >(() => (localStorage.getItem('theme') as 'light' | 'dark' | null) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (localStorage.getItem('theme') === null) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = credentials.find(cred => cred.username === username && cred.password === password);
        if (user) {
            setError('');
            onLoginSuccess();
        } else {
            setError('Username atau password salah.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 transition-colors duration-500">
             <div className="absolute top-5 right-5">
                <Icon type={theme === 'dark' ? 'sun' : 'moon'} className="w-6 h-6 text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => {
                    const newTheme = theme === 'light' ? 'dark' : 'light';
                    setTheme(newTheme);
                    localStorage.setItem('theme', newTheme);
                    document.documentElement.classList.toggle('dark', newTheme === 'dark');
                }} />
            </div>
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Changelog */}
                    <div className="lg:col-span-3 hidden lg:block">
                        <Changelog />
                    </div>

                    {/* Middle Column: Login Form */}
                    <div className="lg:col-span-6 flex flex-col justify-center h-full">
                        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50">
                            <div className="text-center mb-8">
                                <Icon type="sparkles" className="w-16 h-16 text-cyan-500 mx-auto" />
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-4">Prompt Generator</h1>
                                <p className="text-slate-500 dark:text-slate-400">Silakan login untuk melanjutkan</p>
                            </div>
                            
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="relative">
                                    <Icon type="user" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    />
                                </div>
                                <div className="relative">
                                    <Icon type="key" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                                <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105">
                                    Login
                                </button>
                            </form>
                            <div className="mt-8">
                                <StatusIndicator />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Fake Chat */}
                    <div className="lg:col-span-3 hidden lg:block">
                        <FakeChat />
                    </div>
                </div>
            </div>
             <footer className="w-full mt-12 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">Aplikasi dibuat oleh Ibrahim</p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
