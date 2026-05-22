import React from 'react';
import { FeatureImportanceChart, ModelPerformanceRadar } from '../components/Charts';
import { Cpu, Award, HelpCircle, Layers } from 'lucide-react';

export default function ModelInsights() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-glow-cyan" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Model Diagnostics & Feature Insights
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Evaluate Random Forest feature importances, neural splits, and classification diagnostics.
        </p>
      </div>

      {/* Ensemble Model Info Card */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', marginBottom: '30px', alignItems: 'stretch' }}>
        
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} className="text-glow-cyan" /> Core Classifier: Random Forest
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              We selected the <strong>Random Forest Classifier</strong> (specifically configured with 200 estimators, max depth of 10, and balanced class weights) as the production standard.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Random Forest provides state-of-the-art accuracy when handling highly non-linear, tabular telemetry metrics. By aggregating predictions over independent decision trees, it mitigates noise, eliminates overfitting spikes, and maintains sub-millisecond evaluation latency suitable for inline packet security routing.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 242, 254, 0.1)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
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
                    background: 'rgba(0, 242, 254, 0.05)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    borderRadius: '4px',
                    color: 'var(--accent-cyan)'
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} className="text-glow-cyan" /> Performance Radar
          </h3>
          <ModelPerformanceRadar />
        </div>

      </div>

      {/* Metric Cards Grid */}
      <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        
        <div style={{ background: 'rgba(5, 8, 17, 0.4)', border: '1px solid rgba(0,242,254,0.1)', padding: '20px', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Accuracy</span>
          <h4 className="mono text-glow-cyan" style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '6px' }}>98.5%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Overall ratio of correct classifications</p>
        </div>

        <div style={{ background: 'rgba(5, 8, 17, 0.4)', border: '1px solid rgba(0,242,254,0.1)', padding: '20px', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Precision</span>
          <h4 className="mono text-glow-cyan" style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '6px' }}>97.8%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ability to avoid false threat blocks</p>
        </div>

        <div style={{ background: 'rgba(5, 8, 17, 0.4)', border: '1px solid rgba(0,242,254,0.1)', padding: '20px', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recall</span>
          <h4 className="mono text-glow-cyan" style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '6px' }}>98.1%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ability to isolate true anomalies</p>
        </div>

        <div style={{ background: 'rgba(5, 8, 17, 0.4)', border: '1px solid rgba(0,242,254,0.1)', padding: '20px', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>F1 Score</span>
          <h4 className="mono text-glow-cyan" style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '6px' }}>98.0%</h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Harmonious precision & recall index</p>
        </div>

      </div>

      {/* Feature Importance detailed bar chart */}
      <div className="cyber-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} className="text-glow-cyan" /> Feature Importance Breakdown
        </h3>
        <FeatureImportanceChart />
      </div>

    </div>
  );
}
