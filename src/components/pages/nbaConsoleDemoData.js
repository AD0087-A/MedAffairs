// Demo dataset ported verbatim from the "Rep Decision Console" reference
// file the user supplied — same 12 HCPs, same fields, same numbers. This is
// NOT real nba_v1_izo output. See the note at the bottom of NBAConsolePage.jsx
// for exactly which fields here have no real equivalent anywhere in the
// actual engine (consent, DNA scores, channel/theme affinity, confidence %,
// named model, scheduling windows, organisation, call-log narrative,
// engagement journey, multi-step sequence) versus which ones do (name,
// specialty, territory, priority, score, triggers, segment, last F2F).

export const CONTENT = {
  ce3: { title: 'Comparative Efficacy Detail Aid v3', mlr: 'Approved', channels: ['F2F', 'Virtual'] },
  rwe2: { title: 'Real-World Evidence Summary v2', mlr: 'Approved', channels: ['Email', 'F2F', 'Virtual'] },
  dose5: { title: 'Dosing & Titration Guide v5', mlr: 'Approved', channels: ['F2F', 'Phone', 'Email'] },
  psp: { title: 'Patient Support Program Overview', mlr: 'Approved', channels: ['F2F', 'Virtual'] },
  onb: { title: 'Onboarding Brochure v1', mlr: 'Expired', channels: ['F2F'] },
};

export const SIGNAL_LABEL = {
  competitor_rx: 'Competitor Rx growth', brand_rx: 'Brand Rx trend', content: 'Content engagement',
  gap: 'Engagement gap', potential: 'HCP potential', formulary: 'Formulary change',
  webinar: 'Webinar attendance', starts: 'New patient starts', access: 'Access barrier',
};

function S(k, disp, sev, w) { return { k, disp, sev, w }; }

