import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, 
  Settings, Play, Download, RefreshCw, Sliders, Database, ArrowRight
} from 'lucide-react';
import { suggestMapping, predictBatchStream } from '../services/batchService';

const REQUIRED_COLUMNS = [
  { key: 'packet_size', label: 'Packet Size', desc: 'Normalized packet size, usually 0.0 - 1.0', required: true },
  { key: 'inter_arrival_time', label: 'Inter Arrival Time (s)', desc: 'Time difference between packet arrivals', required: true },
  { key: 'src_port', label: 'Source Port', desc: 'Source port number (0 - 65535)', required: true },
  { key: 'dst_port', label: 'Destination Port', desc: 'Destination port number (0 - 65535)', required: true },
  { key: 'packet_count_5s', label: 'Packet Count (5s)', desc: 'Number of packets in 5 seconds window', required: true },
  { key: 'spectral_entropy', label: 'Spectral Entropy', desc: 'Spectral entropy of traffic', required: true },
  { key: 'frequency_band_energy', label: 'Frequency Band Energy', desc: 'Frequency band energy of traffic', required: true },
  { key: 'protocol', label: 'Protocol (TCP or UDP)', desc: 'Protocol: TCP or UDP', required: true },
  { key: 'tcp_flags', label: 'TCP Flags (FIN / SYN / SYN-ACK)', desc: 'List of active TCP flags', required: false },
  { key: 'src_ip', label: 'Source IP', desc: 'Optional source IP for simulation', required: false },
  { key: 'dst_ip', label: 'Destination IP', desc: 'Optional destination IP for simulation', required: false },
  { key: 'label', label: 'Label / Class Column', desc: 'Optional true label for performance evaluation', required: false }
];

