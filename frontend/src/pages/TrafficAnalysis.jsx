import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import { predictTraffic } from '../services/api';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function TrafficAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictTraffic(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to the prediction backend server. Please verify the FastAPI uvicorn server is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-glow-cyan" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Network Traffic Analysis Console
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Evaluate incoming packets, extract characteristics, and pipe them directly through scikit-learn robust-scaled classification.
        </p>
      </div>

      {error && (
        <div 
          className="cyber-card" 
          style={{ 
            background: 'rgba(255, 56, 56, 0.1)', 
            borderColor: 'var(--threat-high)', 
            color: 'var(--threat-high)',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}
        >
          <div className="flex align-center gap-10">
            <ShieldAlert size={18} />
            <strong>Backend Connection Fault:</strong> {error}
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'stretch' }}>
        
        <div>
          <PredictionForm onSubmit={handleAnalysisSubmit} loading={loading} />
        </div>

        <div>
          <ResultCard result={result} />
        </div>

      </div>

    </div>
  );
}
