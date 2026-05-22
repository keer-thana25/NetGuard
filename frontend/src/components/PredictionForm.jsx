import React, { useState } from 'react';
import { ShieldAlert, Play, RefreshCw, Terminal, Sliders } from 'lucide-react';

const PRESETS = [
  {
    name: 'Normal HTTPS Connection',
    description: 'Safe, low-entropy web browsing packet.',
    data: {
      packet_size: 0.25,
      inter_arrival_time: 0.15,
      src_port: 52431,
      dst_port: 443,
      packet_count_5s: 0.35,
      spectral_entropy: 0.22,
      frequency_band_energy: 0.85,
      protocol: 'TCP',
      tcp_flags: ['SYN'],
      src_ip: '192.168.1.2',
      dst_ip: '192.168.1.5'
    }
  },
  {
    name: 'Anomalous Port Scan Sync',
    description: 'Rapid port query signature (high entropy, low duration, FIN/SYN-ACK).',
    data: {
      packet_size: 0.33,
      inter_arrival_time: 0.74,
      src_port: 30522,
      dst_port: 443,
      packet_count_5s: 0.14,
      spectral_entropy: 0.84,
      frequency_band_energy: 0.93,
      protocol: 'TCP',
      tcp_flags: ['SYN'],
      src_ip: '',
      dst_ip: ''
    }
  },
  {
    name: 'UDP Flood Scan Burst',
    description: 'Dense stream of rapid high-volume UDP bursts.',
    data: {
      packet_size: 0.88,
      inter_arrival_time: 0.005,
      src_port: 55431,
      dst_port: 53,
      packet_count_5s: 9.8,
      spectral_entropy: 0.98,
      frequency_band_energy: 0.05,
      protocol: 'UDP',
      tcp_flags: [],
      src_ip: '192.168.1.3',
      dst_ip: '192.168.1.6'
    }
  }
];

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    packet_size: 0.40,
    inter_arrival_time: 0.50,
    src_port: 80,
    dst_port: 80,
    packet_count_5s: 0.50,
    spectral_entropy: 0.50,
    frequency_band_energy: 0.50,
    protocol: 'TCP',
    tcp_flags: ['SYN'],
    src_ip: '',
    dst_ip: ''
  });

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['src_port', 'dst_port'].includes(name) 
        ? (value === '' ? '' : parseInt(value, 10))
        : (value === '' ? '' : parseFloat(value))
    }));
  };

  const handleProtocolChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      protocol: value,
      // Clear flags if protocol is UDP
      tcp_flags: value === 'UDP' ? [] : prev.tcp_flags
    }));
  };

  const handleFlagCheckbox = (flag) => {
    setFormData(prev => {
      const exists = prev.tcp_flags.includes(flag);
      const newFlags = exists 
        ? prev.tcp_flags.filter(f => f !== flag)
        : [...prev.tcp_flags, flag];
      return { ...prev, tcp_flags: newFlags };
    });
  };

  const loadPreset = (preset) => {
    setFormData({ ...preset.data });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="cyber-card" style={{ height: '100%' }}>
      <div className="flex align-center justify-between" style={{ marginBottom: '24px' }}>
        <h2 className="text-glow-cyan" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} /> Network Telemetry Analyzer
        </h2>
        <span className="mono" style={{ fontSize: '0.8rem', opacity: 0.6 }}>INPUT_PANEL_v1.2</span>
      </div>

      {/* Preset Selectors */}
      <div style={{ marginBottom: '24px' }}>
        <span className="cyber-label" style={{ marginBottom: '10px', fontSize: '0.75rem' }}>Presets Scenarios</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="cyber-input"
              style={{
                width: 'auto',
                padding: '6px 12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                background: 'rgba(0, 242, 254, 0.05)',
                borderColor: 'rgba(0, 242, 254, 0.25)',
                color: 'var(--accent-cyan)'
              }}
              onClick={() => loadPreset(p)}
              title={p.description}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          
          <div className="cyber-form-group">
            <label className="cyber-label">Packet Size</label>
            <input
              type="number"
              step="0.01"
              name="packet_size"
              value={formData.packet_size}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 0.35"
              min="0"
              max="2.0"
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-label">Inter Arrival Time (s)</label>
            <input
              type="number"
              step="0.001"
              name="inter_arrival_time"
              value={formData.inter_arrival_time}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 0.02"
              min="0"
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-label">Source Port</label>
            <input
              type="number"
              name="src_port"
              value={formData.src_port}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 443"
              min="0"
              max="65535"
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-label">Destination Port</label>
            <input
              type="number"
              name="dst_port"
              value={formData.dst_port}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 80"
              min="0"
              max="65535"
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-label">Packet Count (5s)</label>
            <input
              type="number"
              step="0.01"
              name="packet_count_5s"
              value={formData.packet_count_5s}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 1.50"
              min="0"
            />
          </div>

          <div className="cyber-form-group">
            <label className="cyber-label">Spectral Entropy</label>
            <input
              type="number"
              step="0.01"
              name="spectral_entropy"
              value={formData.spectral_entropy}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 0.45"
              min="0"
              max="1.5"
            />
          </div>

          <div className="cyber-form-group" style={{ gridColumn: 'span 2' }}>
            <label className="cyber-label">Frequency Band Energy</label>
            <input
              type="number"
              step="0.01"
              name="frequency_band_energy"
              value={formData.frequency_band_energy}
              onChange={handleInputChange}
              required
              className="cyber-input"
              placeholder="e.g. 0.62"
              min="0"
            />
          </div>

          <div className="cyber-form-group" style={{ gridColumn: 'span 2' }}>
            <label className="cyber-label">Protocol Selection</label>
            <div style={{ display: 'flex', gap: '30px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="protocol"
                  value="TCP"
                  checked={formData.protocol === 'TCP'}
                  onChange={handleProtocolChange}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>TCP Protocol</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="protocol"
                  value="UDP"
                  checked={formData.protocol === 'UDP'}
                  onChange={handleProtocolChange}
                  style={{ accentColor: 'var(--accent-cyan)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>UDP Protocol</span>
              </label>
            </div>
          </div>

          {formData.protocol === 'TCP' && (
            <div className="cyber-form-group" style={{ gridColumn: 'span 2', animation: 'fadeIn 0.3s ease' }}>
              <label className="cyber-label">TCP Flags</label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['FIN', 'SYN', 'SYN_ACK'].map(flag => (
                  <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.tcp_flags.includes(flag)}
                      onChange={() => handleFlagCheckbox(flag)}
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{flag.replace('_', '-')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Accordion for Advanced Network Settings */}
        <div className="cyber-accordion">
          <div 
            className="cyber-accordion-header"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={14} /> Advanced Network Settings
            </span>
            <span>{advancedOpen ? '▲' : '▼'}</span>
          </div>

          {advancedOpen && (
            <div className="cyber-accordion-content" style={{ animation: 'slideDown 0.3s ease' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Optional node address simulation to maintain scaling model properties. Defaults to inactive (0).
              </p>
              <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="cyber-form-group">
                  <label className="cyber-label">Simulation Src IP</label>
                  <select
                    name="src_ip"
                    value={formData.src_ip}
                    onChange={(e) => setFormData(prev => ({ ...prev, src_ip: e.target.value }))}
                    className="cyber-input cyber-select"
                  >
                    <option value="">Default (Inactive / 0)</option>
                    <option value="192.168.1.2">192.168.1.2</option>
                    <option value="192.168.1.3">192.168.1.3</option>
                  </select>
                </div>

                <div className="cyber-form-group">
                  <label className="cyber-label">Simulation Dst IP</label>
                  <select
                    name="dst_ip"
                    value={formData.dst_ip}
                    onChange={(e) => setFormData(prev => ({ ...prev, dst_ip: e.target.value }))}
                    className="cyber-input cyber-select"
                  >
                    <option value="">Default (Inactive / 0)</option>
                    <option value="192.168.1.5">192.168.1.5</option>
                    <option value="192.168.1.6">192.168.1.6</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="cyber-btn"
          disabled={loading}
          style={{ width: '100%', marginTop: '30px' }}
        >
          {loading ? (
            <>
              <RefreshCw className="spin" size={18} /> Processing Inference...
            </>
          ) : (
            <>
              <Play size={18} /> Analyze Network Traffic
            </>
          )}
        </button>
      </form>
    </div>
  );
}
