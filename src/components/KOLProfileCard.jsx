import React from 'react';
import { 
  MapPin, 
  Building, 
  Mail, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Clock,
  ExternalLink,
  Globe
} from 'lucide-react';

export default function KOLProfileCard() {
  return (
    <aside className="left-pane kol-profile-pane" aria-label="KOL Profile Card">
      {/* 1. Core Identity - Horizontal Header */}
      <div className="profile-card-header-horizontal">
        <div className="avatar-wrapper-compact">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Dr. Sarah Chen" 
            className="avatar-img-compact"
          />
        </div>
        <div className="profile-header-details">
          <div className="profile-name-row">
            <h1 className="profile-name-compact">Dr. Sarah Chen</h1>
            <span className="profile-suffix">MD, PhD</span>
          </div>
          <p className="profile-title-compact">Senior Oncologist · Dept. of Medicine</p>
          <div className="profile-institution-row">
            <Building size={11} className="meta-icon-compact" />
            <span className="meta-text-compact" title="Memorial Sloan Kettering (Tier 1 Academic KOL)">
              MSK (Tier 1 Academic KOL)
            </span>
          </div>
          <div className="profile-meta-row">
            <div className="meta-item-compact">
              <MapPin size={11} className="meta-icon-compact" />
              <span className="meta-text-compact">New York, NY</span>
            </div>
            <span className="meta-separator">•</span>
            <div className="meta-item-compact">
              <Mail size={11} className="meta-icon-compact text-success" />
              <span className="meta-text-compact text-success" title="Prefers Email (Veeva CRM Verified)">
                Email Pref. (Veeva)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Trigger Alert Banner (Very Compact & Actionable) */}
      <div className="trigger-alert-banner">
        <div className="banner-title-row">
          <div className="banner-title">
            <Sparkles size={11} className="text-warning-icon" />
            <span>AI TRIGGER ALERT</span>
          </div>
          <span className="alert-time-compact">2h ago</span>
        </div>
        <div className="banner-content-compact">
          First author on NEJM Phase III Immunotherapy study.
        </div>
        <div className="banner-actions-row">
          <a 
            href="https://www.nejm.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="banner-action-link"
          >
            <span>View NEJM Study</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* 3. Status Tags */}
      <div className="tags-row-compact">
        <span className="badge-compact badge-blue">Melanoma</span>
        <span className="badge-compact badge-purple">Immunotherapy</span>
        <span className="badge-compact badge-teal">Clinical Trials</span>
      </div>

      <div className="sidebar-grid-content">
        {/* 4. 2x2 Data Grid with Richer Metrics */}
        <div className="profile-metrics-grid">
          
          {/* Tile 1: Scientific Output */}
          <div className="metric-tile">
            <div className="tile-header">
              <span className="tile-title">Scientific Output</span>
            </div>
            <div className="tile-body">
              <div className="metric-sub-row">
                <span className="metric-num">42</span>
                <span className="metric-label">Pubs (3y)</span>
              </div>
              <div className="metric-sub-row mt-xs">
                <span className="metric-num">18.4</span>
                <span className="metric-label">Avg IF</span>
              </div>
              <div className="tile-footer-metrics">
                <span>H-Index: 58</span>
                <span className="dot-sep">•</span>
                <span>4.2k Citations</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Digital Influence */}
          <div className="metric-tile">
            <div className="tile-header">
              <span className="tile-title">Digital Influence</span>
            </div>
            <div className="tile-body flex-center-y">
              <div className="score-badge-compact">92</div>
              <div className="tile-subtext">
                <strong className="text-primary-dark">Top 5% DOL</strong>
                <span className="subtext-muted">12.4k reach on X & Medscape</span>
              </div>
            </div>
            <div className="tile-footer-metrics mt-auto">
              <Globe size={9} />
              <span>X (Twitter) · Medscape contributor</span>
            </div>
          </div>

          {/* Tile 3: AI Stance & Sentiment */}
          <div className="metric-tile">
            <div className="tile-header">
              <span className="tile-title">AI Stance & Sentiment</span>
            </div>
            <div className="tile-body">
              <div className="stance-row-compact">
                <span className="stance-lbl-compact">Drug X</span>
                <div className="stance-wrapper-right">
                  <span className="stance-badge-compact pos">
                    <ThumbsUp size={8} /> Positive
                  </span>
                  <span className="stance-conf-text">94%</span>
                </div>
              </div>
              <div className="stance-row-compact mt-xs">
                <span className="stance-lbl-compact">Comp. Y</span>
                <div className="stance-wrapper-right">
                  <span className="stance-badge-compact skep">
                    <ThumbsDown size={8} /> Skeptic
                  </span>
                  <span className="stance-conf-text">81%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 4: Clinical Trial Activity */}
          <div className="metric-tile">
            <div className="tile-header">
              <span className="tile-title">Clinical Trials</span>
            </div>
            <div className="tile-body">
              <div className="trial-compact">
                <div className="trial-role-link">
                  <strong>PI:</strong> 
                  <a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer" className="trial-link-href">
                    NCT05432109 <ExternalLink size={8} />
                  </a>
                </div>
                <span className="trial-desc">Phase III Melanoma (Recruiting)</span>
              </div>
              <div className="trial-compact mt-xs">
                <div className="trial-role-link">
                  <strong>Co-PI:</strong> 
                  <a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer" className="trial-link-href">
                    NCT06543210 <ExternalLink size={8} />
                  </a>
                </div>
                <span className="trial-desc">Phase II Combo (Active)</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Network & Engagement Footer Section */}
        <div className="network-engagement-section">
          
          {/* Peer Network (Visual co-authors & intro routes) */}
          <div className="network-compact">
            <span className="sub-section-title">Peer Network & Warm Intro Routes</span>
            <div className="peers-list-detailed">
              <div className="peer-item-detailed" title="Dr. Tanaka - MSK Co-author">
                <div className="peer-avatar-circle">T</div>
                <div className="peer-details-compact">
                  <div className="peer-name-row">
                    <span className="peer-name-bold">Dr. Tanaka</span>
                    <span className="peer-rel-badge">Co-author</span>
                  </div>
                  <span className="peer-route-text">Warm Intro Route via Dr. Kapoor (12 papers)</span>
                </div>
              </div>
              <div className="peer-item-detailed" title="Dr. Williams - Shared Institution">
                <div className="peer-avatar-circle">W</div>
                <div className="peer-details-compact">
                  <div className="peer-name-row">
                    <span className="peer-name-bold">Dr. Williams</span>
                    <span className="peer-rel-badge">MSK Colleague</span>
                  </div>
                  <span className="peer-route-text">Direct Route (4 co-authored papers)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Timeline (Chronological timeline of touchpoints) */}
          <div className="engagement-timeline-detailed">
            <span className="sub-section-title">Engagement Timeline</span>
            <div className="timeline-list-compact">
              
              <div className="timeline-node-item">
                <div className="timeline-bar-vertical"></div>
                <div className="timeline-dot active"></div>
                <div className="timeline-node-content">
                  <div className="timeline-node-header">
                    <span className="timeline-node-type">Veeva CRM Email</span>
                    <span className="timeline-node-date">Oct 10, 2026</span>
                  </div>
                  <p className="timeline-node-text">Sent Phase II slide deck. Opened 2 times.</p>
                </div>
              </div>

              <div className="timeline-node-item">
                <div className="timeline-bar-vertical"></div>
                <div className="timeline-dot"></div>
                <div className="timeline-node-content">
                  <div className="timeline-node-header">
                    <span className="timeline-node-type">MSL 1-on-1 Visit</span>
                    <span className="timeline-node-date">Sep 24, 2026</span>
                  </div>
                  <p className="timeline-node-text">Discussed Enhertu safety profile and pneumonitis grading.</p>
                </div>
              </div>

              <div className="timeline-node-item">
                <div className="timeline-dot"></div>
                <div className="timeline-node-content">
                  <div className="timeline-node-header">
                    <span className="timeline-node-type">Melanoma Advisory Board</span>
                    <span className="timeline-node-date">Aug 15, 2026</span>
                  </div>
                  <p className="timeline-node-text">Roundtable panelist on standardizing steroid guidelines.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}


