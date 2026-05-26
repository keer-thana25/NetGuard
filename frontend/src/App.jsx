import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import TrafficAnalysis from './pages/TrafficAnalysis';
import Analytics from './pages/Analytics';
import ModelInsights from './pages/ModelInsights';
import About from './pages/About';
import { checkBackendHealth } from './services/api';
import { Shield, LayoutDashboard, Search, BarChart3, Binary, Info, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check FastAPI backend server health
  useEffect(() => {
    const verifyHealth = async () => {
      const response = await checkBackendHealth();
      if (response && response.status === 'online') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    };

    verifyHealth();
    // Poll every 8 seconds to update status dynamically
    const interval = setInterval(verifyHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} theme={theme} />;
      case 'analysis':
        return <TrafficAnalysis theme={theme} />;
      case 'analytics':
        return <Analytics theme={theme} />;
      case 'insights':
        return <ModelInsights theme={theme} />;
      case 'about':
        return <About theme={theme} />;
      default:
        return <Dashboard onNavigate={setActiveTab} theme={theme} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', transition: 'background var(--transition-speed) ease' }}>
      
      {/* Top Navbar */}
      <header 
        style={{
          background: 'var(--header-bg)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          transition: 'background var(--transition-speed) ease, border-color var(--transition-speed) ease'
        }}
      >
        <div className="flex justify-between align-center" style={{ width: '100%' }}>
          
          {/* Logo */}
          <div className="flex align-center gap-10" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
            <div 
              style={{
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Shield size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff' }}>
                NET<span style={{ color: 'var(--accent-cyan)' }}>GUARD</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex align-center" style={{ gap: '6px' }}>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              id="nav-dashboard"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`nav-button ${activeTab === 'analysis' ? 'active' : ''}`}
              id="nav-analysis"
            >
              <Search size={16} /> Traffic Analysis
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
              id="nav-analytics"
            >
              <BarChart3 size={16} /> Analytics
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`nav-button ${activeTab === 'insights' ? 'active' : ''}`}
              id="nav-insights"
            >
              <Binary size={16} /> Model Insights
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`nav-button ${activeTab === 'about' ? 'active' : ''}`}
              id="nav-about"
            >
              <Info size={16} /> About
            </button>

          </nav>

          {/* Right Side: Theme Toggle & Health Check Indicator */}
          <div className="flex align-center gap-20">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Live API Health Check Indicator */}
            <div className="flex align-center gap-10">
              {backendStatus === 'online' ? (
                <div 
                  className="flex align-center gap-10 mono" 
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--threat-low)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    transition: 'all var(--transition-speed) ease'
                  }}
                  id="api-status-online"
                >
                  <Wifi size={14} />
                  <span>API_SYS: ONLINE</span>
                  <span className="pulse-indicator green" style={{ width: '6px', height: '6px', marginLeft: '2px' }}></span>
                </div>
              ) : backendStatus === 'checking' ? (
                <div 
                  className="flex align-center gap-10 mono" 
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all var(--transition-speed) ease'
                  }}
                  id="api-status-checking"
                >
                  <span>SYS_HEALTH_CHECKING...</span>
                </div>
              ) : (
                <div 
                  className="flex align-center gap-10 mono" 
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--threat-high)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    transition: 'all var(--transition-speed) ease'
                  }}
                  title="Please make sure FastAPI Uvicorn backend is running on http://localhost:8000"
                  id="api-status-offline"
                >
                  <WifiOff size={14} />
                  <span>API_SYS: OFFLINE</span>
                  <span className="pulse-indicator red" style={{ width: '6px', height: '6px', marginLeft: '2px' }}></span>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        {renderActiveContent()}
      </main>

      {/* Footer */}
      <footer 
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          background: 'var(--footer-bg)',
          transition: 'background var(--transition-speed) ease, border-color var(--transition-speed) ease, color var(--transition-speed) ease'
        }}
      >
        <p className="mono">NETGUARD SECURE SYSTEM v1.2.0 // POWERED BY SCIKIT-LEARN RANDOM FOREST ENGINE</p>
        <p style={{ marginTop: '4px' }}>&copy; 2026 NetGuard. All rights reserved. Real-time Threat Intelligence.</p>
      </footer>

    </div>
  );
}
