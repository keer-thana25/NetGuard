import { FeatureImportanceChart, ModelPerformanceRadar } from '../components/Charts';
import { Cpu, Award, Layers } from 'lucide-react';

export default function ModelInsights({ theme }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