export const HCPS = [
  {
    id: 'h1', name: 'Dr. Anjali Mehta', spec: 'Internal Medicine', org: 'Northgate Medical Group',
    terr: 'North Metro', tier: 1, seg: 'Segment 1', consent: 'Granted', prefs: ['F2F', 'Email', 'Virtual'],
    state: 'Re-engage', stateNote: 'High opportunity', score: 92, priority: 'Urgent', lastF2F: 38,
    dna: { 'Commercial opportunity': 91, 'Engagement propensity': 76, 'Digital affinity': 68, 'F2F affinity': 82, 'Content affinity': 89, 'Competitive risk': 84, 'Relationship strength': 72 },
    signals: [S('competitor_rx', '+18%', 'crit', .34), S('brand_rx', '−9%', 'crit', .27),
      S('content', 'High', 'warn', .21), S('gap', '38 days', 'warn', .11), S('potential', 'Top decile', 'pos', .07)],
    rec: {
      type: 'Action', action: 'F2F visit', objective: 'Address comparative efficacy',
      channel: 'F2F', content: 'ce3', window: 'Tue–Wed, 10:00–12:00', confidence: 89,
      model: 'Engagement + Commercial Propensity v4.2', refreshed: 'Today, 08:15', evaluated: 7,
      discuss: ['Lead with head-to-head efficacy evidence', 'Acknowledge the competitor data she has seen', 'Avoid repeating introductory product information'],
    },
    ctx: { lastCall: 'Asked for head-to-head efficacy data — said current evidence felt thin.', commitment: 'Send the real-world evidence summary.', note: 'Prefers clinical discussion over promotional messaging.' },
    next: [{ when: 'Now', t: 'F2F visit', d: 'Comparative efficacy' }, { when: '+3 days', t: 'Send RWE summary', d: 'Email · approved content' }, { when: '+10 days', t: 'Follow-up call', d: 'Confirm switch consideration' }],
  },
  {
    id: 'h2', name: 'Dr. Rohan Shah', spec: 'Hospital Medicine', org: 'Riverside Hospital',
    terr: 'Central', tier: 1, seg: 'Segment 1', consent: 'Granted', prefs: ['Email', 'Virtual', 'F2F'],
    state: 'Grow', stateNote: 'Actively engaging', score: 86, priority: 'Urgent', lastF2F: 21,
    dna: { 'Commercial opportunity': 78, 'Engagement propensity': 88, 'Digital affinity': 91, 'F2F affinity': 54, 'Content affinity': 83, 'Competitive risk': 46, 'Relationship strength': 69 },
    signals: [S('content', 'Viewed 2×', 'warn', .31), S('starts', '+12', 'pos', .26), S('potential', 'High', 'pos', .22), S('gap', '21 days', 'warn', .21)],
    rec: {
      type: 'Action', action: 'Approved email', objective: 'Reinforce real-world outcomes',
      channel: 'Email', content: 'rwe2', window: 'Thu, 09:00–11:00', confidence: 84,
      model: 'Engagement + Commercial Propensity v4.2', refreshed: 'Today, 08:15', evaluated: 6,
      discuss: ['Open on the outcomes data he already opened twice', 'Offer the virtual deep-dive rather than a visit', 'Keep it short — he reads on mobile'],
    },
    ctx: { lastCall: 'Virtual call — asked whether the outcomes data held in older patients.', commitment: 'Share the subgroup breakdown.', note: 'Responds to email within a day. Rarely takes F2F.' },
    next: [{ when: 'Now', t: 'Approved email', d: 'Real-world evidence summary' }, { when: '+5 days', t: 'Virtual meeting', d: 'Subgroup deep-dive' }, { when: '+14 days', t: 'Check adoption', d: 'Review new starts' }],
  },
  {
    id: 'h3', name: 'Dr. Priya Patel', spec: 'Family Practice', org: 'Elmwood Clinic',
    terr: 'North Metro', tier: 2, seg: 'Segment 2', consent: 'Granted', prefs: ['Phone', 'F2F'],
    state: 'Defend', stateNote: 'Switching risk', score: 81, priority: 'Urgent', lastF2F: 46,
    dna: { 'Commercial opportunity': 66, 'Engagement propensity': 58, 'Digital affinity': 41, 'F2F affinity': 74, 'Content affinity': 52, 'Competitive risk': 88, 'Relationship strength': 61 },
    signals: [S('competitor_rx', '+11%', 'crit', .38), S('brand_rx', '−4%', 'crit', .24), S('gap', '46 days', 'warn', .23), S('potential', 'Mid', 'pos', .15)],
    rec: {
      type: 'Action', action: 'Phone call', objective: 'Understand switch drivers',
      channel: 'Phone', content: 'dose5', window: 'Mon–Tue, 14:00–16:00', confidence: 77,
      model: 'Engagement + Commercial Propensity v4.2', refreshed: 'Today, 08:15', evaluated: 5,
      discuss: ['Ask directly what changed — do not lead with product', 'Titration complexity is the most likely driver', 'Have the dosing guide ready if she raises it'],
    },
    ctx: { lastCall: 'Mentioned the titration schedule was hard to explain to patients.', commitment: 'None outstanding.', note: 'Short on time. Call before 9am or after 4pm.' },
    next: [{ when: 'Now', t: 'Phone call', d: 'Diagnose switch drivers' }, { when: '+7 days', t: 'F2F visit', d: 'Dosing & titration' }, { when: '+21 days', t: 'Review Rx trend', d: 'Confirm stabilisation' }],
  },
  {
    id: 'h4', name: 'Dr. Arjun Rao', spec: 'Outpatient Specialty', org: 'Kestrel Health Centre',
    terr: 'East Region', tier: 2, seg: 'Segment 2', consent: 'Denied', prefs: ['F2F'],
    state: 'Activate', stateNote: 'Warm but unengaged', score: 77, priority: 'Normal', lastF2F: 62,
    dna: { 'Commercial opportunity': 72, 'Engagement propensity': 49, 'Digital affinity': 33, 'F2F affinity': 70, 'Content affinity': 44, 'Competitive risk': 39, 'Relationship strength': 48 },
    signals: [S('webinar', 'Attended', 'pos', .34), S('potential', 'High', 'pos', .29), S('gap', '62 days', 'crit', .22), S('content', 'Low', 'warn', .15)],
    rec: {
      type: 'Action', action: 'F2F visit', objective: 'Introduce patient support program',
      channel: 'F2F', content: 'psp', window: 'Wed–Fri, 11:00–13:00', confidence: 71,
      model: 'Engagement + Commercial Propensity v4.2', refreshed: 'Today, 08:15', evaluated: 5,
      discuss: ['He attended the webinar but has not engaged since', 'Patient support is the likeliest hook', 'No email — consent has not been granted'],
    },
    ctx: { lastCall: 'No call logged in this cycle.', commitment: 'None outstanding.', note: 'Reception will book if you call the clinic directly.' },
    next: [{ when: 'Now', t: 'F2F visit', d: 'Patient support program' }, { when: '+14 days', t: 'Request consent', d: 'Enable digital channels' }, { when: '+30 days', t: 'Follow-up visit', d: 'Review uptake' }],
  },
  {
    id: 'h5', name: 'Dr. Meera Krishnan', spec: 'Internal Medicine', org: 'Northgate Medical Group',
    terr: 'North Metro', tier: 1, seg: 'Segment 1', consent: 'Granted', prefs: ['F2F', 'Email'],
    state: 'KOL / Influence', stateNote: 'Awareness only', score: 74, priority: 'Normal', lastF2F: 12,
    dna: { 'Commercial opportunity': 58, 'Engagement propensity': 81, 'Digital affinity': 72, 'F2F affinity': 77, 'Content affinity': 94, 'Competitive risk': 28, 'Relationship strength': 86 },
    signals: [S('potential', 'Influencer', 'pos', .44), S('content', 'High', 'pos', .33), S('gap', '12 days', 'pos', .23)],
    rec: {
      type: 'Insight', action: 'No action recommended', objective: 'Awareness only',
      channel: '—', content: null, window: '—', confidence: null,
      model: 'Affiliation & Influence v2.1', refreshed: 'Today, 06:40', evaluated: 3,
      insight: 'Named as a co-investigator on a new multi-centre study. Two of your Tier 1 prescribers cite her as an influence. No engagement action is recommended this cycle — this is context for your other conversations.',
      discuss: [],
    },
    ctx: { lastCall: 'Discussed the upcoming congress session.', commitment: 'None outstanding.', note: 'Strongly prefers scientific exchange. Route product questions to medical.' },
    next: [],
  },
  {
    id: 'h6', name: 'Dr. Daniel Osei', spec: 'Community Practice', org: 'Fairview Practice', terr: 'West',
    tier: 3, seg: 'Segment 3', consent: 'Unknown', prefs: ['F2F'], state: 'Monitor', stateNote: 'Stable',
    score: 61, priority: 'Normal', lastF2F: 29,
    dna: { 'Commercial opportunity': 44, 'Engagement propensity': 52, 'Digital affinity': 38, 'F2F affinity': 61, 'Content affinity': 40, 'Competitive risk': 33, 'Relationship strength': 55 },
    signals: [S('gap', '29 days', 'warn', .41), S('potential', 'Mid', 'pos', .34), S('brand_rx', 'Flat', 'pos', .25)],
    rec: {
      type: 'Action', action: 'Follow-up call', objective: 'Maintain routine coverage', channel: 'Phone',
      content: 'dose5', window: 'Any afternoon', confidence: 63, model: 'Coverage Optimiser v1.8',
      refreshed: 'Today, 08:15', evaluated: 3, discuss: ['Routine coverage call — no specific trigger'],
    },
    ctx: { lastCall: 'Routine check-in, nothing outstanding.', commitment: 'None outstanding.', note: '' }, next: [],
  },
  {
    id: 'h7', name: 'Dr. Laura Bianchi', spec: 'Hospital Medicine', org: 'Riverside Hospital', terr: 'Central',
    tier: 2, seg: 'Segment 2', consent: 'Granted', prefs: ['Email', 'Virtual'], state: 'Maintain', stateNote: 'Steady',
    score: 58, priority: 'Normal', lastF2F: 34,
    dna: { 'Commercial opportunity': 51, 'Engagement propensity': 64, 'Digital affinity': 77, 'F2F affinity': 45, 'Content affinity': 68, 'Competitive risk': 31, 'Relationship strength': 62 },
    signals: [S('content', 'Medium', 'warn', .39), S('gap', '34 days', 'warn', .33), S('potential', 'Mid', 'pos', .28)],
    rec: {
      type: 'Action', action: 'Approved email', objective: 'Share updated dosing guidance', channel: 'Email',
      content: 'dose5', window: 'Any weekday morning', confidence: 66, model: 'Coverage Optimiser v1.8',
      refreshed: 'Today, 08:15', evaluated: 4, discuss: ['Low-effort touch — email is her stated preference'],
    },
    ctx: { lastCall: 'Asked to be contacted by email only.', commitment: 'None outstanding.', note: '' }, next: [],
  },
  {
    id: 'h8', name: 'Dr. Sofia Marquez', spec: 'Family Practice', org: 'Bellhaven Clinic', terr: 'East Region',
    tier: 2, seg: 'Segment 2', consent: 'Granted', prefs: ['F2F', 'Phone'], state: 'Acquire', stateNote: 'Never prescribed',
    score: 55, priority: 'Normal', lastF2F: 71,
    dna: { 'Commercial opportunity': 69, 'Engagement propensity': 37, 'Digital affinity': 29, 'F2F affinity': 58, 'Content affinity': 33, 'Competitive risk': 22, 'Relationship strength': 31 },
    signals: [S('gap', '71 days', 'crit', .43), S('potential', 'High', 'pos', .36), S('content', 'None', 'warn', .21)],
    rec: {
      type: 'Action', action: 'F2F visit', objective: 'First product conversation', channel: 'F2F',
      content: 'ce3', window: 'Any morning', confidence: 59, model: 'Acquisition Propensity v1.3',
      refreshed: 'Today, 07:50', evaluated: 3, discuss: ['No prior product conversation on record', 'Start with clinical need, not the brand'],
    },
    ctx: { lastCall: 'No call logged in this cycle.', commitment: 'None outstanding.', note: '' }, next: [],
  },
  {
    id: 'h9', name: 'Dr. Tom Whitfield', spec: 'Outpatient Specialty', org: 'Kestrel Health Centre', terr: 'East Region',
    tier: 3, seg: 'Segment 3', consent: 'Granted', prefs: ['F2F', 'Email'], state: 'Access', stateNote: 'Formulary barrier',
    score: 52, priority: 'Normal', lastF2F: 41,
    dna: { 'Commercial opportunity': 47, 'Engagement propensity': 55, 'Digital affinity': 50, 'F2F affinity': 63, 'Content affinity': 48, 'Competitive risk': 41, 'Relationship strength': 44 },
    signals: [S('formulary', 'Restricted', 'crit', .47), S('gap', '41 days', 'warn', .29), S('potential', 'Mid', 'pos', .24)],
    rec: {
      type: 'Action', action: 'Access discussion', objective: 'Clarify formulary restriction', channel: 'F2F',
      content: 'psp', window: 'Tue–Thu', confidence: 64, model: 'Access Signals v1.0',
      refreshed: 'Yesterday, 18:20', evaluated: 4, discuss: ['Formulary status changed this quarter', 'Confirm what the restriction actually blocks'],
    },
    ctx: { lastCall: 'Raised a prior-authorisation problem.', commitment: 'Check formulary status.', note: '' }, next: [],
  },
  {
    id: 'h10', name: 'Dr. Nina Halvorsen', spec: 'Internal Medicine', org: 'Summit Medical', terr: 'West',
    tier: 2, seg: 'Segment 2', consent: 'Granted', prefs: ['Virtual', 'Email'], state: 'Grow', stateNote: 'Rising',
    score: 49, priority: 'Normal', lastF2F: 26,
    dna: { 'Commercial opportunity': 56, 'Engagement propensity': 71, 'Digital affinity': 84, 'F2F affinity': 38, 'Content affinity': 66, 'Competitive risk': 27, 'Relationship strength': 52 },
    signals: [S('starts', '+4', 'pos', .42), S('content', 'Medium', 'warn', .31), S('gap', '26 days', 'warn', .27)],
    rec: {
      type: 'Action', action: 'Virtual meeting', objective: 'Support early adoption', channel: 'Virtual',
      content: 'rwe2', window: 'Fri, 15:00–17:00', confidence: 61, model: 'Coverage Optimiser v1.8',
      refreshed: 'Today, 08:15', evaluated: 3, discuss: ['Early adopter — reinforce rather than persuade'],
    },
    ctx: { lastCall: 'Started two patients, wanted monitoring guidance.', commitment: 'None outstanding.', note: '' }, next: [],
  },
  {
    id: 'h11', name: 'Dr. Omar Haddad', spec: 'Community Practice', org: 'Fairview Practice', terr: 'West',
    tier: 3, seg: 'Segment 3', consent: 'Denied', prefs: ['F2F'], state: 'Monitor', stateNote: 'Low engagement',
    score: 44, priority: 'Normal', lastF2F: 88,
    dna: { 'Commercial opportunity': 38, 'Engagement propensity': 24, 'Digital affinity': 19, 'F2F affinity': 42, 'Content affinity': 21, 'Competitive risk': 30, 'Relationship strength': 26 },
    signals: [S('gap', '88 days', 'crit', .55), S('potential', 'Low', 'warn', .26), S('content', 'None', 'warn', .19)],
    rec: {
      type: 'Action', action: 'Approved email', objective: 'Re-establish contact', channel: 'Email',
      content: 'rwe2', window: 'Any', confidence: 48, model: 'Coverage Optimiser v1.8',
      refreshed: 'Today, 08:15', evaluated: 2,
      discuss: ['No contact in nearly three months', 'The engine proposed email before consent was refreshed — the console blocks it'],
    },
    ctx: { lastCall: 'No call logged in this cycle.', commitment: 'None outstanding.', note: '' }, next: [],
  },
  {
    id: 'h12', name: 'Dr. Grace Lim', spec: 'Hospital Medicine', org: 'Summit Medical', terr: 'Central',
    tier: 1, seg: 'Segment 1', consent: 'Granted', prefs: ['F2F', 'Virtual'], state: 'Medical', stateNote: 'Refer to MSL',
    score: 41, priority: 'Normal', lastF2F: 17,
    dna: { 'Commercial opportunity': 49, 'Engagement propensity': 68, 'Digital affinity': 57, 'F2F affinity': 72, 'Content affinity': 88, 'Competitive risk': 25, 'Relationship strength': 74 },
    signals: [S('content', 'Scientific', 'pos', .51), S('potential', 'High', 'pos', .28), S('gap', '17 days', 'pos', .21)],
    rec: {
      type: 'Action', action: 'Refer to MSL', objective: 'Route unsolicited scientific request', channel: 'F2F',
      content: null, window: 'This week', confidence: 72, model: 'Medical Routing v1.1',
      refreshed: 'Today, 07:05', evaluated: 3, discuss: ['Her last three questions were off-label', 'Hand over rather than answer'],
    },
    ctx: { lastCall: 'Asked about combination data outside the label.', commitment: 'Arrange an MSL introduction.', note: '' }, next: [],
  },
];

