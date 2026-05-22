import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, CheckCircle, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

const INITIAL_LOGS = [
  { time: '14:24:02', src: '192.168.1.15', dst: '8.8.8.8', proto: 'UDP', port: '53', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:55', src: '10.0.0.84', dst: '192.168.1.2', proto: 'TCP', port: '443', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:41', src: '192.168.1.25', dst: '54.210.12.9', proto: 'TCP', port: '80', status: 'Anomaly', risk: 'High', class: 'danger' },
  { time: '14:23:22', src: '192.168.1.3', dst: '192.168.1.6', proto: 'TCP', port: '22', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:10', src: '172.16.0.4', dst: '192.168.1.5', proto: 'UDP', port: '161', status: 'Anomaly', risk: 'High', class: 'danger' },
];

export default function Dashboard({ onNavigate }) {
  const [liveLogs, setLiveLogs] = useState(INITIAL_LOGS);
  const [stats, setStats] = useState({
    total: 100241,
    threats: 1482,
    accuracy: 98.5
  });

  // Dynamic simulation: Append new logs over time
  useEffect(() => {
    const ips = ['192.168.1.2', '192.168.1.3', '10.0.4.12', '172.16.2.22', '192.168.1.15'];
    const destIps = ['192.168.1.5', '192.168.1.6', '8.8.8.8', '54.23.4.12', '44.201.2.99'];
    const protocols = ['TCP', 'UDP'];
    const ports = ['443', '80', '53', '22', '8080'];
    
    const interval = setInterval(() => {
      const isThreat = Math.random() > 0.85;
      const date = new Date();
      const timeStr = date.toTimeString().split(' ')[0];
      
      const newLog = {
        time: timeStr,
        src: ips[Math.floor(Math.random() * ips.length)],
        dst: destIps[Math.floor(Math.random() * destIps.length)],
        proto: protocols[Math.floor(Math.random() * protocols.length)],
        port: ports[Math.floor(Math.random() * ports.length)],
        status: isThreat ? 'Anomaly' : 'Normal',
        risk: isThreat ? 'High' : 'Low',
        class: isThreat ? 'danger' : 'safe'
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 7)]);
      
      // Update statistics
      setStats(prev => ({
        total: prev.total + 1,
        threats: isThreat ? prev.threats + 1 : prev.threats,
        accuracy: prev.accuracy
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Hero Section */}
      <div 
        className="cyber-card" 
        style={{ 
          marginBottom: '30px', 
          background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.85) 0%, rgba(5, 8, 17, 0.95) 100%)',
          borderLeft: '4px solid var(--accent-cyan)'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <span className="mono text-glow-cyan" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em' }}>
            CYBERSECURITY DEFENSE SYSTEM ACTIVE
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '10px', marginBottom: '10px', background: 'linear-gradient(90deg, #fff 30%, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NetGuard
          </h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
            AI-Powered Network Traffic Anomaly Detection
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Inspect micro-telemetry packets, classify suspicious TCP/UDP behavior in real-time, and run advanced metrics evaluation utilizing robust scikit-learn random forest models.
          </p>
          <button 
            className="cyber-btn"
            onClick={() => onNavigate('analysis')}
          >
            Launch Traffic Analyzer <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="cyber-grid" style={{ marginBottom: '30px' }}>
        
        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(0, 114, 255, 0.15)', padding: '12px', borderRadius: '10px', color: 'var(--accent-blue)', border: '1px solid rgba(0, 114, 255, 0.2)' }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Analyzed Telemetry</span>
            <h4 className="mono" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '2px' }}>
              {stats.total.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 56, 56, 0.12)', padding: '12px', borderRadius: '10px', color: 'var(--threat-high)', border: '1px solid rgba(255, 56, 56, 0.2)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Threats Isolated</span>
            <h4 className="mono" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '2px', color: 'var(--threat-high)' }}>
              {stats.threats.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '12px', borderRadius: '10px', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Model Precision</span>
            <h4 className="mono text-glow-cyan" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '2px' }}>
              {stats.accuracy}%
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(5, 236, 140, 0.12)', padding: '12px', borderRadius: '10px', color: 'var(--threat-low)', border: '1px solid rgba(5, 236, 140, 0.2)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Defensive State</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '4px', color: 'var(--threat-low)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator green" style={{ width: '8px', height: '8px' }}></span> MONITORING
            </h4>
          </div>
        </div>

      </div>

      {/* Recent Packet Logs Table */}
      <div className="cyber-card">
        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
          <div>
            <h3 className="text-glow-cyan" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} /> Live Packet Stream Simulation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Real-time inbound connections classified dynamically by the backend random forest model.
            </p>
          </div>
          <span className="mono" style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,242,254,0.1)', borderRadius: '4px', color: 'var(--accent-cyan)' }}>
            LIVE_FEED
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Source Nodes</th>
                <th>Destination Nodes</th>
                <th>Protocol</th>
                <th>Port</th>
                <th>Risk State</th>
                <th>Alert Decision</th>
              </tr>
            </thead>
            <tbody>
              {liveLogs.map((log, idx) => (
                <tr key={idx} style={{ animation: 'fadeIn 0.4s ease-out' }}>
                  <td className="mono" style={{ color: 'var(--text-secondary)' }}>{log.time}</td>
                  <td className="mono">{log.src}</td>
                  <td className="mono">{log.dst}</td>
                  <td className="mono" style={{ color: log.proto === 'TCP' ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>{log.proto}</td>
                  <td className="mono">{log.port}</td>
                  <td>
                    <span 
                      className="mono" 
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: log.class === 'danger' ? 'rgba(255,56,56,0.15)' : 'rgba(5,236,140,0.15)',
                        color: log.class === 'danger' ? 'var(--threat-high)' : 'var(--threat-low)',
                        border: `1px solid ${log.class === 'danger' ? 'rgba(255,56,56,0.2)' : 'rgba(5,236,140,0.2)'}`
                      }}
                    >
                      {log.risk}
                    </span>
                  </td>
                  <td className="flex align-center gap-10" style={{ borderBottom: 'none' }}>
                    {log.class === 'danger' ? (
                      <>
                        <ShieldAlert size={14} style={{ color: 'var(--threat-high)' }} />
                        <span style={{ color: 'var(--threat-high)', fontSize: '0.85rem', fontWeight: 500 }}>Blocked / Logged</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} style={{ color: 'var(--threat-low)' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Passed</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
