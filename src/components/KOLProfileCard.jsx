import React from 'react';
import { 
  MapPin, 
  Building, 
  GraduationCap, 
  Mail, 
  Phone, 
  Bookmark, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Award,
  Share2
} from 'lucide-react';

export default function KOLProfileCard() {
  return (
    <aside className="left-pane" aria-label="KOL Profile Card">
      {/* Profile Header */}
      <div className="profile-card-header">
        <div className="avatar-container">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Dr. Sarah Chen" 
            className="avatar-img"
          />
        </div>
        <h1 className="profile-name">Dr. Sarah Chen</h1>
        <h3 className="profile-title">Senior Oncologist</h3>
        
        <div className="profile-meta-info">
          <div className="meta-item">
            <Building size={14} />
            <span>Memorial Sloan Kettering Cancer Center</span>
          </div>
          <div className="meta-item">
            <MapPin size={14} />
            <span>New York, NY</span>
          </div>
          <div className="meta-item">
            <GraduationCap size={14} />
            <span>MD, PhD</span>
          </div>
        </div>

        {/* 3 Status Tags (Pills) */}
        <div className="tags-row">
          <span className="badge badge-blue">Melanoma</span>
          <span className="badge badge-purple">Immunotherapy</span>
          <span className="badge badge-teal">Clinical Trials</span>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="profile-actions">
        <button className="btn-primary" aria-label="Shortlist Dr. Sarah Chen">
          <Bookmark size={16} fill="currentColor" />
          <span>Shortlisted</span>
        </button>
        <button className="btn-icon-only" aria-label="Message">
          <MessageSquare size={16} />
        </button>
        <button className="btn-icon-only" aria-label="Phone">
          <Phone size={16} />
        </button>
        <button className="btn-icon-only" aria-label="Email">
          <Mail size={16} />
        </button>
        <button className="btn-icon-only" aria-label="Share">
          <Share2 size={16} />
        </button>
      </div>

      {/* 2nd Level Connection Section */}
      <div className="sidebar-section">
        <h4 className="section-title">Relationship Path</h4>
        <div className="connection-box">
          <p style={{ fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
            2nd Level Connection
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Co-authored a paper with Dr. Tanaka. Not been contacted by your Org.
          </p>
        </div>
      </div>

      {/* Top Insights Section */}
      <div className="sidebar-section">
        <h4 className="section-title">
          <Sparkles size={14} style={{ color: 'var(--warning)' }} />
          <span>Top Insights</span>
        </h4>
        
        <div className="insight-item">
          <TrendingUp size={16} className="insight-icon" style={{ color: 'var(--success)' }} />
          <div className="insight-text">
            <strong>Rising Star:</strong> Most no. of followers on X in New York in last 3 months.
          </div>
        </div>

        <div className="insight-item">
          <Award size={16} className="insight-icon" style={{ color: 'var(--warning)' }} />
          <div className="insight-text">
            <strong>Most publications:</strong> In cardiology and immunotherapy in '25.
          </div>
        </div>

        <div className="insight-item">
          <TrendingUp size={16} className="insight-icon" style={{ color: 'var(--danger)' }} />
          <div className="insight-text">
            <strong>Low Trial participation:</strong> in 2025.
          </div>
        </div>
      </div>

      {/* Quick Metrics at bottom */}
      <div className="sidebar-section">
        <h4 className="section-title">Summary Metrics</h4>
        <div className="quick-stats-row">
          <div className="quick-stat">
            <div className="quick-stat-val">234</div>
            <div className="quick-stat-lbl">Publications</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-val">45</div>
            <div className="quick-stat-lbl">Active Trials</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-val">12</div>
            <div className="quick-stat-lbl">Advisory Boards</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