export default function BatchAnalysis({ theme }) {
  // File upload state
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [error, setError] = useState(null);

  // Mapping state
  const [mapping, setMapping] = useState({});
  const [mappingLoading, setMappingLoading] = useState(false);
  const [useLabelForEval, setUseLabelForEval] = useState(false);

  // Run/Streaming states
  const [predicting, setPredicting] = useState(false);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const [rowResults, setRowResults] = useState([]); // full list of prediction results for table
  const [totalRows, setTotalRows] = useState(0);
  const [anomaliesCount, setAnomaliesCount] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Card Stack Animation state
  const [activeCard, setActiveCard] = useState(null);
  const [stackedCards, setStackedCards] = useState([]);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Animation Refs to prevent useEffect cleanup from clearing timer on stream updates
  const queueRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const streamCompletedRef = useRef(false);
  const mountedRef = useRef(true);

  // Ref to automatically scroll the card stack to the bottom
  const stackScrollRef = useRef(null);

  // Keep track of component mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset file upload
  const resetUpload = () => {
    setFile(null);
    setFileData([]);
    setHeaders([]);
    setPreviewRows([]);
    setError(null);
    setMapping({});
    setUseLabelForEval(false);
    setPredicting(false);
    setStreamCompleted(false);
    setRowResults([]);
    setTotalRows(0);
    setAnomaliesCount(0);
    setEvaluationResult(null);
    setActiveCard(null);
    setStackedCards([]);
    setAnimationFinished(false);

    // Reset refs
    queueRef.current = [];
    isAnimatingRef.current = false;
    streamCompletedRef.current = false;
  };

  // Dropzone file handler
  const onDrop = (acceptedFiles) => {
    setError(null);
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    // Check size limit: 10MB max
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit. Please upload a smaller file.');
      return;
    }

    setFile(uploadedFile);

    const fileType = uploadedFile.name.split('.').pop().toLowerCase();
    if (fileType === 'csv') {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            processParsedData(results.data);
          } else {
            setError('The uploaded CSV file is empty.');
          }
        },
        error: (err) => {
          setError(`Error parsing CSV file: ${err.message}`);
        }
      });
    } else if (['xls', 'xlsx'].includes(fileType)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData && jsonData.length > 0) {
            processParsedData(jsonData);
          } else {
            setError('The uploaded Excel sheet is empty.');
          }
        } catch (err) {
          setError(`Error parsing Excel file: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      setError('Unsupported file type. Please upload a CSV or Excel file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const processParsedData = async (data) => {
    setFileData(data);
    
    // Extract headers from first object
    const detectedHeaders = Object.keys(data[0]);
    setHeaders(detectedHeaders);
    setPreviewRows(data.slice(0, 5));

    // Request auto column mapping suggestions
    setMappingLoading(true);
    try {
      const suggestions = await suggestMapping(detectedHeaders);
      setMapping(suggestions);
      
      // If label column is suggested and exists, auto-enable evaluation
      if (suggestions.label) {
        setUseLabelForEval(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback: empty mapping
      setMapping({});
    } finally {
      setMappingLoading(false);
    }
  };

  const handleMappingChange = (modelKey, value) => {
    setMapping(prev => ({
      ...prev,
      [modelKey]: value
    }));
  };

  // Process the queue recursively
  const processNextInQueue = () => {
    if (!mountedRef.current) return;

    if (queueRef.current.length === 0) {
      isAnimatingRef.current = false;
      // If stream is complete, we are finished with all animations
      if (streamCompletedRef.current) {
        setAnimationFinished(true);
        setPredicting(false);
      }
      return;
    }

    isAnimatingRef.current = true;
    const nextCard = queueRef.current.shift();
    setActiveCard(nextCard);

    // Speed setting: first 5 rows are slow (600ms), subsequent ones are fast (25ms)
    const delay = nextCard.row_index <= 5 ? 600 : 25;

    setTimeout(() => {
      if (!mountedRef.current) return;
      setStackedCards(prev => [...prev, nextCard]);
      setActiveCard(null);
      processNextInQueue(); // Recurse to next card
    }, delay);
  };

  // Run batch predictions
  const runPredictions = () => {
    setError(null);
    setPredicting(true);
    setStreamCompleted(false);
    setRowResults([]);
    setStackedCards([]);
    setActiveCard(null);
    setAnimationFinished(false);

    // Reset Refs
    queueRef.current = [];
    isAnimatingRef.current = false;
    streamCompletedRef.current = false;

    // Clean and verify mapping: required fields check
    const finalMapping = { ...mapping };
    // If user unchecked label eval, delete label mapping
    if (!useLabelForEval) {
      delete finalMapping.label;
    }

    predictBatchStream(
      fileData,
      finalMapping,
      // onRowResult
      (row) => {
        // Enqueue row result for card stack animation
        queueRef.current.push(row);
        // Also save in complete list for final table
        setRowResults(prev => [...prev, row]);

        // Start processing if not already animating
        if (!isAnimatingRef.current) {
          processNextInQueue();
        }
      },
      // onComplete
      (completionData) => {
        setStreamCompleted(true);
        streamCompletedRef.current = true;
        setTotalRows(completionData.total);
        setAnomaliesCount(completionData.anomalies);
        if (completionData.evaluation) {
          setEvaluationResult(completionData.evaluation);
        }

        // If animation is done, finish everything
        if (!isAnimatingRef.current && queueRef.current.length === 0) {
          setAnimationFinished(true);
          setPredicting(false);
        }
      },
      // onError
      (err) => {
        setError(err.message || 'An error occurred during prediction.');
        setPredicting(false);
      }
    );
  };

  // Scroll to bottom of card stack as cards build up
  useEffect(() => {
    if (stackScrollRef.current) {
      stackScrollRef.current.scrollTop = stackScrollRef.current.scrollHeight;
    }
  }, [stackedCards, activeCard]);

  // Download CSV helper
  const downloadCSV = () => {
    if (rowResults.length === 0) return;

    // Combine original file data with prediction columns
    const combinedData = fileData.map((row, idx) => {
      const predRow = rowResults.find(r => r.row_index === idx + 1);
      return {
        'Row Number': idx + 1,
        ...row,
        'Prediction': predRow ? predRow.prediction : 'N/A',
        'Confidence': predRow ? `${predRow.confidence}%` : 'N/A'
      };
    });

    const csv = Papa.unparse(combinedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `netguard_predictions_${file.name.split('.')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Batch Dataset Anomaly Detector
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Upload network connection datasets in CSV/Excel format, align columns, and stream results through the ML model.
          </p>
        </div>
        {(file || predicting || animationFinished) && (
          <button className="cyber-btn" onClick={resetUpload} style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            Reset Analysis
          </button>
        )}
      </div>

      {error && (
        <div 
          className="cyber-card" 
          style={{ 
            background: 'rgba(239, 68, 68, 0.08)', 
            borderColor: 'var(--threat-high)', 
            color: 'var(--threat-high)',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            borderRadius: '12px'
          }}
        >
          <div className="flex align-center gap-10">
            <AlertTriangle size={18} />
            <div>
              <strong>Process Fault:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Upload File */}
      {!file && (
        <div className="cyber-card" style={{ padding: '40px' }}>
          <div {...getRootProps()} className="batch-dropzone">
            <input {...getInputProps()} />
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '16px', borderRadius: '50%' }}>
              <Upload size={32} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isDragActive ? 'Drop the file here' : 'Drag & drop your network traffic dataset'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Supports CSV, XLS, or XLSX formats. Maximum file size 10 MB.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Preview & Map Columns */}
      {file && !predicting && !animationFinished && (
        <div className="cyber-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'stretch' }}>
          
          {/* File Preview */}
          <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex align-center gap-10" style={{ marginBottom: '16px' }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>File Preview: {file.name}</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Showing first {previewRows.length} rows of the dataset. Confirm columns look correct before mapping.
            </p>

            <div className="preview-table-container">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Row</th>
                    {headers.slice(0, 6).map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                    {headers.length > 6 && <th>...</th>}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{rIdx + 1}</td>
                      {headers.slice(0, 6).map((h, cIdx) => (
                        <td key={cIdx} style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                          {row[h] !== undefined ? String(row[h]) : ''}
                        </td>
                      ))}
                      {headers.length > 6 && <td style={{ color: 'var(--text-muted)' }}>...</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Dataset Size: {fileData.length} records // {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          {/* Smart Column Mapping */}
          <div className="cyber-card">
            <div className="flex align-center gap-10" style={{ marginBottom: '16px' }}>
              <Settings size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Model Column Alignment</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Auto-suggested matches are pre-selected. Map your dataset fields to the classifier features.
            </p>

            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '6px', marginBottom: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <div>My Model Needs</div>
                <div>Your File Has</div>
              </div>

              {REQUIRED_COLUMNS.map((col) => {
                // If it is label column, we show it conditional on useLabelForEval or always show it
                return (
                  <div key={col.key} className="mapping-grid">
                    <div>
                      <div className="flex align-center gap-10">
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{col.label}</span>
                        {col.required && <span style={{ color: 'var(--threat-high)', fontSize: '0.75rem' }}>*</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{col.desc}</div>
                    </div>
                    <div>
                      <select
                        className="cyber-input cyber-select"
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        value={mapping[col.key] || ''}
                        onChange={(e) => handleMappingChange(col.key, e.target.value)}
                      >
                        <option value="">-- Ignored / Empty --</option>
                        {headers.map((h, i) => (
                          <option key={i} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Label Evaluation Section */}
            {mapping.label && (
              <div 
                style={{ 
                  background: 'rgba(6, 182, 212, 0.04)', 
                  border: '1px dashed rgba(6, 182, 212, 0.2)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: '20px' 
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useLabelForEval}
                    onChange={(e) => setUseLabelForEval(e.target.checked)}
                    style={{ accentColor: 'var(--accent-cyan)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Label column detected
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Use '{mapping.label}' to calculate Model Performance report?
                    </span>
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={runPredictions}
              disabled={mappingLoading || !mapping.packet_size || !mapping.protocol}
              className="cyber-btn"
              style={{ width: '100%' }}
            >
              {mappingLoading ? (
                <>
                  <RefreshCw className="spin" size={16} /> Suggestions loading...
                </>
              ) : (
                <>
                  <Play size={16} /> Confirm Mapping & Run Prediction
                </>
              )}
            </button>
            {(!mapping.packet_size || !mapping.protocol) && (
              <p style={{ color: 'var(--threat-warning)', fontSize: '0.75rem', marginTop: '8px', textAlign: 'center' }}>
                * Packet Size and Protocol fields are required to run prediction.
              </p>
            )}
          </div>

        </div>
      )}

      {/* STEP 3: Streaming Card Stack Animation */}
      {predicting && !animationFinished && (
        <div className="cyber-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCw className="spin" size={16} style={{ color: 'var(--accent-cyan)' }} /> Processing Batch Inference Stream
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              Loaded {rowResults.length} / {fileData.length} records...
            </p>
          </div>

          <div className="animation-stage">
            {/* Scrollable Stack Area */}
            <div className="stack-scroll-area" ref={stackScrollRef}>
              {stackedCards.map((card) => (
                <div 
                  key={card.row_index} 
                  className={`stack-card ${card.prediction === 'Anomaly' ? 'anomaly' : 'normal'}`}
                  style={{ marginBottom: '4px', opacity: 0.85 }}
                >
                  <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    Row #{card.row_index}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {card.prediction === 'Anomaly' ? '🚨 ANOMALY' : '✅ NORMAL'}
                  </span>
                  <span className="mono" style={{ fontSize: '0.85rem' }}>
                    {card.confidence}% Conf.
                  </span>
                </div>
              ))}
            </div>

            {/* Active Center Card Display */}
            <div className="center-card-holder">
              {activeCard ? (
                <div 
                  className={`stack-card ${activeCard.prediction === 'Anomaly' ? 'anomaly' : 'normal'} ${activeCard.row_index <= 5 ? 'card-anim-enter' : 'card-anim-enter-fast'}`}
                  style={{ 
                    transform: 'scale(1.05)', 
                    borderWidth: '2px',
                    borderColor: activeCard.prediction === 'Anomaly' ? 'var(--threat-high)' : 'var(--threat-low)',
                    zIndex: 10
                  }}
                >
                  <div>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                      INSPECTOR ACTIVE
                    </span>
                    <span className="mono" style={{ fontSize: '1rem', fontWeight: 700 }}>
                      Row #{activeCard.row_index}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {activeCard.prediction === 'Anomaly' ? '🚨 ANOMALY' : '✅ NORMAL'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {activeCard.confidence}%
                    </span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence</span>
                  </div>
                </div>
              ) : (
                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Awaiting Telemetry Packet...
                </span>
              )}
            </div>

            {/* Fast/Slow Indicator Bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${(rowResults.length / fileData.length) * 100}%`, 
                  background: 'var(--accent-cyan)',
                  transition: 'width 0.1s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Complete Results Screen */}
      {animationFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Summary Dashboard Header */}
          <div className="cyber-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="cyber-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="cyber-label" style={{ fontSize: '0.75rem' }}>Total Processed</span>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalRows}
              </div>
            </div>

            <div className="cyber-card alert-high" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="cyber-label" style={{ fontSize: '0.75rem' }}>Anomalies Flagged</span>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--threat-high)' }}>
                {anomaliesCount}
              </div>
            </div>

            <div className="cyber-card alert-low" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="cyber-label" style={{ fontSize: '0.75rem' }}>Normal Connection Traffic</span>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--threat-low)' }}>
                {totalRows - anomaliesCount}
              </div>
            </div>

            <div className="cyber-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="cyber-label" style={{ fontSize: '0.75rem' }}>Anomaly Ratio</span>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--threat-warning)' }}>
                {totalRows > 0 ? ((anomaliesCount / totalRows) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          {/* Model Evaluation Metrics Report (Optional Labeled Data) */}
          {evaluationResult && (
            <div className="cyber-card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="flex align-center gap-10" style={{ marginBottom: '16px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--threat-low)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Performance Evaluation Report</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Evaluated predictions against true label column <code style={{ color: 'var(--accent-cyan)' }}>{mapping.label}</code>.
              </p>

              <div className="evaluation-grid">
                <div className="eval-metric-card">
                  <div className="cyber-label" style={{ fontSize: '0.7rem' }}>Accuracy</div>
                  <div className="eval-metric-val">{(evaluationResult.accuracy * 100).toFixed(2)}%</div>
                </div>
                <div className="eval-metric-card">
                  <div className="cyber-label" style={{ fontSize: '0.7rem' }}>Precision</div>
                  <div className="eval-metric-val">{(evaluationResult.precision * 100).toFixed(2)}%</div>
                </div>
                <div className="eval-metric-card">
                  <div className="cyber-label" style={{ fontSize: '0.7rem' }}>Recall</div>
                  <div className="eval-metric-val">{(evaluationResult.recall * 100).toFixed(2)}%</div>
                </div>
                <div className="eval-metric-card">
                  <div className="cyber-label" style={{ fontSize: '0.7rem' }}>F1 Score</div>
                  <div className="eval-metric-val">{(evaluationResult.f1 * 100).toFixed(2)}%</div>
                </div>
              </div>

              {/* Confusion Matrix Display */}
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Confusion Matrix
                </h4>
                <div className="confusion-matrix">
                  <div />
                  <div className="matrix-header">Predicted Normal</div>
                  <div className="matrix-header">Predicted Anomaly</div>

                  <div className="matrix-label">Actual Normal</div>
                  <div className="matrix-cell correct">
                    <span className="matrix-cell-val">{evaluationResult.tn}</span>
                    <span className="matrix-cell-lbl">True Negative</span>
                  </div>
                  <div className="matrix-cell incorrect">
                    <span className="matrix-cell-val">{evaluationResult.fp}</span>
                    <span className="matrix-cell-lbl">False Positive</span>
                  </div>

                  <div className="matrix-label">Actual Anomaly</div>
                  <div className="matrix-cell incorrect">
                    <span className="matrix-cell-val">{evaluationResult.fn}</span>
                    <span className="matrix-cell-lbl">False Negative</span>
                  </div>
                  <div className="matrix-cell correct">
                    <span className="matrix-cell-val">{evaluationResult.tp}</span>
                    <span className="matrix-cell-lbl">True Positive</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Results Table */}
          <div className="cyber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="flex align-center gap-10">
                <Database size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Row Predictions</h3>
              </div>
              <button 
                onClick={downloadCSV}
                className="cyber-btn"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Download size={14} /> Download Results as CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', maxHeight: '500px' }}>
              <table className="cyber-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Row</th>
                    {mapping.packet_size && <th>Packet Size</th>}
                    {mapping.protocol && <th>Protocol</th>}
                    {mapping.src_port && <th>Src Port</th>}
                    {mapping.dst_port && <th>Dst Port</th>}
                    {mapping.label && <th>True Label</th>}
                    <th>Prediction</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {rowResults.map((result, idx) => {
                    const originalRow = fileData[idx] || {};
                    const isAnomaly = result.prediction === 'Anomaly';
                    
                    return (
                      <tr 
                        key={idx}
                        style={{
                          background: isAnomaly 
                            ? 'rgba(239, 68, 68, 0.02)' 
                            : 'rgba(16, 185, 129, 0.02)',
                        }}
                      >
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{result.row_index}</td>
                        {mapping.packet_size && <td>{originalRow[mapping.packet_size]}</td>}
                        {mapping.protocol && <td>{originalRow[mapping.protocol]}</td>}
                        {mapping.src_port && <td>{originalRow[mapping.src_port]}</td>}
                        {mapping.dst_port && <td>{originalRow[mapping.dst_port]}</td>}
                        {mapping.label && (
                          <td style={{ fontFamily: 'var(--font-mono)' }}>
                            {originalRow[mapping.label] !== undefined ? String(originalRow[mapping.label]) : ''}
                          </td>
                        )}
                        <td style={{ fontWeight: 700, color: isAnomaly ? 'var(--threat-high)' : 'var(--threat-low)' }}>
                          {isAnomaly ? '🚨 Anomaly' : '✅ Normal'}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{result.confidence}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
