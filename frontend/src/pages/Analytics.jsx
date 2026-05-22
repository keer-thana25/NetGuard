import React from 'react';
import { 
  TrafficTrendsChart, 
  ProtocolDistributionChart, 
  PortAnalysisChart, 
  AnomalyDistributionChart 
} from '../components/Charts';
import { BarChart3, PieChart, Activity, HelpCircle } from 'lucide-react';

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

export default function Analytics() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-glow-cyan" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Threat Analytics Platform
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Interactive telemetry profiles and port vulnerability analysis compiled from network transactions.
        </p>
      </div>

      {/* Row 1: Line/Area trend and Port bar charts */}
      <div className="cyber-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', marginBottom: '30px' }}>
        
        <div className="cyber-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} className="text-glow-cyan" /> Traffic Packet Size & Rate Trends
          </h3>
          <TrafficTrendsChart data={TREND_DATA} />
        </div>

        <div className="cyber-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} className="text-glow-cyan" /> Vulnerable Destination Ports Analysis
          </h3>
          <PortAnalysisChart />
        </div>

      </div>

      {/* Row 2: Double Pie charts for Protocol split & Anomaly distribution */}
      <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        
        <div className="cyber-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} className="text-glow-cyan" /> Inbound Telemetry Protocol Splits
          </h3>
          <ProtocolDistributionChart data={{ tcpCount: 684, udpCount: 317 }} />
        </div>

        <div className="cyber-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} className="text-glow-cyan" /> Threat Class Anomaly Distribution
          </h3>
          <AnomalyDistributionChart normal={745} suspicious={256} />
        </div>

      </div>

    </div>
  );
}
import { ShieldCheck } from 'lucide-react';
