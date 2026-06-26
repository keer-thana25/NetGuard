import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import TrafficAnalysis from './pages/TrafficAnalysis';
import LiveMonitor from './pages/LiveMonitor';
import BatchAnalysis from './pages/BatchAnalysis';
import About from './pages/About';
import WifiGuard from './pages/WifiGuard';
import { checkBackendHealth } from './services/api';
import { Shield, LayoutDashboard, Search, Upload, Info, Wifi, WifiOff, Sun, Moon, Activity, ChevronDown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSplashFadeOut, setShowSplashFadeOut] = useState(false);

  // Splash screen timing control
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setShowSplashFadeOut(true);
    }, 5500);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
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
      case 'live-monitor':
        return <LiveMonitor theme={theme} />;
      case 'batch':
        return <BatchAnalysis theme={theme} />;
      case 'analytics':
        return <Analytics theme={theme} />;
      case 'insights':
        return <ModelInsights theme={theme} />;
      case 'wifi-guard':
        return <WifiGuard theme={theme} />;
      case 'about':
        return <About theme={theme} />;
      default:
        return <Dashboard onNavigate={setActiveTab} theme={theme} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', transition: 'background var(--transition-speed) ease' }}>
      
      {showSplash && (
        <div 
          style={{
            opacity: showSplashFadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999
          }}
        >
          <SplashScreen />
        </div>
      )}
      
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
          height: '60px',
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
              onClick={() => setActiveTab('live-monitor')}
              className={`nav-button ${activeTab === 'live-monitor' ? 'active' : ''}`}
              id="nav-live-monitor"
            >
              <Activity size={16} /> Live Monitor
            </button>

            <button
              onClick={() => setActiveTab('wifi-guard')}
              className={`nav-button ${activeTab === 'wifi-guard' ? 'active' : ''}`}
              id="nav-wifi-guard"
            >
              <Wifi size={16} /> Wi-Fi Guard
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`nav-button ${activeTab === 'about' ? 'active' : ''}`}
              id="nav-about"
            >
              <Info size={16} /> About & Model
            </button>

          </nav>

          {/* Right Side: Theme Toggle & Health Check Indicator */}
          <div className="flex align-center gap-20">
            
            {/* Tools Dropdown Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`nav-button ${activeTab === 'batch' ? 'active' : ''}`}
                style={{ 
                  borderRadius: '6px', 
                  padding: '8px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  background: activeTab === 'batch' ? 'var(--navbar-bg-active)' : 'transparent',
                  color: activeTab === 'batch' ? 'var(--navbar-text-active)' : 'var(--navbar-text-inactive)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                id="nav-tools-dropdown"
              >
                <span>Tools</span> <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    width: '180px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => {
                      setActiveTab('batch');
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: activeTab === 'batch' ? 'var(--navbar-bg-active)' : 'transparent',
                      color: activeTab === 'batch' ? 'var(--navbar-text-active)' : 'var(--text-secondary)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = activeTab === 'batch' ? 'var(--navbar-bg-active)' : 'transparent'}
                  >
                    <Upload size={14} /> Batch Analysis
                  </button>
                </div>
              )}
            </div>

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

function SplashScreen() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes slowPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 25px rgba(31, 111, 235, 0.45));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 50px rgba(6, 182, 212, 0.65));
          }
        }
        @keyframes expandLetterSpacing {
          0% {
            opacity: 0;
            letter-spacing: -0.1em;
            transform: translateY(10px);
          }
          40% {
            opacity: 1;
            letter-spacing: 0.15em;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.25em;
          }
        }
        @keyframes slowRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeInMuted {
          0% { opacity: 0; }
          30% { opacity: 0; }
          100% { opacity: 0.5; }
        }
        .splash-shield-container {
          animation: slowPulse 5s infinite ease-in-out;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }
        .splash-halo {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px dashed rgba(31, 111, 235, 0.3);
          animation: slowRotate 20s linear infinite;
        }
        .splash-title {
          font-family: var(--font-mono);
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          animation: expandLetterSpacing 12s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
          color: #ffffff;
        }
        .splash-subtitle {
          font-size: 0.85rem;
          color: #8b949e;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-top: 16px;
          animation: fadeInMuted 8s ease-out forwards;
        }
      `}</style>

      {/* Dynamic Aura background */}
      <div 
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(31, 111, 235, 0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Central Rotating Halo and Shield */}
      <div className="splash-shield-container">
        <div className="splash-halo" />
        <div 
          style={{
            background: 'linear-gradient(135deg, #1f6feb, #06b6d4)',
            padding: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.25)'
          }}
        >
          <Shield size={72} style={{ color: '#fff' }} />
        </div>
      </div>

      {/* Animated NetGuard Title */}
      <h1 className="splash-title">
        NET<span style={{ color: '#1f6feb' }}>GUARD</span>
      </h1>

      {/* Muted Subtitle */}
      <div className="splash-subtitle">
        AI-Powered Telemetry Auditing Suite
      </div>
    </div>
  );
}
