import React, { useState } from 'react';
import { BookOpen, AlertTriangle, FileText, Shield, Award, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function EnhancedInsightsReport() {
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [expandedNarratives, setExpandedNarratives] = useState({});

  const toggleNarrative = (id) => {
    setExpandedNarratives(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const insightsData = [
    {
      id: 'clinical-trial',
      title: 'Clinical Trial Findings',
      icon: BookOpen,
      confidence: '94%',
      drugs: ['CNB (C025 PGTC study)', 'Carisbamate'],
      bullets: [
        { label: 'Trial Accrual Interest', text: 'Strong clinician interest in future clinical trials, specifically for CNS and oncology indications.' },
        { label: 'Availability Inquiries', text: 'Frequent inquiries regarding the release timeline of the CNB C025 PGTC study results.' },
        { label: 'Safety Apprehensions', text: 'Pediatric neurologists expressed concern over using CNB prior to formal FDA approval.' },
        { label: 'Screening Constraints', text: 'Concerns raised that complex medical histories and rigid exclusion criteria (modeled after Carisbamate trials) are restricting patient recruitment.' }
      ],
      rawText: 'Healthcare professionals discussed their experiences with the CNB clinical trial, specifically the C025 PGTC study. They inquired about the availability of results and expressed interest in future clinical trials, particularly in CNS and oncology indications. A pediatric neurologist expressed concern about the safety of using CNB before approval, while another participant, who had previously taken part in Carisbamate clinical trials, raised concerns about potential difficult inclusion/exclusion criteria limiting enrollment for patients with complex medical histories.'
    },
    {
      id: 'efficacy',
      title: 'Efficacy Profiles',
      icon: Award,
      confidence: '96%',
      drugs: ['Xcopri (Cenobamate)', 'Nav 1.7 Blockers', 'C17 data'],
      bullets: [
        { label: 'Mechanism Discussion', text: 'To be effective against pain nerves (Nav 1.7), there is currently insufficient data detailing Xcopri\'s exact blocking efficacy compared to broad-spectrum ASMs.' },
        { label: 'Cluster Seizures', text: 'Dr. Zhong reported positive efficacy in cluster seizure patients and is collaborating on a publication with Madala.' },
        { label: 'Dosing Adjustments', text: 'Cenobamate efficacy is seen with a low start and gradual titration. Example: Seizure-free at 250mg/day, but FBTCS occurred, prompting a potential dose increase to 400mg/day.' },
        { label: 'Pipeline Evaluation', text: 'Clinicians actively reviewed upcoming C17 safety and efficacy datasets.' }
      ],
      rawText: 'During a discussion about sodium channel blockers for neuropathic pain, it was mentioned that for an ASM to be effective against Nav 1.7, which is involved in pain nerves, there is insufficient data on Xcopri\'s effect. Some broad-spectrum ASMs may have a blocking effect on Nav 1.7, explaining their effect on this condition. Dr. Zhong shared that Xcopri has helped some of his cluster seizure patients and is collaborating on a publication with Madala. Cenobamate, another medication, is effective for some patients, starting at a low dose and increasing gradually. A patient on 250mg/day was seizure-free but experienced FBTCS, considering increasing to 400mg/day, and reviewed C17 safety and efficacy data.'
    },
    {
      id: 'iis-grants',
      title: 'IIS & Grants Portfolio',
      icon: FileText,
      confidence: '93%',
      drugs: ['Cenobamate'],
      bullets: [
        { label: 'Oncology & Epilepsy Focus', text: 'Clinicians expressed strong interest in initiating studies for cenobamate in tumor-related and catamenial epilepsy.' },
        { label: 'Prospective Proposals', text: 'Drs. Voinescu and Rifkin are proposing a prospective study addressing the underrepresentation of IDH-mutant patients in previous trials.' },
        { label: 'Active VA Studies', text: 'Dr. Nuthalapati\'s team is actively conducting a study evaluating cenobamate\'s impact on psychiatric and cognitive adverse events in the VA cohort.' },
        { label: 'Special Populations', text: 'Updates shared on Dr. Laxer\'s study evaluating dialysis patients, plus a new multicenter retrospective study investigating reinitiation after withdrawal.' }
      ],
      rawText: 'Several healthcare professionals expressed interest in conducting studies on the use of cenobamate for various types of epilepsy, including tumor-related and catamenial epilepsy. Dr. Voinescu and Dr. Rifkin discussed potential projects, while Dr. Rifkin also expressed concerns about the representation of IDH-mutant patients in previous studies and suggested a prospective study. Dr. Nuthalapati\'s team is currently conducting an IIS on cenobamate\'s impact on psychiatric and cognitive adverse events in the VA population. Dr. Laxer updated on the progress of a study on cenobamate\'s impact on patients undergoing dialysis, and a multicenter retrospective study on reinitiation of cenobamate after medication withdrawal was submitted for review.'
    },
    {
      id: 'safety',
      title: 'Safety & Tolerability',
      icon: Shield,
      confidence: '98%',
      drugs: ['CNB Safety Risks', 'Clobazam (SJS)', 'Fenfluramine', 'VPA / Anticoagulants'],
      bullets: [
        { label: 'Severe Adverse Events', text: 'HCPs raised safety concerns regarding CNB, noting instances of non-convulsive absence status epilepticus and potential liver failure risks.' },
        { label: 'Safety Awareness', text: 'Non-prescribing pediatricians emphasized that broader awareness of these severe risks is critical before adoption.' },
        { label: 'Drug Interactions', text: 'Inquiries raised regarding CNB use in pregnancy, alongside potential drug interactions with VPA and standard anticoagulants.' },
        { label: 'Historical Benchmarks', text: 'Clinicians contextually compared CNB side effects to historic cases, such as SJS with clobazam and pulmonary hypertension with fenfluramine.' }
      ],
      rawText: 'Healthcare professionals discussed safety concerns regarding CNB, with some expressing experience of adverse effects such as non-convulsive absence status epilepticus and potential liver failure. One pediatrician, who does not use CNB, emphasized the importance of awareness of these potential risks. Another healthcare provider shared past experiences with medication side effects, including SJS with clobazam and pulmonary hypertension with fenfluramine. Discussions also included inquiries about CNB and pregnancy, as well as potential drug interactions with VPA and anticoagulants.'
    },
    {
      id: 'other',
      title: 'Operational & Educational Barriers',
      icon: HelpCircle,
      confidence: '91%',
      drugs: ['Cenobamate Access'],
      bullets: [
        { label: 'HCP Educational Gaps', text: 'Clear gaps identified in clinician understanding of drug-to-drug interactions for cenobamate.' },
        { label: 'Regional Formulary Hurdles', text: 'Access issues and formulary challenges reported in Vermont, Virginia, and regional VA centers, primarily compounded by patient comorbidities.' },
        { label: 'Recruitment Shortages', text: 'The University of Missouri Epilepsy Center faces significant recruitment issues for pediatric specialists, currently relying on locum coverage.' },
        { label: 'Pregnancy & Formulation', text: 'HCPs actively requested clinical support materials regarding oral formulation delivery and safety guidelines during pregnancy.' }
      ],
      rawText: 'Healthcare professionals discussed challenges in patient education about epilepsy and antiseizure medications, specifically regarding cenobamate. The University of Missouri Epilepsy Center faces recruitment issues for pediatric epileptologists and uses a locum doctor. HCPs shared outcomes data of a retrospective study on cenobamate, reporting significant reductions in seizure frequency. Access issues to cenobamate were raised in Vermont and Virginia, and some HCPs were unaware of its potential interactions with other medications. The VA center expressed interest in cenobamate but faces challenges with its formulary and patient comorbidities. The oral formulation and use in pregnancy were also discussed. Overall, there is a need for more education and information on cenobamate for healthcare professionals.'
    }
  ];

  return (
    <div className="enhanced-insights-report-card">
      
      {/* Top Selector Panel */}
      <div className="report-header-toolbar">
        <div className="toolbar-left">
          <h3 className="toolbar-title">Key Medical Insights — Monthly Analysis</h3>
          <div className="month-picker-container">
            <span className="picker-label">Select month:</span>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select-dropdown"
            >
              <option value="October">October 2025</option>
              <option value="September">September 2025</option>
              <option value="August">August 2025</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <span className="reporting-badge">BOARDROOM READY</span>
        </div>
      </div>

      {/* Grid of Intuitive Insight Cards */}
      <div className="enhanced-cards-grid">
        {insightsData.map((section) => {
          const IconComponent = section.icon;
          const isExpanded = !!expandedNarratives[section.id];
          
          return (
            <div 
              key={section.id} 
              className="insight-smart-card"
              style={{ borderLeft: '4px solid var(--primary)' }}
            >
              {/* Card Header */}
              <div className="smart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="card-header-title-box">
                  <div className="smart-card-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                    <IconComponent size={18} />
                  </div>
                  <h4>{section.title}</h4>
                </div>
                <span className="smart-card-confidence-badge" style={{ fontSize: '0.725rem', fontWeight: '600', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '20px' }}>
                  Confidence: {section.confidence}
                </span>
              </div>

              {/* Mentioned Drugs Pills */}
              <div className="card-tags-row">
                <span className="tag-label">KEY ENTITIES:</span>
                {section.drugs.map((drug, index) => (
                  <span key={index} className="drug-pill-badge">{drug}</span>
                ))}
              </div>

              {/* Bulleted Points (Structured Data) */}
              <div className="smart-card-bullets-list">
                {section.bullets.map((bullet, index) => (
                  <div key={index} className="smart-card-bullet-item">
                    <span className="bullet-bullet" style={{ backgroundColor: 'var(--primary)' }}></span>
                    <div className="bullet-content">
                      <span className="bullet-label">{bullet.label}:</span>
                      <span className="bullet-text">{bullet.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Collapsible Original Narrative (Keeps 100% Context) */}
              <div className="smart-card-narrative-box">
                <button 
                  className="narrative-toggle-btn"
                  onClick={() => toggleNarrative(section.id)}
                >
                  <span>{isExpanded ? 'Hide Raw AI Narrative' : 'Show Full AI Narrative'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                {isExpanded && (
                  <div className="raw-narrative-text">
                    {section.rawText}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
