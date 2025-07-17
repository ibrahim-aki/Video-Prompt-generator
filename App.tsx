import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PromptGeneratorApp from './PromptGeneratorApp';

const App: React.FC = () => {
    // Cek status login dari localStorage saat komponen pertama kali dimuat.
    // 'true' string digunakan karena localStorage hanya menyimpan string.
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handleLoginSuccess = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <>
            {!isLoggedIn ? (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
                <PromptGeneratorApp onLogout={handleLogout} />
            )}
        </>
    );
};

export default App;