export const DISMISS_REASONS = ['Not relevant', 'Already handled', 'Wrong context', 'HCP unavailable', 'Bad timing'];

export const CHANNEL_NAMES = ['F2F', 'Email', 'Webinar', 'Virtual', 'Phone'];
export const THEME_NAMES = ['Comparative Efficacy', 'Real-World Evidence', 'Dosing & Titration', 'Safety & Tolerability', 'Patient Support', 'Access & Reimbursement'];

const CHANNELS = {
  h1: [82, 61, 78, 54, 47], h2: [54, 88, 81, 79, 44], h3: [74, 38, 29, 33, 66], h4: [70, 35, 74, 41, 52],
  h5: [77, 66, 84, 70, 41], h6: [61, 34, 28, 30, 55], h7: [45, 79, 66, 72, 38], h8: [58, 27, 22, 31, 49],
  h9: [63, 52, 44, 48, 50], h10: [38, 80, 69, 83, 42], h11: [42, 19, 15, 21, 33], h12: [72, 58, 80, 66, 39],
};
const THEMES = {
  h1: [89, 71, 48, 63, 35, 41], h2: [72, 91, 55, 58, 40, 37], h3: [54, 42, 86, 61, 48, 35],
  h4: [46, 38, 44, 50, 79, 42], h5: [81, 88, 49, 72, 38, 44], h6: [48, 39, 52, 44, 41, 33],
  h7: [58, 64, 71, 49, 42, 36], h8: [41, 33, 38, 36, 45, 30], h9: [45, 41, 39, 43, 58, 84],
  h10: [55, 73, 66, 52, 44, 39], h11: [28, 24, 26, 22, 31, 20], h12: [76, 90, 44, 68, 36, 42],
};
HCPS.forEach(h => { h.ch = CHANNELS[h.id]; h.th = THEMES[h.id]; });
