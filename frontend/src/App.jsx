import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import TrafficAnalysis from './pages/TrafficAnalysis';
import Analytics from './pages/Analytics';
import ModelInsights from './pages/ModelInsights';
import About from './pages/About';
import { checkBackendHealth } from './services/api';
import { Shield, LayoutDashboard, Search, BarChart3, Binary, Info, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');

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

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'analysis':
        return <TrafficAnalysis />;
      case 'analytics':
        return <Analytics />;
      case 'insights':
        return <ModelInsights />;
      case 'about':
        return <About />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header 
        style={{
          background: 'rgba(5, 8, 17, 0.75)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between'
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
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)'
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
              style={{
                background: activeTab === 'dashboard' ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: activeTab === 'dashboard' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'dashboard' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === 'dashboard' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              style={{
                background: activeTab === 'analysis' ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: activeTab === 'analysis' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'analysis' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === 'analysis' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <Search size={16} /> Traffic Analysis
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                background: activeTab === 'analytics' ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: activeTab === 'analytics' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'analytics' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === 'analytics' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <BarChart3 size={16} /> Analytics
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              style={{
                background: activeTab === 'insights' ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: activeTab === 'insights' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'insights' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === 'insights' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <Binary size={16} /> Model Insights
            </button>

            <button
              onClick={() => setActiveTab('about')}
              style={{
                background: activeTab === 'about' ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: activeTab === 'about' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'about' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: activeTab === 'about' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <Info size={16} /> About
            </button>

          </nav>

          {/* Live API Health Check Indicator */}
          <div className="flex align-center gap-10">
            {backendStatus === 'online' ? (
              <div 
                className="flex align-center gap-10 mono" 
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--threat-low)',
                  background: 'rgba(5, 236, 140, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(5, 236, 140, 0.2)'
                }}
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
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span>SYS_HEALTH_CHECKING...</span>
              </div>
            ) : (
              <div 
                className="flex align-center gap-10 mono" 
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--threat-high)',
                  background: 'rgba(255, 56, 56, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 56, 56, 0.2)'
                }}
                title="Please make sure FastAPI Uvicorn backend is running on http://localhost:8000"
              >
                <WifiOff size={14} />
                <span>API_SYS: OFFLINE</span>
                <span className="pulse-indicator red" style={{ width: '6px', height: '6px', marginLeft: '2px' }}></span>
              </div>
            )}
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
          borderTop: '1px solid rgba(255, 255, 255, 0.03)',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          background: 'rgba(5, 8, 17, 0.9)'
        }}
      >
        <p className="mono">NETGUARD SECURE SYSTEM v1.2.0 // POWERED BY SCIKIT-LEARN RANDOM FOREST ENGINE</p>
        <p style={{ marginTop: '4px' }}>&copy; 2026 NetGuard. All rights reserved. Real-time Threat Intelligence.</p>
      </footer>

    </div>
  );
}
