import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, CheckCircle, ArrowRight, ShieldCheck, Terminal, BarChart3, PieChart } from 'lucide-react';
import { 
  TrafficTrendsChart, 
  ProtocolDistributionChart, 
  PortAnalysisChart, 
  AnomalyDistributionChart 
} from '../components/Charts';

// Pre-packaged simulated traffic packet trend history
const TREND_DATA = [
  { time: '14:00', packetSize: 0.25, trafficRate: 1.25 },
  { time: '14:05', packetSize: 0.33, trafficRate: 0.95 },
  { time: '14:10', packetSize: 0.85, trafficRate: 3.42 },
  { time: '14:15', packetSize: 0.92, trafficRate: 8.54 },
  { time: '14:20', packetSize: 0.41, trafficRate: 2.11 },
  { time: '14:25', packetSize: 0.35, trafficRate: 1.15 },
  { time: '14:30', packetSize: 0.28, trafficRate: 0.78 }
];

const INITIAL_LOGS = [
  { time: '14:24:02', src: '192.168.1.15', dst: '8.8.8.8', proto: 'UDP', port: '53', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:55', src: '10.0.0.84', dst: '192.168.1.2', proto: 'TCP', port: '443', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:41', src: '192.168.1.25', dst: '54.210.12.9', proto: 'TCP', port: '80', status: 'Anomaly', risk: 'High', class: 'danger' },
  { time: '14:23:22', src: '192.168.1.3', dst: '192.168.1.6', proto: 'TCP', port: '22', status: 'Normal', risk: 'Low', class: 'safe' },
  { time: '14:23:10', src: '172.16.0.4', dst: '192.168.1.5', proto: 'UDP', port: '161', status: 'Anomaly', risk: 'High', class: 'danger' },
];

export default function Dashboard({ onNavigate, theme }) {
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
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-card) 100%)',
          borderLeft: '2px solid #1f6feb',
          boxShadow: 'var(--card-shadow)',
          padding: '40px'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-blue)' }}>
            Cybersecurity defense system active
          </span>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            marginTop: '10px', 
            marginBottom: '10px', 
            background: 'linear-gradient(90deg, var(--text-primary) 30%, #1f6feb)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            NetGuard
          </h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            AI-Powered Network Traffic Anomaly Detection
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Inspect micro-telemetry packets, classify suspicious TCP/UDP behavior in real-time, and run advanced metrics evaluation utilizing robust scikit-learn random forest models.
          </p>
          <button 
            className="cyber-btn"
            onClick={() => onNavigate('live-monitor')}
            style={{ background: '#1f6feb' }}
          >
            Launch Traffic Analyzer <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="cyber-grid" style={{ marginBottom: '30px' }}>
        
        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>Analyzed telemetry</span>
            <h4 className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              {stats.total.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>Threats isolated</span>
            <h4 className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: 'var(--threat-high)' }}>
              {stats.threats.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>Model precision</span>
            <h4 className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: 'var(--threat-low)' }}>
              {stats.accuracy}%
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>Defensive state</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', color: 'var(--threat-low)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator green" style={{ width: '8px', height: '8px' }}></span> Monitoring
            </h4>
          </div>
        </div>

      </div>

      {/* Recent Packet Logs Table */}
      <div className="cyber-card">
        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Terminal size={16} /> Live packet stream simulation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Real-time inbound connections classified dynamically by the backend random forest model.
            </p>
          </div>
          <span className="mono" style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}>
            live_feed
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
                <tr 
                  key={idx} 
                  style={{ 
                    animation: 'fadeIn 0.4s ease-out',
                    backgroundColor: theme === 'light' 
                      ? (idx % 2 === 0 ? '#ffffff' : '#f9fafb') 
                      : (idx % 2 === 0 ? '#161b22' : '#1c2333')
                  }}
                >
                  <td className="mono" style={{ color: 'var(--text-secondary)' }}>{log.time}</td>
                  <td className="mono" style={{ color: 'var(--text-primary)' }}>{log.src}</td>
                  <td className="mono" style={{ color: 'var(--text-primary)' }}>{log.dst}</td>
                  <td className="mono" style={{ color: log.proto === 'TCP' ? 'var(--accent-blue)' : 'var(--accent-purple)' }}>{log.proto}</td>
                  <td className="mono" style={{ color: 'var(--text-primary)' }}>{log.port}</td>
                  <td>
                    <span 
                      className="mono" 
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: log.class === 'danger' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: log.class === 'danger' ? 'var(--threat-high)' : 'var(--threat-low)',
                        border: `1px solid ${log.class === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`
                      }}
                    >
                      {log.risk}
                    </span>
                  </td>
                  <td className="flex align-center gap-10" style={{ borderBottom: 'none' }}>
                    {log.class === 'danger' ? (
                      <>
                        <ShieldAlert size={14} style={{ color: 'var(--threat-high)' }} />
                        <span style={{ color: 'var(--threat-high)', fontSize: '0.85rem', fontWeight: 600 }}>Blocked / Logged</span>
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

      {/* Threat Analytics Section */}
      <div style={{ marginTop: '40px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Threat analytics
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Interactive telemetry profiles and port vulnerability analysis compiled from network transactions.
        </p>
      </div>

      {/* Row 1: Line/Area trend and Port bar charts */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', marginBottom: '30px' }}>
        
        <div className="cyber-card">
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--accent-blue)' }} /> Traffic packet size & rate trends
          </h3>
          <TrafficTrendsChart data={TREND_DATA} theme={theme} />
        </div>

        <div className="cyber-card">
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} style={{ color: 'var(--accent-blue)' }} /> Vulnerable destination ports analysis
          </h3>
          <PortAnalysisChart theme={theme} />
        </div>

      </div>

      {/* Row 2: Double Pie charts for Protocol split & Anomaly distribution */}
      <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        
        <div className="cyber-card">
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} style={{ color: 'var(--accent-blue)' }} /> Inbound telemetry protocol splits
          </h3>
          <ProtocolDistributionChart data={{ tcpCount: 684, udpCount: 317 }} theme={theme} />
        </div>

        <div className="cyber-card">
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-blue)' }} /> Threat class anomaly distribution
          </h3>
          <AnomalyDistributionChart normal={745} suspicious={256} theme={theme} />
        </div>

      </div>

    </div>
  );
}
