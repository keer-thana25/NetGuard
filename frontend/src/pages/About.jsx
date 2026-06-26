import { 
  BookOpen, 
  Database, 
  Settings, 
  HelpCircle, 
  Cpu, 
  Award, 
  Layers 
} from 'lucide-react';
import { 
  FeatureImportanceChart, 
  ModelPerformanceRadar 
} from '../components/Charts';

export default function About({ theme }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* SECTION 1: PROJECT OVERVIEW */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Project Overview
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          System documentation, underlying architectures, datasets, and protocols definitions.
        </p>
      </div>

      <div className="cyber-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', alignItems: 'stretch', marginBottom: '30px' }}>
        
        {/* Left Column: Objective & Protocols */}
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

        {/* Right Column: Data & Stack */}
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
              
              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-blue)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Frontend Core</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>React.js (Vite)</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--threat-low)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Backend API</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>FastAPI (Uvicorn)</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-purple)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Machine Learning</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Scikit-learn</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-blue)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>HTTP Client</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Axios API</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-blue)', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visual Analytics</span>
                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 600 }}>Recharts Engine</p>
              </div>

            </div>
          </div>

        </div>

      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '45px 0' }} />

      {/* SECTION 2: MODEL DIAGNOSTICS */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Model Diagnostics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Evaluate Random Forest feature importances, neural splits, and classification diagnostics.
        </p>
      </div>

      {/* Ensemble Model Info Card */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', marginBottom: '30px', alignItems: 'stretch' }}>
        
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--accent-purple)' }} /> Core Classifier: Random Forest
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              We selected the <strong>Random Forest Classifier</strong> (specifically configured with 200 estimators, max depth of 10, and balanced class weights) as the production standard.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Random Forest provides state-of-the-art accuracy when handling highly non-linear, tabular telemetry metrics. By aggregating predictions over independent decision trees, it mitigates noise, eliminates overfitting spikes, and maintains sub-millisecond evaluation latency suitable for inline packet security routing.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
              Top Telemetry Features Weighted
            </h4>
            <ul style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', listStyle: 'none' }}>
              {['packet_size', 'inter_arrival_time', 'spectral_entropy', 'frequency_band_energy', 'packet_count_5s'].map(feat => (
                <li 
                  key={feat} 
                  className="mono" 
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}
                >
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Model Metrics Radar */}
        <div className="cyber-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: 'var(--accent-purple)' }} /> Performance Radar
          </h3>
          <ModelPerformanceRadar theme={theme} />
        </div>

      </div>

      {/* Metric Cards Grid */}
      <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Accuracy</span>
          <h4 className="mono" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', color: 'var(--accent-cyan)' }}>98.5%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Overall ratio of correct classifications</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Precision</span>
          <h4 className="mono" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', color: 'var(--accent-cyan)' }}>97.8%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ability to avoid false threat blocks</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Recall</span>
          <h4 className="mono" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', color: 'var(--accent-cyan)' }}>98.1%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ability to isolate true anomalies</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>F1 Score</span>
          <h4 className="mono" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', color: 'var(--accent-cyan)' }}>98.0%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Harmonious precision & recall index</p>
        </div>

      </div>

      {/* Feature Importance detailed bar chart */}
      <div className="cyber-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} style={{ color: 'var(--accent-purple)' }} /> Feature Importance Breakdown
        </h3>
        <FeatureImportanceChart theme={theme} />
      </div>

    </div>
  );
}
