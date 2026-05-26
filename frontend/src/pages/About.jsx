import { BookOpen, Database, Settings, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          About NetGuard
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          System documentation, underlying architectures, datasets, and protocols definitions.
        </p>
      </div>

      <div className="cyber-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', alignItems: 'stretch' }}>
        
        {/* Left Side: Objective & Protocols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--accent-purple)' }} /> Project Objective
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              NetGuard was designed to create an automated, intelligent defensive layer capable of isolating network traffic anomalies. By utilizing advanced telemetry extraction and ensemble machine learning algorithms, it classifies micro-packet headers instantly, preventing malicious scanning, DDoS preparation, or data exfiltration.
            </p>
          </div>

          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} style={{ color: 'var(--accent-purple)' }} /> Core Protocol Definitions
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginBottom: '6px', fontWeight: 700 }}>
                TCP (Transmission Control Protocol)
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                A reliable, connection-oriented communication protocol. TCP enforces three-way handshakes (SYN, SYN-ACK, ACK) and automatic packet ordering/retransmission, ensuring completely error-free delivery at the expense of handshake latency.
              </p>
            </div>

            <div>
              <h4 className="mono" style={{ color: 'var(--accent-purple)', fontSize: '0.95rem', marginBottom: '6px', fontWeight: 700 }}>
                UDP (User Datagram Protocol)
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                A fast, connectionless transmission protocol. UDP transfers packets directly without handshake confirmation, flow controls, or re-ordering. It is optimal for real-time video, voice, and DNS queries where delivery speed is prioritized over reliability.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Data & Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} style={{ color: 'var(--accent-purple)' }} /> Dataset Description
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Source Telemetry</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>network_traffic.csv</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Samples</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>1,001 rows</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Class Mapping</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>0 → Normal / 1 → Anomaly</span>
              </div>
              <div className="flex justify-between" style={{ paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Evaluated Split</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>80% Train / 20% Test</span>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} style={{ color: 'var(--accent-purple)' }} /> Technology Stack
            </h3>
            
            <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Frontend Core</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>React.js (Vite)</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Backend API</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>FastAPI (Uvicorn)</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Machine Learning</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Scikit-learn</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>HTTP Client</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Axios API</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visual Analytics</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Recharts Engine</p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
