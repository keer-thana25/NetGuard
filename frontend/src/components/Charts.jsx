
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

// Theme-based colors for Recharts SVGs
const getChartColors = (theme) => {
  if (theme === 'light') {
    return {
      cyan: '#0284c7', // Slate sky blue
      blue: '#2563eb', // Royal blue
      purple: '#7c3aed', // Purple
      green: '#16a34a', // Safe/success green
      red: '#dc2626', // Threat/high-risk red
      text: '#555555', // Neutral dark text
      grid: '#e5e3db', // Subtle light theme border
      tooltipBg: '#f7f6f2',
      tooltipBorder: 'rgba(0, 0, 0, 0.08)',
      tooltipText: '#111111',
      axisStroke: '#8c8c8c'
    };
  } else {
    return {
      cyan: '#06b6d4', // Modern neon cyan
      blue: '#3b82f6', // Softer slate blue
      purple: '#a78bfa', // Softer purple
      green: '#10b981', // Clean success green
      red: '#ef4444', // Clean red
      text: '#9ca3af', // Gray text
      grid: 'rgba(255, 255, 255, 0.08)',
      tooltipBg: '#2f2f2f',
      tooltipBorder: 'rgba(255, 255, 255, 0.08)',
      tooltipText: '#f3f4f6',
      axisStroke: '#6b7280'
    };
  }
};

// Tooltip styled component for premium cyber theme
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const colors = getChartColors(theme);
    return (
      <div 
        style={{
          background: colors.tooltipBg,
          border: `1px solid ${colors.tooltipBorder}`,
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-sans)',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}
      >
        <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px' }}>
          {label ? `TIMESTAMP: ${label}` : 'METRICS'}
        </p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex align-center gap-10" style={{ margin: '4px 0' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color || p.fill }}></span>
            <span style={{ fontSize: '0.85rem', color: colors.tooltipText, fontWeight: 500 }}>
              {p.name}: <span className="mono" style={{ color: colors.cyan }}>{p.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Traffic Insights (Volume / Packet Trends over simulated time)
export function TrafficTrendsChart({ data, theme }) {
  const colors = getChartColors(theme);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.cyan} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={colors.cyan} stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.blue} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={colors.blue} stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke={colors.axisStroke} fontSize={11} className="mono" />
        <YAxis stroke={colors.axisStroke} fontSize={11} className="mono" />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Area name="Packet Size" type="monotone" dataKey="packetSize" stroke={colors.cyan} fillOpacity={1} fill="url(#colorPacket)" strokeWidth={2} />
        <Area name="Traffic Rate" type="monotone" dataKey="trafficRate" stroke={colors.blue} fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// 2. Protocol Distribution (TCP vs UDP)
export function ProtocolDistributionChart({ data, theme }) {
  const colors = getChartColors(theme);
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
          <Cell fill={colors.cyan} />
          <Cell fill={colors.purple} />
        </Pie>
        <Tooltip content={<CustomTooltip theme={theme} />} />
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
export function PortAnalysisChart({ data, theme }) {
  const colors = getChartColors(theme);
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
        <XAxis dataKey="port" stroke={colors.axisStroke} fontSize={10} />
        <YAxis stroke={colors.axisStroke} fontSize={11} className="mono" />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Legend formatter={(value) => <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>} />
        <Bar name="Total Packets" dataKey="connections" fill={colors.blue} radius={[4, 4, 0, 0]} />
        <Bar name="Flagged Threats" dataKey="anomalies" fill={colors.red} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 4. Anomaly Distribution (Normal vs Suspicious)
export function AnomalyDistributionChart({ normal, suspicious, theme }) {
  const colors = getChartColors(theme);
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
          <Cell fill={colors.green} />
          <Cell fill={colors.red} />
        </Pie>
        <Tooltip content={<CustomTooltip theme={theme} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 5. Feature Importance Chart (From scikit-learn RandomForest model)
export function FeatureImportanceChart({ theme }) {
  const colors = getChartColors(theme);
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
        <XAxis type="number" stroke={colors.axisStroke} fontSize={11} className="mono" />
        <YAxis type="category" dataKey="feature" stroke={colors.axisStroke} fontSize={11} width={120} />
        <Tooltip content={<CustomTooltip theme={theme} />} />
        <Bar name="Importance Score" dataKey="importance" fill={colors.cyan} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 6. Model Performance Radar (Metrics: Accuracy, Precision, Recall, F1, AUC)
export function ModelPerformanceRadar({ theme }) {
  const colors = getChartColors(theme);
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
        <PolarGrid stroke={colors.grid} />
        <PolarAngleAxis dataKey="subject" stroke={colors.text} fontSize={11} />
        <PolarRadiusAxis angle={30} domain={[90, 100]} stroke={colors.grid} />
        <Radar
          name="Random Forest"
          dataKey="value"
          stroke={colors.cyan}
          fill={colors.cyan}
          fillOpacity={0.2}
        />
        <Tooltip content={<CustomTooltip theme={theme} />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
