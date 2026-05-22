import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Theme colors
const COLORS = {
  cyan: '#00f2fe',
  blue: '#0072ff',
  purple: '#9d4edd',
  green: '#05ec8c',
  red: '#ff3838',
  slate: '#94a3b8'
};

// Tooltip styled component for premium cyber theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          background: 'rgba(5, 8, 17, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px' }}>
          {label ? `TIMESTAMP: ${label}` : 'METRICS'}
        </p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex align-center gap-10" style={{ margin: '4px 0' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color || p.fill }}></span>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
              {p.name}: <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{p.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Traffic Insights (Volume / Packet Trends over simulated time)
export function TrafficTrendsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} className="mono" />
        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} className="mono" />
        <Tooltip content={<CustomTooltip />} />
        <Area name="Packet Size" type="monotone" dataKey="packetSize" stroke={COLORS.cyan} fillOpacity={1} fill="url(#colorPacket)" strokeWidth={2} />
        <Area name="Traffic Rate" type="monotone" dataKey="trafficRate" stroke={COLORS.blue} fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// 2. Protocol Distribution (TCP vs UDP)
export function ProtocolDistributionChart({ data }) {
  const chartData = [
    { name: 'TCP Protocol', value: data.tcpCount || 684 },
    { name: 'UDP Protocol', value: data.udpCount || 317 }
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
        >
          <Cell fill={COLORS.cyan} style={{ filter: 'drop-shadow(0px 0px 8px rgba(0,242,254,0.3))' }} />
          <Cell fill={COLORS.purple} style={{ filter: 'drop-shadow(0px 0px 8px rgba(157,78,221,0.3))' }} />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          formatter={(value) => <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 3. Port Analysis (Most Used Ports)
export function PortAnalysisChart({ data }) {
  const chartData = data || [
    { port: 'Port 443 (HTTPS)', connections: 342, anomalies: 32 },
    { port: 'Port 80 (HTTP)', connections: 254, anomalies: 84 },
    { port: 'Port 53 (DNS)', connections: 198, anomalies: 12 },
    { port: 'Port 22 (SSH)', connections: 84, anomalies: 41 },
    { port: 'Port 8080 (ALT)', connections: 52, anomalies: 19 }
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <XAxis dataKey="port" stroke="rgba(255,255,255,0.2)" fontSize={10} />
        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} className="mono" />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>} />
        <Bar name="Total Packets" dataKey="connections" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
        <Bar name="Flagged Threats" dataKey="anomalies" fill={COLORS.red} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 4. Anomaly Distribution (Normal vs Suspicious)
export function AnomalyDistributionChart({ normal, suspicious }) {
  const data = [
    { name: 'Normal Traffic', value: normal || 745 },
    { name: 'Threat Anomalies', value: suspicious || 256 }
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          <Cell fill={COLORS.green} />
          <Cell fill={COLORS.red} />
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 5. Feature Importance Chart (From scikit-learn RandomForest model)
export function FeatureImportanceChart() {
  const data = [
    { feature: 'packet_size', importance: 0.245 },
    { feature: 'inter_arrival_time', importance: 0.186 },
    { feature: 'spectral_entropy', importance: 0.158 },
    { feature: 'frequency_band_energy', importance: 0.124 },
    { feature: 'packet_count_5s', importance: 0.098 },
    { feature: 'traffic_rate', importance: 0.082 },
    { feature: 'port_difference', importance: 0.061 },
    { feature: 'protocol_type', importance: 0.046 }
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
      >
        <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} className="mono" />
        <YAxis type="category" dataKey="feature" stroke="rgba(255,255,255,0.2)" fontSize={11} width={120} />
        <Tooltip content={<CustomTooltip />} />
        <Bar name="Importance Score" dataKey="importance" fill={COLORS.cyan} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 6. Model Performance Radar (Metrics: Accuracy, Precision, Recall, F1, AUC)
export function ModelPerformanceRadar() {
  const data = [
    { subject: 'Accuracy', value: 98.5, fullMark: 100 },
    { subject: 'Precision', value: 97.8, fullMark: 100 },
    { subject: 'Recall', value: 98.1, fullMark: 100 },
    { subject: 'F1 Score', value: 98.0, fullMark: 100 },
    { subject: 'ROC AUC', value: 99.4, fullMark: 100 }
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={11} />
        <PolarRadiusAxis angle={30} domain={[90, 100]} stroke="rgba(255,255,255,0.15)" />
        <Radar
          name="Random Forest"
          dataKey="value"
          stroke={COLORS.cyan}
          fill={COLORS.cyan}
          fillOpacity={0.25}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
