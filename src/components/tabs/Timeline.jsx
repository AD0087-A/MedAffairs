import React, { useState } from 'react';
import { Calendar, Mail, Phone, Users, FileText, CheckCircle, Clock, AlertTriangle, User, Search, Filter, Plus, Send } from 'lucide-react';

export default function Timeline() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [formType, setFormType] = useState('Interaction'); // 'Interaction' or 'Inquiry'
  
  // State for all timeline items
  const [timelineItems, setTimelineItems] = useState([
    {
      id: 'MIR-2026-042',
      category: 'Inquiry',
      type: 'Inquiry',
      title: 'Phase III Melanoma safety data sheets for combination ADC and Anti-PD1',
      date: 'May 04, 2026',
      dateObj: new Date('2026-05-04'),
      status: 'Resolved',
      priority: 'High',
      assignee: 'Dr. Sarah Connor (MedInfo Specialist)',
      description: 'Resolved on May 06, 2026. Detailed toxicological profiles and adverse event frequencies sent via encrypted email portal.',
      owner: 'Dr. Sarah Connor'
    },
    {
      id: 'INT-004',
      category: 'Interaction',
      type: 'Meeting',
      title: 'Advisory Board Panel Discussion',
      date: 'April 24, 2026',
      dateObj: new Date('2026-04-24'),
      status: 'Completed',
      owner: 'Robert Vance (Medical Director)',
      description: 'Discussed safety signals of ADC combinations. Dr. Chen agreed with our trial protocol modifications and offered to co-author the next update.',
      icon: Users,
      color: '#e0e7ff',
      textColor: '#4f46e5'
    },
    {
      id: 'MIR-2026-031',
      category: 'Inquiry',
      type: 'Inquiry',
      title: 'Long-term cardiotoxicity profiles in HER2-low breast cancer cohort',
      date: 'March 22, 2026',
      dateObj: new Date('2026-03-22'),
      status: 'In Review',
      priority: 'Medium',
      assignee: 'David Vance (MedInfo Lead)',
      description: 'In review by medical safety panel. Target resolution date: June 18, 2026.',
      owner: 'David Vance'
    },
    {
      id: 'INT-003',
      category: 'Interaction',
      type: 'Email',
      title: 'RWE Data Sheet Follow-up',
      date: 'March 18, 2026',
      dateObj: new Date('2026-03-18'),
      status: 'Completed',
      owner: 'Elena Rostova (MSL)',
      description: 'Sent the publication link for Phase III Melanoma safety data. Received a brief confirmation of receipt; she noted she will review it before ASCO.',
      icon: Mail,
      color: '#ecfdf5',
      textColor: '#059669'
    },
    {
      id: 'MIR-2026-015',
      category: 'Inquiry',
      type: 'Inquiry',
      title: 'Corticosteroid dosing protocols for grade 2 pneumonitis',
      date: 'January 14, 2026',
      dateObj: new Date('2026-01-14'),
      status: 'Resolved',
      priority: 'High',
      assignee: 'Elena Rostova (MSL)',
      description: 'Resolved on January 16, 2026. Guidelines shared in-person and digital pamphlets sent.',
      owner: 'Elena Rostova'
    },
    {
      id: 'INT-002',
      category: 'Interaction',
      type: 'Call',
      title: 'Adverse Event Reporting Consultation',
      date: 'January 10, 2026',
      dateObj: new Date('2026-01-10'),
      status: 'Completed',
      owner: 'Elena Rostova (MSL)',
      description: 'Addressed concerns regarding Grade 3 Pneumonitis rates in the local study arm. Shared corticosteroid dosing guidelines.',
      icon: Phone,
      color: '#fef3c7',
      textColor: '#d97706'
    },
    {
      id: 'INT-001',
      category: 'Interaction',
      type: 'Meeting',
      title: 'Introductory Site Visit MSL Briefing',
      date: 'November 12, 2025',
      dateObj: new Date('2025-11-12'),
      status: 'Completed',
      owner: 'Elena Rostova (MSL)',
      description: 'Initial introduction to discuss our emerging oncology portfolio. Established interest in clinical trial site participation.',
      icon: Users,
      color: '#e0e7ff',
      textColor: '#4f46e5'
    }
  ]);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Meeting'); // For interaction
  const [newPriority, setNewPriority] = useState('Medium'); // For inquiry
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter items
  const filteredItems = timelineItems.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Type filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Interactions') return item.category === 'Interaction';
    if (activeFilter === 'Inquiries') return item.category === 'Inquiry';
    return item.type === activeFilter;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    let newItem;
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (formType === 'Interaction') {
      const typeIcons = { Meeting: Users, Email: Mail, Call: Phone };
      const typeColors = { 
        Meeting: { bg: '#e0e7ff', text: '#4f46e5' }, 
        Email: { bg: '#ecfdf5', text: '#059669' }, 
        Call: { bg: '#fef3c7', text: '#d97706' } 
      };
      
      newItem = {
        id: `INT-00${timelineItems.length + 1}`,
        category: 'Interaction',
        type: newType,
        title: newTitle,
        date: formattedDate,
        dateObj: new Date(),
        status: 'Completed',
        owner: 'Elena Rostova (MSL)',
        description: newDesc,
        icon: typeIcons[newType] || Users,
        color: typeColors[newType]?.bg || '#f1f5f9',
        textColor: typeColors[newType]?.text || '#475569'
      };
    } else {
      newItem = {
        id: `MIR-2026-0${Math.floor(100 + Math.random() * 900)}`,
        category: 'Inquiry',
        type: 'Inquiry',
        title: newTitle,
        date: formattedDate,
        dateObj: new Date(),
        status: 'Pending',
        priority: newPriority,
        assignee: 'TBD (Medical Information Specialist)',
        description: `Pending medical review. Details: ${newDesc}`,
        owner: 'TBD'
      };
    }

    setTimelineItems([newItem, ...timelineItems]);
    setNewTitle('');
    setNewDesc('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getTimelineMarker = (item) => {
    if (item.category === 'Inquiry') {
      return {
        icon: FileText,
        bg: '#fffbeb',
        color: '#d97706'
      };
    }
    return {
      icon: item.icon || Users,
      bg: item.color || '#f1f5f9',
      color: item.textColor || '#475569'
    };
  };

  const getInquiryStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle size={14} style={{ color: 'var(--success)' }} />;
      case 'In Review': return <Clock size={14} style={{ color: 'var(--warning)' }} />;
      default: return <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      
      {/* Left Column: Timeline list */}
      <div>
        
        {/* Controls: Search and Filter Row */}
        <div className="timeline-toolbar">
          <div className="timeline-search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search conversations, topics, or owners..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="timeline-filters">
            {['All', 'Interactions', 'Inquiries', 'Meeting', 'Email', 'Call'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`filter-badge-btn ${activeFilter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Flow */}
        <div className="timeline-container">
          <div className="timeline-spine"></div>

          {filteredItems.map((item) => {
            const marker = getTimelineMarker(item);
            const MarkerIcon = marker.icon;
            const isInquiry = item.category === 'Inquiry';

            return (
              <div key={item.id} className="timeline-node">
                
                {/* Custom icon positioning along the spine */}
                <div 
                  className="timeline-node-marker"
                  style={{ backgroundColor: marker.bg, color: marker.color }}
                >
                  <MarkerIcon size={16} />
                </div>

                {/* Timeline Card */}
                <div className={`card timeline-node-card ${isInquiry ? 'card-inquiry-border' : ''}`}>
                  <div className="node-card-header">
                    <div>
                      <div className="node-category-row">
                        <span className={`node-badge ${isInquiry ? 'badge-inquiry' : 'badge-interaction'}`}>
                          {item.category === 'Inquiry' ? 'Medical Inquiry' : item.type}
                        </span>
                        <span className="node-id">{item.id}</span>
                      </div>
                      <h3 className="node-card-title">{item.title}</h3>
                    </div>
                    <span className="node-date">{item.date}</span>
                  </div>

                  <div className="node-card-body">
                    {isInquiry ? (
                      <div className="inquiry-response-box">
                        <div className="inquiry-response-header">
                          <span className="response-title">MEDICAL RESPONSE</span>
                          <span className="inquiry-status-indicator">
                            {getInquiryStatusIcon(item.status)}
                            <span style={{ marginLeft: '4px', fontWeight: 600 }}>{item.status}</span>
                          </span>
                        </div>
                        <p className="inquiry-response-text">{item.description}</p>
                      </div>
                    ) : (
                      <p className="node-desc-text">{item.description}</p>
                    )}
                  </div>

                  <div className="node-card-footer">
                    <div className="node-meta-item">
                      <User size={12} />
                      <span>{isInquiry ? `Assignee: ${item.assignee}` : `Owner: ${item.owner}`}</span>
                    </div>
                    {isInquiry && (
                      <div className={`priority-tag priority-${item.priority.toLowerCase()}`}>
                        {item.priority} Priority
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="timeline-empty-state">
              <AlertTriangle size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <p>No timeline records matching filters or search terms.</p>
            </div>
          )}

        </div>

      </div>

      {/* Right Column: Logging form */}
      <div>
        <div className="card log-event-card">
          <div className="log-form-header">
            <h2 className="card-title">Log New Event</h2>
            <div className="log-type-selector">
              <button 
                type="button" 
                onClick={() => setFormType('Interaction')}
                className={`selector-btn ${formType === 'Interaction' ? 'active' : ''}`}
              >
                Interaction
              </button>
              <button 
                type="button" 
                onClick={() => setFormType('Inquiry')}
                className={`selector-btn ${formType === 'Inquiry' ? 'active' : ''}`}
              >
                Inquiry (MIR)
              </button>
            </div>
          </div>

          <form onSubmit={handleCreate} className="log-form">
            <div>
              <label className="form-label">
                {formType === 'Interaction' ? 'Interaction Title' : 'Inquiry Subject / Question'}
              </label>
              <input 
                type="text"
                placeholder={formType === 'Interaction' ? 'e.g. Safety Sheet Discussion' : 'e.g. Dosing guidance for ILD recurrence'}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {formType === 'Interaction' ? (
              <div>
                <label className="form-label">Interaction Type</label>
                <div className="type-btn-group">
                  {['Meeting', 'Email', 'Call'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`type-btn ${newType === t ? 'active' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="form-label">Priority Level</label>
                <div className="type-btn-group">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`type-btn ${newPriority === p ? 'active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="form-label">
                {formType === 'Interaction' ? 'Discussion Summary' : 'Inquiry / Question Details'}
              </label>
              <textarea
                rows="5"
                placeholder={formType === 'Interaction' ? 'Provide details on what was discussed, insights learned and follow-ups...' : 'Detail the medical information requested by the doctor...'}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
                className="form-textarea"
              />
            </div>

            <button type="submit" className="btn-primary form-submit-btn">
              {formType === 'Interaction' ? <Plus size={16} /> : <Send size={14} />}
              <span>{formType === 'Interaction' ? 'Log Interaction' : 'Submit Inquiry'}</span>
            </button>
          </form>

          {showSuccess && (
            <div className="form-success-banner">
              <CheckCircle size={16} />
              <span>{formType === 'Interaction' ? 'Field Interaction logged!' : 'Medical Inquiry submitted!'}</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
