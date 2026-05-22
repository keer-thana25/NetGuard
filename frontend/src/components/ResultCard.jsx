import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Cpu, TrendingUp, Info } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="cyber-card flex align-center justify-center" style={{ height: '100%', minHeight: '300px', flexDirection: 'column', color: 'var(--text-muted)' }}>
        <ShieldCheck size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
        <p style={{ fontSize: '0.95rem' }}>Awaiting network packet metrics...</p>
        <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Submit telemetry in the analyzer panel to run real-time AI classification.</p>
      </div>
    );
  }

  const { prediction, status, confidence, risk } = result;
  const isAnomaly = prediction === 1;

  return (
    <div 
      className={`cyber-card ${isAnomaly ? 'alert-high' : 'alert-low'}`}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
    >
      {/* Alert Header */}
      <div>
        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
          <span className="mono" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            DECISION_NODE // OUT_INFERENCE
          </span>
          <div className="flex align-center gap-10">
            <span className={`pulse-indicator ${isAnomaly ? 'red' : 'green'}`}></span>
            <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }}>
              {isAnomaly ? 'CRITICAL_ALERT' : 'SECURE_SIGNAL'}
            </span>
          </div>
        </div>

        {/* Primary Classification Result */}
        <div className="flex align-center" style={{ gap: '20px', marginBottom: '30px' }}>
          <div 
            style={{
              padding: '16px',
              borderRadius: '50%',
              background: isAnomaly ? 'rgba(255, 56, 56, 0.15)' : 'rgba(5, 236, 140, 0.15)',
              border: `2px solid ${isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)'}`,
              boxShadow: `0 0 20px ${isAnomaly ? 'rgba(255, 56, 56, 0.3)' : 'rgba(5, 236, 140, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isAnomaly ? (
              <ShieldAlert size={36} style={{ color: 'var(--threat-high)' }} />
            ) : (
              <ShieldCheck size={36} style={{ color: 'var(--threat-low)' }} />
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Classification Result
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#fff' }}>
              {status}
            </h3>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '30px' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <span className="flex align-center gap-10" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              <AlertTriangle size={12} style={{ color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }} /> Threat Level
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }}>
              {risk} Risk
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <span className="flex align-center gap-10" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Cpu size={12} style={{ color: 'var(--accent-cyan)' }} /> Confidence
            </span>
            <span className="text-glow-cyan" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {confidence}%
            </span>
          </div>

        </div>

        {/* High-tech progress bar */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>MODEL_CONFIDENCE_THRESHOLD</span>
            <span>{confidence}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${confidence}%`,
                height: '100%',
                background: isAnomaly ? 'linear-gradient(90deg, var(--accent-blue), var(--threat-high))' : 'linear-gradient(90deg, var(--accent-blue), var(--threat-low))',
                borderRadius: '4px',
                transition: 'width 1s ease-out',
                boxShadow: `0 0 10px ${isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)'}`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Explanatory description card */}
      <div 
        style={{
          background: 'rgba(10, 15, 29, 0.6)',
          borderLeft: `3px solid ${isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)'}`,
          padding: '16px',
          borderRadius: '0 8px 8px 0',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <Info size={16} style={{ color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            {isAnomaly ? 'Threat Signature Detected' : 'No Anomalous Signatures'}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {isAnomaly 
              ? 'Abnormal traffic behavior detected. The network payload patterns match known scanner signatures, SYN floods, or malicious exfiltration bursts.' 
              : 'Traffic pattern appears completely safe. Features align with typical secure client-server socket communications.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
