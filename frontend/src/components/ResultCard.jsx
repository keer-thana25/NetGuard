import { ShieldCheck, ShieldAlert, AlertTriangle, Cpu, Info } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div 
        className="cyber-card" 
        style={{ 
          height: '100%', 
          minHeight: '340px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px 24px', 
          textAlign: 'center', 
          color: 'var(--text-muted)' 
        }}
      >
        <ShieldCheck size={48} style={{ marginBottom: '18px', color: 'var(--accent-blue)', opacity: 0.4 }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Awaiting Network Packet Metrics
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: '1.5' }}>
          Submit telemetry in the analyzer panel to run real-time AI classification.
        </p>
      </div>
    );
  }

  const { prediction, status, confidence, risk } = result;
  const isAnomaly = prediction === 1;

  return (
    <div 
      className={`cyber-card ${isAnomaly ? 'alert-high' : 'alert-low'}`}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'fadeIn 0.5s ease-out' }}
    >
      {/* Alert Header */}
      <div>
        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
          <span className="mono" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
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
              background: isAnomaly ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              border: `2px solid ${isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)'}`,
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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Classification Result
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              {status}
            </h3>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '30px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span className="flex align-center gap-10" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
              <AlertTriangle size={12} style={{ color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }} /> Threat Level
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }}>
              {risk} Risk
            </span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span className="flex align-center gap-10" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
              <Cpu size={12} style={{ color: 'var(--accent-cyan)' }} /> Confidence
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {confidence}%
            </span>
          </div>

        </div>

        {/* High-tech progress bar */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
            <span>MODEL_CONFIDENCE_THRESHOLD</span>
            <span style={{ color: 'var(--text-primary)' }}>{confidence}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div 
              style={{
                width: `${confidence}%`,
                height: '100%',
                background: isAnomaly ? 'linear-gradient(90deg, var(--accent-blue), var(--threat-high))' : 'linear-gradient(90deg, var(--accent-blue), var(--threat-low))',
                borderRadius: '4px',
                transition: 'width 1s ease-out'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Explanatory description card */}
      <div 
        style={{
          background: 'var(--bg-secondary)',
          borderLeft: `4px solid ${isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)'}`,
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          border: '1px solid var(--border-color)',
          borderLeftWidth: '4px'
        }}
      >
        <Info size={16} style={{ color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
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
