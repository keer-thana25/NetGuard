import { useState, useEffect, useRef } from 'react';
import { 
  startLiveMonitoring, 
  stopLiveMonitoring, 
  getLiveMonitorStatus, 
  getLiveMonitorAlerts, 
  simulateLiveAnomaly, 
  downloadLiveSessionReport,
  getLiveNetworkSpeed
} from '../services/api';
import { 
  Play, 
  Square, 
  Skull, 
  Download, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Server,
  Wifi,
  ShieldAlert as AlertIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export default function LiveMonitor({ theme }) {
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState({
    risk_score: 0,
    label: 'Safe',
    color: 'green',
    reason: 'Traffic looks normal',
    packets_analyzed: 0,
    anomaly_count: 0,
    timestamp: ''
  });
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [speed, setSpeed] = useState({ download_mbps: null, upload_mbps: null });

  // Store previous alerts count to detect new alerts
  const prevAlertsCountRef = useRef(0);

  // Theme based color palette for chart and UI
  const getThemeColors = () => {
    if (theme === 'light') {
      return {
        cyan: '#0ea5e9',
        blue: '#2563eb',
        purple: '#7c3aed',
        green: '#16a34a',
        red: '#dc2626',
        orange: '#ea580c',
        yellow: '#f59e0b',
        text: '#555555',
        grid: '#e5e3db',
        cardBg: '#ffffff',
        border: 'rgba(0, 0, 0, 0.08)',
        tooltipBg: '#f7f6f2'
      };
    } else {
      return {
        cyan: '#06b6d4',
        blue: '#3b82f6',
        purple: '#a78bfa',
        green: '#10b981',
        red: '#ef4444',
        orange: '#f97316',
        yellow: '#eab308',
        text: '#9ca3af',
        grid: 'rgba(255, 255, 255, 0.08)',
        cardBg: '#2f2f2f',
        border: 'rgba(255, 255, 255, 0.08)',
        tooltipBg: '#2f2f2f'
      };
    }
  };

  const colors = getThemeColors();

  // Load initial backend state on mount
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const statusRes = await getLiveMonitorStatus();
        setStatus(statusRes);
        setMonitoring(statusRes.is_monitoring);
        setHistory(statusRes.history || []);

        const alertsRes = await getLiveMonitorAlerts();
        setAlerts(alertsRes);
        prevAlertsCountRef.current = alertsRes.length;
      } catch (err) {
        console.error('Failed to load initial status:', err);
      }
    };
    fetchInitialState();
  }, []);

  // Poll status and alerts every 3 seconds if monitoring is active
  useEffect(() => {
    let intervalId = null;

    const pollData = async () => {
      try {
        const statusRes = await getLiveMonitorStatus();
        setStatus(statusRes);
        setHistory(statusRes.history || []);

        const alertsRes = await getLiveMonitorAlerts();
        setAlerts(alertsRes);
      } catch (err) {
        console.error('Error polling monitoring statistics:', err);
      }
    };

    if (monitoring) {
      // Immediate poll
      pollData();
      intervalId = setInterval(pollData, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [monitoring]);

  // Poll network speed every 2 seconds when component is mounted
  useEffect(() => {
    const pollSpeed = async () => {
      try {
        const speedRes = await getLiveNetworkSpeed();
        setSpeed(speedRes);
      } catch (err) {
        console.error('Error polling network speed:', err);
        setSpeed({ download_mbps: null, upload_mbps: null });
      }
    };

    pollSpeed();
    const intervalId = setInterval(pollSpeed, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Watch alerts list to trigger toast popups on new additions
  useEffect(() => {
    if (alerts.length > prevAlertsCountRef.current) {
      // Find new alerts (usually the last one added)
      const newAlert = alerts[alerts.length - 1];
      if (newAlert) {
        triggerToast(newAlert);
      }
    }
    prevAlertsCountRef.current = alerts.length;
  }, [alerts]);

  const triggerToast = (alert) => {
    const toastId = Date.now();
    const severityLabel = alert.color === 'red' ? '⚠ Critical Threat Detected' :
                          alert.color === 'orange' ? '⚠ High Risk Detected' :
                          alert.color === 'yellow' ? '⚠ Suspicious Activity' : '✔ Normal Traffic';
                          
    const toastItem = {
      id: toastId,
      severity: severityLabel,
      reason: alert.reason,
      color: alert.color,
      score: alert.risk_score
    };

    setToasts(prev => [...prev, toastItem]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 5000);
  };

  const handleStart = async () => {
    try {
      await startLiveMonitoring();
      setMonitoring(true);
    } catch (err) {
      alert('Failed to start live monitoring session.');
    }
  };

  const handleStop = async () => {
    try {
      await stopLiveMonitoring();
      setMonitoring(false);
    } catch (err) {
      alert('Failed to stop live monitoring session.');
    }
  };

  const handleSimulate = async () => {
    try {
      const result = await simulateLiveAnomaly();
      // Instantly trigger dashboard refresh after simulation injection
      setStatus(prev => ({
        ...prev,
        ...result
      }));
      
      const alertsRes = await getLiveMonitorAlerts();
      setAlerts(alertsRes);
    } catch (err) {
      alert('Failed to simulate anomaly event.');
    }
  };

  const handleDownloadReport = async () => {
    if (status.packets_analyzed === 0 && status.anomaly_count === 0) return;
    setLoadingReport(true);
    try {
      const pdfBlob = await downloadLiveSessionReport();
      const blobUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', `netguard_session_report_${Date.now()}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Failed to compile session PDF report.');
    } finally {
      setLoadingReport(false);
    }
  };

  // Maps backend color names to React CSS styles
  const getSeverityStyles = (colorName) => {
    switch (colorName) {
      case 'red':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--threat-high)',
          bannerBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(31, 31, 31, 0.9) 100%)',
          bannerBorder: 'rgba(239, 68, 68, 0.4)',
          glowShadow: '0 0 20px rgba(248, 81, 73, 0.25)'
        };
      case 'orange':
        return {
          bg: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          color: 'var(--threat-warning)',
          bannerBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(31, 31, 31, 0.9) 100%)',
          bannerBorder: 'rgba(249, 115, 22, 0.4)',
          glowShadow: '0 0 20px rgba(210, 153, 34, 0.25)'
        };
      case 'yellow':
        return {
          bg: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          color: '#eab308',
          bannerBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(31, 31, 31, 0.9) 100%)',
          bannerBorder: 'rgba(234, 179, 8, 0.3)',
          glowShadow: '0 0 20px rgba(234, 179, 8, 0.25)'
        };
      case 'green':
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--threat-low)',
          bannerBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(31, 31, 31, 0.9) 100%)',
          bannerBorder: 'rgba(16, 185, 129, 0.25)',
          glowShadow: '0 0 20px rgba(63, 185, 80, 0.2)'
        };
    }
  };

  const statusStyles = getSeverityStyles(status.color);
  
  // Safe Traffic Percentage calculation
  const safeTrafficPct = status.packets_analyzed > 0 
    ? (((status.packets_analyzed - status.anomaly_count) / status.packets_analyzed) * 100).toFixed(1)
    : '100.0';

  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: colors.tooltipBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          fontFamily: 'var(--font-sans)',
        }}>
          <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '4px' }}>
            TIME: {payload[0].payload.time}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            Risk Score: <span className="mono" style={{ color: getRiskColor(payload[0].value) }}>{payload[0].value.toFixed(1)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getRiskColor = (score) => {
    if (score <= 30) return colors.green;
    if (score <= 60) return colors.yellow;
    if (score <= 85) return colors.orange;
    return colors.red;
  };

  // Determine line color dynamically based on current risk
  const lineStrokeColor = getRiskColor(status.risk_score);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
      
      {/* Toast Notification Stack */}
      <div 
        style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none'
        }}
        id="toast-stack-container"
      >
        {toasts.map(toast => {
          const tStyle = getSeverityStyles(toast.color);
          return (
            <div 
              key={toast.id}
              style={{
                background: 'var(--bg-card)',
                borderLeft: `4px solid ${tStyle.color}`,
                borderTop: '1px solid var(--border-color)',
                borderRight: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                width: '320px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                pointerEvents: 'auto',
                animation: 'slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
              }}
              className="toast-card"
            >
              <div style={{ color: tStyle.color, marginTop: '2px' }}>
                <ShieldAlert size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: tStyle.color, marginBottom: '2px' }}>
                  {toast.severity}
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                  {toast.reason}
                </p>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  RISK_SCORE: {toast.score.toFixed(1)}/100
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Actions Header Bar */}
      <div className="flex align-center justify-between" style={{ marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-cyan)' }}>
            SOC TELEMETRY CONTROLS
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Real-Time Threat Monitor
          </h2>
        </div>
        
        {/* Buttons Action Group */}
        <div className="flex align-center gap-10" style={{ flexWrap: 'wrap' }}>
          
          {!monitoring ? (
            <button 
              className="cyber-btn" 
              onClick={handleStart}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              id="btn-start-monitor"
            >
              <Play size={15} /> Start Monitoring
            </button>
          ) : (
            <button 
              className="cyber-btn" 
              onClick={handleStop}
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              id="btn-stop-monitor"
            >
              <Square size={15} /> Stop Monitoring
            </button>
          )}

          <button 
            className="cyber-btn"
            onClick={handleSimulate}
            disabled={!monitoring}
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              opacity: !monitoring ? 0.5 : 1 
            }}
            id="btn-simulate-attack"
            title="Inject an anomalous traffic sample for live demonstration"
          >
            <Skull size={15} /> Simulate Attack
          </button>

          <button 
            className="cyber-btn"
            onClick={handleDownloadReport}
            disabled={loadingReport || (status.packets_analyzed === 0 && status.anomaly_count === 0)}
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)'
            }}
            id="btn-download-report"
            title="Download PDF analysis of the active monitoring session"
          >
            <Download size={15} className={loadingReport ? 'spin' : ''} /> 
            {loadingReport ? 'Generating...' : 'Download Report'}
          </button>
          
        </div>
      </div>

      {/* Main Status Panel */}
      <div 
        className="cyber-card" 
        style={{ 
          marginBottom: '30px', 
          background: statusStyles.bannerBg,
          border: `1px solid ${statusStyles.bannerBorder}`,
          borderLeft: `5px solid ${statusStyles.color}`,
          padding: '30px',
          boxShadow: `var(--card-shadow), ${statusStyles.glowShadow}`,
          transition: 'all 0.5s ease'
        }}
      >
        <div className="flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="flex align-center gap-10" style={{ marginBottom: '8px' }}>
              <span className="pulse-indicator" style={{ backgroundColor: statusStyles.color }}></span>
              <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: statusStyles.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                System State: {status.label}
              </span>
            </div>
            
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {status.label === 'Safe' && 'Your Network is Safe'}
              {status.label === 'Suspicious' && 'Suspicious Activity Detected'}
              {status.label === 'High Risk' && 'High Risk Traffic Detected'}
              {status.label === 'Critical Threat' && 'Critical Threat Detected!'}
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.4' }}>
              {status.reason}
            </p>
          </div>

          {/* Big Score Box */}
          <div style={{ textAlign: 'center', minWidth: '150px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Risk Score</span>
            <div className="mono" style={{ fontSize: '3.25rem', fontWeight: 900, color: statusStyles.color, lineHeight: 1 }}>
              {status.risk_score.toFixed(0)}
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 100</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mini Stats Cards Grid */}
      <div className="cyber-grid" style={{ marginBottom: '30px' }}>
        
        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '12px', borderRadius: '10px', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Packets Analyzed</span>
            <h4 className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              {status.packets_analyzed.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px', borderRadius: '10px', color: 'var(--threat-high)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <Skull size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Anomaly Events</span>
            <h4 className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--threat-high)' }}>
              {status.anomaly_count.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '10px', color: 'var(--threat-low)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <Server size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Safe Traffic Ratio</span>
            <h4 className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--threat-low)' }}>
              {safeTrafficPct}%
            </h4>
          </div>
        </div>

      </div>

      {/* Network Speed Monitor */}
      <div style={{ marginBottom: '30px' }}>
        <div className="flex align-center gap-10" style={{ marginBottom: '15px' }}>
          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-cyan)' }}>
            NETWORK SPEED MONITOR
          </span>
          {monitoring && (
            <span className="pulse-indicator green" style={{ width: '6px', height: '6px', marginLeft: '2px' }}></span>
          )}
        </div>
        
        <div className="cyber-grid">
          <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Download Speed</span>
              <h4 className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
                {speed.download_mbps !== null ? speed.download_mbps : '--'}
                <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px', fontFamily: 'var(--font-sans)' }}>Mbps</span>
              </h4>
            </div>
          </div>

          <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Upload Speed</span>
              <h4 className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
                {speed.upload_mbps !== null ? speed.upload_mbps : '--'}
                <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px', fontFamily: 'var(--font-sans)' }}>Mbps</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginBottom: '30px' }}>
        
        {/* Live Chart Container */}
        <div className="cyber-card">
          <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Activity size={16} /> Live Risk Score Stream
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Continuous threat evaluation trajectory updated in 3-second frames.
              </p>
            </div>
            <span className="mono" style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}>
              {monitoring ? 'STREAMING_ACTIVE' : 'STREAM_PAUSED'}
            </span>
          </div>

          <div style={{ width: '100%', height: 340 }}>
            {history.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Waiting for monitoring telemetry session to start...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="time" stroke={colors.text} fontSize={10} className="mono" />
                  <YAxis domain={[0, 100]} stroke={colors.text} fontSize={10} className="mono" />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="risk_score" 
                    name="Risk Score" 
                    stroke={lineStrokeColor} 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: lineStrokeColor, strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: lineStrokeColor }} 
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Alert Log Log Table */}
        <div className="cyber-card">
          <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Terminal size={16} /> Isolated Session Alert Log
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Summary list of suspicious and anomalous network telemetry logs.
              </p>
            </div>
            <span className="mono" style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}>
              TOTAL_ALERTS: {alerts.length}
            </span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Time</th>
                  <th style={{ width: '20%' }}>Risk Class</th>
                  <th style={{ width: '15%' }}>Risk Score</th>
                  <th style={{ width: '50%' }}>Isolated Threat Rationale</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No anomalies detected yet
                    </td>
                  </tr>
                ) : (
                  [...alerts].reverse().map((alert, idx) => {
                    const rowStyle = getSeverityStyles(alert.color);
                    return (
                      <tr 
                        key={idx}
                        style={{ 
                          background: rowStyle.bg,
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <td className="mono" style={{ color: 'var(--text-secondary)' }}>{alert.time}</td>
                        <td className="mono" style={{ color: rowStyle.color, fontWeight: 700 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AlertIcon size={12} /> {alert.label}
                          </span>
                        </td>
                        <td className="mono" style={{ color: rowStyle.color, fontWeight: 700 }}>
                          {alert.risk_score.toFixed(1)}
                        </td>
                        <td style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{alert.reason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
