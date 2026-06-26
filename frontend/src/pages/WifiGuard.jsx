import { useState, useEffect } from 'react';
import { 
  getWifiStatus, 
  setWifiSimulation 
} from '../services/api';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Sliders, 
  Lock, 
  Unlock, 
  AlertTriangle,
  Radio,
  Signal,
  CheckCircle2
} from 'lucide-react';

export default function WifiGuard({ theme }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [simMode, setSimMode] = useState('none');
  const [error, setError] = useState(null);

  const fetchWifiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWifiStatus();
      setData(res);
      setSimMode(res.simulation_mode || 'none');
    } catch (err) {
      console.error(err);
      setError('Could not establish connection to the NetGuard scanning backend. Please verify FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (mode) => {
    setLoading(true);
    try {
      await setWifiSimulation(mode);
      setSimMode(mode);
      // Immediately refresh stats
      const res = await getWifiStatus();
      setData(res);
    } catch (err) {
      setError('Failed to switch simulation mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiData();
    // Poll Wi-Fi status every 4 seconds to catch signal strength fluctuations
    const interval = setInterval(fetchWifiData, 4000);
    return () => clearInterval(interval);
  }, []);

  const getThreatStyles = (colorName) => {
    switch (colorName) {
      case 'red':
        return {
          bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(31, 31, 31, 0.95) 100%)',
          border: 'rgba(239, 68, 68, 0.45)',
          color: 'var(--threat-high)',
          icon: <ShieldAlert size={40} className="spin" style={{ color: 'var(--threat-high)' }} />,
          pulseColor: 'red'
        };
      case 'yellow':
        return {
          bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(31, 31, 31, 0.95) 100%)',
          border: 'rgba(249, 115, 22, 0.35)',
          color: 'var(--threat-warning)',
          icon: <AlertTriangle size={40} style={{ color: 'var(--threat-warning)' }} />,
          pulseColor: 'orange'
        };
      case 'green':
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(31, 31, 31, 0.95) 100%)',
          border: 'rgba(16, 185, 129, 0.25)',
          color: 'var(--threat-low)',
          icon: <ShieldCheck size={40} style={{ color: 'var(--threat-low)' }} />,
          pulseColor: 'green'
        };
    }
  };

  // Safe fallback before backend responds
  const connectedNet = data?.connected_network || {};
  const scanResults = data?.scan_results || [];
  const analysis = data?.security_analysis || { status: 'Checking...', risk_score: 0, color: 'green', reasons: [] };
  
  const currentStyles = getThreatStyles(analysis.color);


  // Format MAC vendor prefix details
  const getMacVendor = (mac) => {
    if (!mac) return 'Unknown Vendor';
    const cleanMac = mac.toLowerCase();
    if (cleanMac.startsWith('b8:27:eb') || cleanMac.startsWith('dc:a6:32')) return 'Raspberry Pi Foundation (Suspicious Spoof)';
    if (cleanMac.startsWith('00:1a:8c')) return 'Cisco Systems (Trusted Enterprise)';
    if (cleanMac.startsWith('3c:7c:3f')) return 'Intel Wireless Corp.';
    if (cleanMac.startsWith('00:11:22')) return 'Mock Virtual Router';
    return 'Generic NIC Manufacturer';
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div className="flex align-center justify-between" style={{ marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-cyan)' }}>
            802.11 WIRELESS BAND AUDITOR
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Wi-Fi Guard Inspector
          </h2>
        </div>
        
        <button 
          className="cyber-btn"
          onClick={fetchWifiData}
          disabled={loading}
          style={{ background: 'var(--btn-gradient)' }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} /> Force Scan RF
        </button>
      </div>

      {error && (
        <div 
          className="cyber-card" 
          style={{ 
            background: 'rgba(239, 68, 68, 0.08)', 
            borderColor: 'var(--threat-high)', 
            color: 'var(--threat-high)',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            borderRadius: '12px'
          }}
        >
          <div className="flex align-center gap-10">
            <ShieldAlert size={18} />
            <div>
              <strong>Backend Fault:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Simulator control & Connected stats */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', marginBottom: '30px' }}>
        
        {/* Main Connection Status Card */}
        <div 
          className="cyber-card"
          style={{ 
            background: currentStyles.bg,
            border: `1px solid ${currentStyles.border}`,
            borderLeft: `5px solid ${currentStyles.color}`,
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.5s ease'
          }}
        >
          <div>
            <div className="flex justify-between align-center" style={{ marginBottom: '15px' }}>
              <div className="flex align-center gap-10">
                <span className={`pulse-indicator ${currentStyles.pulseColor}`} style={{ width: '10px', height: '10px' }}></span>
                <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: currentStyles.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  CONNECTION INTEGRITY: {analysis.status}
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                {connectedNet.interface_name || 'wlan0'}
              </span>
            </div>

            <div className="flex align-center gap-20" style={{ marginBottom: '20px' }}>
              {currentStyles.icon}
              <div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.1' }}>
                  {connectedNet.ssid || 'Scanning...'}
                </h3>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  BSSID: {connectedNet.bssid || '00:00:00:00:00:00'}
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '15px 0' }} />

            <div>
              <span className="cyber-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Security Audit Findings</span>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {analysis.reasons?.map((reason, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', listStyleType: 'square' }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between align-center" style={{ marginTop: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <div className="flex gap-20">
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Encryption</span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {connectedNet.auth === 'Open' ? (
                    <span style={{ color: 'var(--threat-high)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Unlock size={12} /> NONE (OPEN)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--threat-low)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} /> {connectedNet.auth}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>RF Channel</span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Ch {connectedNet.channel || '--'} ({connectedNet.radio_type || '802.11'})
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Signal</span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {connectedNet.signal || 0}%
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Audit Risk Index</span>
              <span className="mono" style={{ fontSize: '2rem', fontWeight: 900, color: currentStyles.color, lineHeight: '1' }}>
                {analysis.risk_score?.toFixed(0)}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
              </span>
            </div>
          </div>

        </div>

        {/* Demo Mode / Simulation Presets panel */}
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} /> Viva Demo & Simulation Panel
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '20px' }}>
              Since you are likely presenting on a normal school or home network, use these buttons to trigger pre-configured security scenarios to demonstrate how NetGuard detects open networks and clones (Evil Twins).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Scenario: Real-Time Local Scan */}
              <div 
                style={{ 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  background: simMode === 'none' ? 'rgba(31, 111, 235, 0.08)' : 'var(--bg-secondary)',
                  borderColor: simMode === 'none' ? 'var(--accent-blue)' : 'var(--border-color)',
                  boxShadow: simMode === 'none' ? '0 0 12px rgba(31, 111, 235, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => handleSimulate('none')}
                onMouseEnter={(e) => {
                  if (simMode !== 'none') {
                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (simMode !== 'none') {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${simMode === 'none' ? 'var(--accent-blue)' : 'var(--text-muted)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}>
                    {simMode === 'none' && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--accent-blue)'
                      }}></div>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Real-Time Local Scan</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Checks active network adapter for real networks.</span>
                  </div>
                </div>
                {simMode === 'none' && <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700 }}>ACTIVE</span>}
              </div>

              {/* Scenario: Safe Network */}
              <div 
                style={{ 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  background: simMode === 'safe' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-secondary)',
                  borderColor: simMode === 'safe' ? 'var(--threat-low)' : 'var(--border-color)',
                  boxShadow: simMode === 'safe' ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => handleSimulate('safe')}
                onMouseEnter={(e) => {
                  if (simMode !== 'safe') {
                    e.currentTarget.style.borderColor = 'var(--threat-low)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (simMode !== 'safe') {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${simMode === 'safe' ? 'var(--threat-low)' : 'var(--text-muted)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}>
                    {simMode === 'safe' && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--threat-low)'
                      }}></div>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Preset: Safe Network</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Simulates a WPA3-secured home Wi-Fi network.</span>
                  </div>
                </div>
                {simMode === 'safe' && <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--threat-low)', fontWeight: 700 }}>ACTIVE</span>}
              </div>

              {/* Scenario: Unsecured Public Wi-Fi */}
              <div 
                style={{ 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  background: simMode === 'unsecured' ? 'rgba(249, 115, 22, 0.08)' : 'var(--bg-secondary)',
                  borderColor: simMode === 'unsecured' ? 'var(--threat-warning)' : 'var(--border-color)',
                  boxShadow: simMode === 'unsecured' ? '0 0 12px rgba(249, 115, 22, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => handleSimulate('unsecured')}
                onMouseEnter={(e) => {
                  if (simMode !== 'unsecured') {
                    e.currentTarget.style.borderColor = 'var(--threat-warning)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (simMode !== 'unsecured') {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${simMode === 'unsecured' ? 'var(--threat-warning)' : 'var(--text-muted)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}>
                    {simMode === 'unsecured' && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--threat-warning)'
                      }}></div>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Preset: Unsecured Public Wi-Fi</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Simulates connection to an open airport hotspot.</span>
                  </div>
                </div>
                {simMode === 'unsecured' && <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--threat-warning)', fontWeight: 700 }}>ACTIVE</span>}
              </div>

              {/* Scenario: Rogue AP Clone */}
              <div 
                style={{ 
                  textAlign: 'left', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  background: simMode === 'rogue' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-secondary)',
                  borderColor: simMode === 'rogue' ? 'var(--threat-high)' : 'var(--border-color)',
                  boxShadow: simMode === 'rogue' ? '0 0 12px rgba(239, 68, 68, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => handleSimulate('rogue')}
                onMouseEnter={(e) => {
                  if (simMode !== 'rogue') {
                    e.currentTarget.style.borderColor = 'var(--threat-high)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (simMode !== 'rogue') {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${simMode === 'rogue' ? 'var(--threat-high)' : 'var(--text-muted)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}>
                    {simMode === 'rogue' && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--threat-high)'
                      }}></div>
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Preset: Rogue AP Clone (Evil Twin)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Simulates a malicious open router hijacking a secure network name.</span>
                  </div>
                </div>
                {simMode === 'rogue' && <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--threat-high)', fontWeight: 700 }}>ACTIVE</span>}
              </div>

            </div>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', marginTop: '20px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Note for Faculty Viva:</span> Changing presets changes the RF scan list automatically, simulating active duplicates and WPA configurations.
          </div>
        </div>

      </div>

      {/* Scanned Access Points List */}
      <div className="cyber-card">
        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Radio size={16} /> Nearby Access Point Scan List
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Wireless interfaces currently broadcasting in range. Double SSIDs with weaker security flag cloning alerts.
            </p>
          </div>
          <span className="mono" style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}>
            SCANNED_DEVICES: {scanResults.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>SSID</th>
                <th>BSSID (MAC Address)</th>
                <th>Signal</th>
                <th>Channel</th>
                <th>Security</th>
                <th>Vendor / Status</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No networks in range detected. Make sure Wi-Fi is enabled on your laptop.
                  </td>
                </tr>
              ) : (
                scanResults.map((ap, idx) => {
                  const isConnected = ap.bssid?.toLowerCase() === connectedNet.bssid?.toLowerCase();
                  const isSameSsid = ap.ssid === connectedNet.ssid && ap.bssid?.toLowerCase() !== connectedNet.bssid?.toLowerCase();
                  
                  // Only flag as a clone/threat if there's a security profile mismatch,
                  // or if we are actively simulating a rogue AP attack, or the backend has flagged it.
                  const isClone = isSameSsid && (
                    simMode === 'rogue' || 
                    ap.auth !== connectedNet.auth || 
                    analysis.color === 'red'
                  );
                  
                  const isMeshNode = isSameSsid && !isClone;
                  
                  let statusLabel = null;
                  let rowBg = 'transparent';
                  
                  if (isConnected) {
                    statusLabel = (
                      <span 
                        className="mono" 
                        style={{ 
                          padding: '4px 10px', 
                          background: 'rgba(63, 185, 80, 0.1)', 
                          border: '1px solid rgba(63, 185, 80, 0.3)', 
                          color: 'var(--threat-low)', 
                          borderRadius: '12px', 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          display: 'inline-block'
                        }}
                      >
                        CONNECTED
                      </span>
                    );
                  } else if (isClone) {
                    statusLabel = (
                      <span 
                        className="mono pulse" 
                        style={{ 
                          padding: '4px 10px', 
                          background: 'rgba(248, 81, 73, 0.1)', 
                          border: '1px solid rgba(248, 81, 73, 0.3)', 
                          color: 'var(--threat-high)', 
                          borderRadius: '12px', 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          display: 'inline-block'
                        }}
                      >
                        ROGUISH AP CLONE
                      </span>
                    );
                    rowBg = 'rgba(248, 81, 73, 0.03)';
                  } else if (isMeshNode) {
                    statusLabel = (
                      <span 
                        className="mono" 
                        style={{ 
                          padding: '4px 10px', 
                          background: 'rgba(31, 111, 235, 0.1)', 
                          border: '1px solid rgba(31, 111, 235, 0.3)', 
                          color: 'var(--accent-blue)', 
                          borderRadius: '12px', 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          display: 'inline-block'
                        }}
                      >
                        MESH NODE / BAND
                      </span>
                    );
                  }

                  return (
                    <tr key={idx} style={{ background: rowBg, transition: 'all 0.3s ease' }}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Wifi size={14} style={{ color: isClone ? 'var(--threat-high)' : isConnected ? 'var(--accent-cyan)' : isMeshNode ? 'var(--accent-blue)' : 'var(--text-secondary)' }} />
                          {ap.ssid}
                        </div>
                      </td>
                      <td className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{ap.bssid}</td>
                      <td className="mono">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Signal size={12} style={{ color: ap.signal > 75 ? 'var(--threat-low)' : ap.signal > 40 ? 'var(--threat-warning)' : 'var(--threat-high)' }} />
                          {ap.signal}%
                        </div>
                      </td>
                      <td className="mono" style={{ color: 'var(--text-primary)' }}>{ap.channel}</td>
                      <td className="mono">
                        {ap.auth === 'Open' ? (
                          <span style={{ color: 'var(--threat-warning)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Unlock size={10} /> Open
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={10} /> {ap.auth}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{getMacVendor(ap.bssid)}</span>
                          {statusLabel}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
