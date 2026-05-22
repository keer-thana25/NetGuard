import React from 'react';
import { BookOpen, Database, Settings, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-glow-cyan" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} className="text-glow-cyan" /> Project Objective
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              NetGuard was designed to create an automated, intelligent defensive layer capable of isolating network traffic anomalies. By utilizing advanced telemetry extraction and ensemble machine learning algorithms, it classifies micro-packet headers instantly, preventing malicious scanning, DDoS preparation, or data exfiltration.
            </p>
          </div>

          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} className="text-glow-cyan" /> Core Protocol Definitions
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '6px' }}>
                TCP (Transmission Control Protocol)
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                A reliable, connection-oriented communication protocol. TCP enforces three-way handshakes (SYN, SYN-ACK, ACK) and automatic packet ordering/retransmission, ensuring completely error-free delivery at the expense of handshake latency.
              </p>
            </div>

            <div>
              <h4 className="mono" style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', marginBottom: '6px' }}>
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} className="text-glow-cyan" /> Dataset Description
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Source Telemetry</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: '#fff' }}>network_traffic.csv</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Samples</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: '#fff' }}>1,001 rows</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Class Mapping</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: '#fff' }}>0 → Normal / 1 → Anomaly</span>
              </div>
              <div className="flex justify-between" style={{ paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Evaluated Split</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: '#fff' }}>80% Train / 20% Test</span>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} className="text-glow-cyan" /> Technology Stack
            </h3>
            
            <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Frontend Core</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>React.js (Vite)</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Backend API</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>FastAPI (Uvicorn)</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Machine Learning</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>Scikit-learn</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HTTP Client</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>Axios API</p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Visual Analytics</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>Recharts Engine</p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
