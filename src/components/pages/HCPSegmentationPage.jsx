import React, { useState, useRef } from 'react';
import {
  UploadCloud, X, ArrowRight, ArrowLeft, PlayCircle, Check,
  Download, Sparkles, FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const STAGES = [
  { key: 'upload', label: 'Data Upload' },
  { key: 'field-analysis', label: 'Field Analysis' },
  { key: 'seg-select', label: 'Segmentation Selection' },
  { key: 'field-mapping', label: 'Field Mapping' },
  { key: 'guardrails', label: 'Guardrails' },
  { key: 'run-visualize', label: 'Run & Visualize' },
  { key: 'review', label: 'Final Review' },
  { key: 'export', label: 'Export' },
];

const DIM_STYLE = {
  'Value & Potential': { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' },
  'Status & Direction': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  'Behaviour': { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
  'Engagement': { bg: '#f3e8ff', text: '#7c3aed', border: '#e9d5ff' },
};

const SEGMENTATION_TYPES = [
  { id: 'M1', type: 'Measure', dim: 'Value & Potential', tag: 'Rule-Based', field: 'Market Potential Decile',
    desc: 'Rank of how much this HCP writes across the whole category for this product, every brand including competitors. Decile 10 is the top 10% of prescribers by category volume within their specialty.',
    values: 'Decile 1–10',
    inputFields: ['HCP_ID', 'Product_ID', 'Market_ID', 'Total_Rx_Volume', 'Specialty_Group'] },
  { id: 'M2', type: 'Measure', dim: 'Value & Potential', tag: 'Rule-Based', field: 'Brand Performance Decile',
    desc: 'Rank of how much of OUR product this HCP writes. Same method and peer group as M1, different numerator.',
    values: 'Decile 1–10',
    inputFields: ['HCP_ID', 'Product_ID', 'Total_Rx_Volume', 'Specialty_Group'] },
  { id: 'M3', type: 'Measure', dim: 'Value & Potential', tag: 'Rule-Based', field: 'NBRx Share',
    desc: 'Proportion of this HCP\'s prescriptions for our product that are NEW starts rather than refills.',
    values: '0.00 – 1.00',
    inputFields: ['HCP_ID', 'Product_ID', 'New_Rx_Volume', 'Total_Rx_Volume'] },
  { id: 'S1', type: 'Segment', dim: 'Value & Potential', tag: 'Rule-Based', field: 'Prescription Potential Tier',
    desc: 'A single targeting tier derived from the Market Potential and Brand Performance deciles. Answers one question: is this HCP on the call plan? Tier A/B carry the call frequency.',
    values: 'Tier A / B / C',
    inputFields: ['Market Potential Decile (M1)', 'Brand Performance Decile (M2)'] },
  { id: 'M4', type: 'Measure', dim: 'Status & Direction', tag: 'Rule-Based', field: 'Months Since First Rx',
    desc: 'How long this HCP has been writing our product, in months. A Grower who started 8 months ago and one who has written for 8 years are completely different situations.',
    values: 'Integer ≥ 0',
    inputFields: ['HCP_ID', 'Product_ID', 'Total_Rx_Volume', 'Week_Ending_Date'] },
  { id: 'S2', type: 'Segment', dim: 'Status & Direction', tag: 'ML-Based', field: 'Prescriber Lifecycle Stage',
    desc: 'Where this HCP stands with our product and which way they are heading: Non-User, Trialist, Grower, Established Prescriber, Churner, Lapsed, or Insufficient History. Hybrid rule cascade + 3-class model.',
    values: '7 lifecycle states',
    inputFields: ['HCP_ID', 'Product_ID', 'Total_Rx_Volume', 'New_Rx_Volume', 'Week_Ending_Date', 'Specialty_Group'] },
  { id: 'S3', type: 'Segment', dim: 'Behaviour', tag: 'Rule-Based', field: 'Writer Persona',
    desc: 'The dominant prescribing dynamic for this HCP: Switcher, Add-On Writer, Initiator, Maintainer, Switching Away, Not Applicable, or Insufficient Signal.',
    values: '7 personas',
    inputFields: ['HCP_ID', 'Product_ID', 'Switch_To_Product', 'Switch_From_Product', 'New_Therapy_Start', 'Continued_Refill'] },
  { id: 'S4', type: 'Segment', dim: 'Engagement', tag: 'Rule-Based', field: 'Digital Engagement Segment',
    desc: 'How much this HCP engages with us outside a rep visit — website, email, and virtual events — scored 0–100 and banded into a segment.',
    values: 'High / Moderate / Low / No Footprint',
    inputFields: ['HCP_ID', 'Visit_DateTime', 'Time_Spent_Seconds', 'Email_Open_Rate', 'Event_Attendance'] },
];

const DEFAULT_FILES = [
  { name: 'hcp_master_file.csv', size: 4_812_000, rows: 42318 },
  { name: 'sales_rx_data_q2.csv', size: 18_240_000, rows: 128432 },
];

const FIELD_ANALYSIS = [
  { field: 'HCP_ID', filled: 100 },
  { field: 'Product_ID', filled: 100 },
  { field: 'Specialty_Group', filled: 98 },
  { field: 'Total_Rx_Volume', filled: 96 },
  { field: 'New_Rx_Volume', filled: 91 },
  { field: 'Week_Ending_Date', filled: 100 },
  { field: 'Switch_To_Product', filled: 62 },
  { field: 'Switch_From_Product', filled: 58 },
  { field: 'Email_Open_Rate', filled: 34 },
  { field: 'Event_Attendance', filled: 12 },
  { field: 'NPI_Secondary', filled: 3 },
];

function fieldStatus(pct) {
  if (pct >= 90) return { label: 'Filled', bg: '#dcfce7', color: '#166534' };
  if (pct >= 40) return { label: 'Partial', bg: '#fef3c7', color: '#92400e' };
  return { label: 'Mostly Empty', bg: '#fee2e2', color: '#991b1b' };
}

const GUARDRAILS = [
  { id: 'zero-vol', label: 'Exclude HCPs with zero category volume', checked: true },
  { id: 'excl-flag', label: 'Exclude HCPs flagged for compliance/legal exclusion', checked: true },
  { id: 'min-vol', label: 'Minimum category TRx volume threshold', checked: true, hasInput: true, inputDefault: '5' },
  { id: 'specialty', label: 'Restrict to approved specialty groups only', checked: true },
  { id: 'lookback', label: '6-month lookback window (vs. 12-month)', checked: true },
];

const DISTRIBUTIONS = {
  M1: [1,2,3,4,5,6,7,8,9,10].map(d => ({ name: `D${d}`, count: Math.round(6200 - d * 320) })),
  M2: [1,2,3,4,5,6,7,8,9,10].map(d => ({ name: `D${d}`, count: Math.round(5800 - d * 280) })),
  M3: [{ name: '0-.2', count: 9800 }, { name: '.2-.4', count: 12100 }, { name: '.4-.6', count: 10400 }, { name: '.6-.8', count: 6200 }, { name: '.8-1', count: 3818 }],
  S1: [{ name: 'Tier A', count: 4180 }, { name: 'Tier B', count: 11320 }, { name: 'Tier C', count: 26812 }],
  M4: [{ name: '<6mo', count: 5200 }, { name: '6-24mo', count: 14300 }, { name: '2-5yr', count: 15600 }, { name: '5yr+', count: 7218 }],
  S2: [{ name: 'Non-User', count: 8100 }, { name: 'Trialist', count: 5200 }, { name: 'Grower', count: 6300 }, { name: 'Established', count: 15400 }, { name: 'Churner', count: 3100 }, { name: 'Lapsed', count: 4218 }],
  S3: [{ name: 'Switcher', count: 7400 }, { name: 'Add-On', count: 9200 }, { name: 'Initiator', count: 6100 }, { name: 'Maintainer', count: 14800 }, { name: 'Switch-Away', count: 4818 }],
  S4: [{ name: 'High', count: 6200 }, { name: 'Moderate', count: 13400 }, { name: 'Low', count: 15900 }, { name: 'No Footprint', count: 6818 }],
};

const PIE_COLORS = ['#0284c7', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StageCard({ title, subtitle, children }) {
  return (
    <div className="dashboard-card" style={{ marginBottom: 16 }}>
      <div className="dashboard-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <span className="dashboard-card-title">{title}</span>
        {subtitle && <span style={{ fontSize: 12, color: '#64748b' }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000).toFixed(0)} KB`;
}

export default function HCPSegmentationPage() {
  const [activeStage, setActiveStage] = useState('upload');
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [selectedTypes, setSelectedTypes] = useState(['S1']);
  const [detailType, setDetailType] = useState('S1');

  const [autoSelect, setAutoSelect] = useState(true);

  const [guardrails, setGuardrails] = useState(
    Object.fromEntries(GUARDRAILS.map(g => [g.id, g.checked]))
  );

  const [runStatus, setRunStatus] = useState({});

  const stageIndex = STAGES.findIndex(s => s.key === activeStage);
  const detail = SEGMENTATION_TYPES.find(t => t.id === detailType);

  function addFiles(fileList) {
    const incoming = Array.from(fileList).map(f => ({ name: f.name, size: f.size, rows: null }));
    setFiles(prev => [...prev, ...incoming]);
  }

  function removeFile(name) {
    setFiles(prev => prev.filter(f => f.name !== name));
  }

  function toggleType(id) {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setDetailType(id);
  }

  function toggleGuardrail(id) {
    setGuardrails(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function goNext() {
    if (activeStage === 'run-visualize') {
      const next = {};
      selectedTypes.forEach(id => { next[id] = 'complete'; });
      setRunStatus(next);
    }
    if (stageIndex < STAGES.length - 1) setActiveStage(STAGES[stageIndex + 1].key);
  }

  function goBack() {
    if (stageIndex > 0) setActiveStage(STAGES[stageIndex - 1].key);
  }

  function runSegmentation() {
    const next = {};
    selectedTypes.forEach(id => { next[id] = 'complete'; });
    setRunStatus(next);
  }

  function renderStageContent() {
    switch (activeStage) {
      case 'upload':
        return (
          <StageCard title="Data Upload" subtitle="Upload HCP master data, sales/Rx data, and any other reference files.">
            <div
              className={`seg-dropzone${dragOver ? ' drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={28} color="#0284c7" />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 8 }}>
                Drag & drop files here, or click to browse
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>CSV, XLSX, or TXT — any HCP, sales, or reference file</div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {files.map(f => (
                  <div key={f.name} className="seg-file-row">
                    <FileSpreadsheet size={16} color="#0284c7" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{f.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>
                        {formatBytes(f.size)}{f.rows ? ` · ${f.rows.toLocaleString()} rows` : ''}
                      </div>
                    </div>
                    <span className="tier-badge tier-1">Uploaded</span>
                    <button className="seg-file-remove" onClick={() => removeFile(f.name)}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </StageCard>
        );

      case 'field-analysis':
        return (
          <StageCard title="Field Analysis" subtitle="Completeness across all uploaded files — decide which fields are usable for segmentation.">
            <table className="data-table">
              <thead><tr><th>Field</th><th>% Filled</th><th style={{ width: 140 }}>Completeness</th><th>Status</th></tr></thead>
              <tbody>
                {FIELD_ANALYSIS.map(f => {
                  const status = fieldStatus(f.filled);
                  return (
                    <tr key={f.field}>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>{f.field}</td>
                      <td>{f.filled}%</td>
                      <td>
                        <div className="kpi-bar-bg">
                          <div className="kpi-bar-fill" style={{ width: `${f.filled}%`, background: status.color }} />
                        </div>
                      </td>
                      <td><span className="tier-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </StageCard>
        );

      case 'seg-select':
        return (
          <StageCard title="Segmentation Selection" subtitle="Choose one or more segmentations to build from the fields available.">
            <div className="seg-type-grid">
              {SEGMENTATION_TYPES.map(t => {
                const style = DIM_STYLE[t.dim];
                const isChecked = selectedTypes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    className={`seg-type-card${isChecked ? ' selected' : ''}`}
                    style={{ borderColor: isChecked ? style.text : style.border }}
                    onClick={() => toggleType(t.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span className="seg-type-id" style={{ background: style.bg, color: style.text }}>{t.id}</span>
                      <span className={`seg-tag ${t.tag === 'ML-Based' ? 'seg-tag-ml' : 'seg-tag-rule'}`}>{t.tag}</span>
                      {isChecked && <Check size={14} color={style.text} style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{t.field}</div>
                    <div style={{ fontSize: 11, color: style.text, marginTop: 4 }}>{t.dim}</div>
                  </button>
                );
              })}
            </div>

            {detail && (
              <div className="seg-detail-panel">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
                  {detail.id} · {detail.field}
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, marginBottom: 8 }}>{detail.desc}</p>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <strong style={{ color: '#334155' }}>Values:</strong> {detail.values}
                </div>
              </div>
            )}
          </StageCard>
        );

      case 'field-mapping':
        return (
          <StageCard title="Field Mapping">
            <div className="seg-autoselect-row">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Auto-Select Fields</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Apply the predefined logic and required fields for each segmentation automatically.</div>
              </div>
              <label className="seg-switch">
                <input type="checkbox" checked={autoSelect} onChange={() => setAutoSelect(v => !v)} />
                <span className="seg-switch-slider" />
              </label>
            </div>

            {selectedTypes.length === 0 && (
              <p style={{ fontSize: 12.5, color: '#94a3b8' }}>No segmentations selected yet — go back and choose at least one.</p>
            )}

            {selectedTypes.map(id => {
              const t = SEGMENTATION_TYPES.find(x => x.id === id);
              const style = DIM_STYLE[t.dim];
              return (
                <div key={id} className="seg-mapping-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span className="seg-type-id" style={{ background: style.bg, color: style.text }}>{t.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{t.field}</span>
                  </div>
                  {t.inputFields.map(f => (
                    <div key={f} className="seg-mapping-row">
                      <span style={{ flex: 1 }}>{f}</span>
                      <ArrowRight size={13} color="#cbd5e1" />
                      {autoSelect ? (
                        <span className="seg-automapped-chip">{f}</span>
                      ) : (
                        <select className="filter-select" style={{ minWidth: 180 }} defaultValue={f}>
                          {[f, ...FIELD_ANALYSIS.map(x => x.field)].filter((v, i, a) => a.indexOf(v) === i).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </StageCard>
        );

      case 'guardrails':
        return (
          <StageCard title="Guardrails" subtitle="Decide which HCPs are eligible to be segmented at all before the model runs.">
            {GUARDRAILS.map(g => (
              <div key={g.id} className="seg-guardrail-row">
                <input type="checkbox" checked={guardrails[g.id]} onChange={() => toggleGuardrail(g.id)} />
                <span style={{ flex: 1 }}>{g.label}</span>
                {g.hasInput && guardrails[g.id] && (
                  <input className="seg-guardrail-input" type="number" defaultValue={g.inputDefault} />
                )}
              </div>
            ))}
          </StageCard>
        );

      case 'run-visualize':
        return (
          <StageCard title="Run & Visualize">
            {selectedTypes.length === 0 && (
              <p style={{ fontSize: 12.5, color: '#94a3b8' }}>No segmentations selected — go back to Segmentation Selection.</p>
            )}
            {selectedTypes.map(id => {
              const t = SEGMENTATION_TYPES.find(x => x.id === id);
              const data = DISTRIBUTIONS[id] || [];
              const done = runStatus[id] === 'complete';
              return (
                <div key={id} className="seg-run-row">
                  <div className="seg-run-header">
                    <PlayCircle size={16} color={done ? '#22c55e' : '#0284c7'} />
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{t.field}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: done ? '#166534' : '#64748b' }}>
                      {done ? 'Complete' : 'Pending run'}
                    </span>
                  </div>
                  {!done && (
                    <div className="kpi-bar-bg" style={{ margin: '8px 0' }}>
                      <div className="kpi-bar-fill" style={{ width: '35%' }} />
                    </div>
                  )}
                  {done && (
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={data} margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              );
            })}
            {selectedTypes.length > 0 && Object.keys(runStatus).length === 0 && (
              <button className="btn-add-source" style={{ marginTop: 8 }} onClick={runSegmentation}>
                <PlayCircle size={14} style={{ marginRight: 6, verticalAlign: -2 }} />Run Segmentation
              </button>
            )}
          </StageCard>
        );

      case 'review':
        return (
          <StageCard title="Final Review">
            <div className="kpi-cards-row" style={{ marginBottom: 16 }}>
              <div className="kpi-card"><div className="kpi-card-value">42,318</div><div className="kpi-card-label">HCPs Segmented</div></div>
              <div className="kpi-card"><div className="kpi-card-value">{selectedTypes.length}</div><div className="kpi-card-label">Segmentations Applied</div></div>
              <div className="kpi-card"><div className="kpi-card-value">5</div><div className="kpi-card-label">Guardrails Applied</div></div>
            </div>
            <div className="charts-grid">
              {selectedTypes.map(id => {
                const t = SEGMENTATION_TYPES.find(x => x.id === id);
                const data = DISTRIBUTIONS[id] || [];
                return (
                  <div className="dashboard-card" key={id}>
                    <div className="dashboard-card-header">
                      <span className="dashboard-card-title">{t.field}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={data} cx="50%" cy="42%" innerRadius={44} outerRadius={70} paddingAngle={3} dataKey="count">
                          {data.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: '#475569' }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </StageCard>
        );

      case 'export':
        return (
          <StageCard title="Export">
            <p style={{ fontSize: 12.5, color: '#475569', marginBottom: 14 }}>
              Segmented HCP population is ready. Export it or activate it directly into downstream systems.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-export-csv"><Download size={13} style={{ marginRight: 6 }} />Export CSV</button>
              <button className="btn-add-source">Push to CRM</button>
              <button className="btn-add-source" style={{ background: '#6366f1' }}>
                <Sparkles size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Push to NBA Engine
              </button>
            </div>
          </StageCard>
        );

      default:
        return null;
    }
  }

  return (
    <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">HCP Segmentation and Targeting</h1>
          <p className="page-subtitle">Upload data, build a segmentation, and activate it into targeting — end to end.</p>
        </div>

        <div className="seg-progress-label">Step {stageIndex + 1} of {STAGES.length} — {STAGES[stageIndex].label}</div>

        {STAGES.slice(0, stageIndex + 1).map((s, i) => {
          if (i < stageIndex) {
            return (
              <button key={s.key} className="seg-step-collapsed" onClick={() => setActiveStage(s.key)}>
                <span className="seg-step-collapsed-check"><Check size={12} /></span>
                <span style={{ flex: 1 }}>{i + 1}. {s.label}</span>
                <span className="seg-step-collapsed-edit">Edit</span>
              </button>
            );
          }
          return <div key={s.key}>{renderStageContent()}</div>;
        })}

        <div className="seg-wizard-nav">
          <button className="btn-review" onClick={goBack} disabled={stageIndex === 0} style={{ opacity: stageIndex === 0 ? 0.4 : 1 }}>
            <ArrowLeft size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Back
          </button>
          {stageIndex < STAGES.length - 1 && (
            <button className="btn-add-source" onClick={goNext}>
              {activeStage === 'upload' ? 'Proceed' : 'Next'}<ArrowRight size={13} style={{ marginLeft: 6, verticalAlign: -2 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
