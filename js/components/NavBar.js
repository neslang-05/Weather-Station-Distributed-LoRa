const { useState } = React;
const Icons = window.Icons;

window.NavBar = ({ activeTab, setTab, theme, toggleTheme, user, onSettingsClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const allTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard, tooltip: 'Real-time sensor overview', public: true },
        { id: 'analytics', label: 'Analytics', icon: Icons.BarChart3, tooltip: 'Data trends and forecasting', public: false },
        { id: 'history', label: 'History', icon: Icons.History, tooltip: 'Historical data logs', public: false },
        { id: 'about', label: 'About', icon: Icons.Info, tooltip: 'Project information', public: true },
        { id: 'docs', label: 'Docs', icon: Icons.FileText, tooltip: 'Technical documentation', public: false },
        { id: 'login', label: 'Sign In', icon: Icons.LogIn, tooltip: 'Access full features', public: true, hideIfAuth: true },
    ];

    const tabs = allTabs.filter(tab => {
        if (user && tab.hideIfAuth) return false;
        if (!user && !tab.public) return false;
        return true;
    });

    const handleTabClick = (tabId) => {
        setTab(tabId);
        setMobileMenuOpen(false);
    };

    const handleSettingsClick = () => {
        onSettingsClick();
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Navigation - Hidden on Mobile */}
            <nav className="hidden md:flex gap-2 bg-[var(--bg-secondary)] p-1.5 border border-[var(--border-color)] shadow-sm w-full">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setTab(tab.id)}
                        data-tooltip={tab.tooltip}
                        className={`flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-nothing-red text-white shadow-md shadow-red-900/20' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                        }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                        {tab.label}
                    </button>
                ))}
                
                {/* User Settings Button on Desktop */}
                {user && (
                    <button
                        onClick={handleSettingsClick}
                        data-tooltip="Account Settings"
                        className={`flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ml-auto ${
                            activeTab === 'settings'
                            ? 'bg-nothing-red text-white shadow-md shadow-red-900/20'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                        }`}
                    >
                        <Icons.Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'animate-pulse' : ''}`} />
                        <span className="max-w-xs truncate">{user.email?.split('@')[0]}</span>
                    </button>
                )}
            </nav>

            {/* Mobile Hamburger Button - Visible only on Mobile */}
            <button 
                className={`md:hidden hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">Menu</h3>
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 border border-[var(--border-color)] hover:border-nothing-red transition-all"
                    >
                        <Icons.X className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="p-4 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-nothing-red text-white' 
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}

                    {/* Mobile Settings Button */}
                    {user && (
                        <button
                            onClick={handleSettingsClick}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-all ${
                                activeTab === 'settings'
                                ? 'bg-nothing-red text-white'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]'
                            }`}
                        >
                            <Icons.Settings className="w-4 h-4" />
                            Account Settings
                        </button>
                    )}
                </div>

                <div className="mt-auto p-4 border-t border-[var(--border-color)]">
                    <button 
                        onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                        className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-nothing-red transition-all flex items-center justify-center gap-2"
                    >
                        {theme === 'dark' ? (
                            <><Icons.Sun className="w-5 h-5 text-yellow-500" /><span className="text-xs font-bold">Light Mode</span></>
                        ) : (
                            <><Icons.Moon className="w-5 h-5 text-blue-500" /><span className="text-xs font-bold">Dark Mode</span></>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};
