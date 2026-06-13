# Medical CRM Dashboard - UI/UX Upgrade & Consolidation Plan

This document serves as a record of the plan to upgrade the MSL (Medical Science Liaison) dashboard from a 5-tab workspace to an interactive 3-tab layout, optimizing for quick prep, readability, and source credibility.

---

## 🎯 Goal
Upgrade the right-pane workspace in the Medical CRM to reduce reading time for MSLs while providing highly accurate, contextual insights. We will link strategic actions directly to their source materials and combine historical data to avoid screen pollution.

---

## 🛠️ Reorganized 3-Tab Structure

Instead of 5 separate tabs that spread out Dr. Sarah Chen's profile data, we are consolidating the workspace into **3 highly relevant tabs**:

### 1. 📅 Meeting Prep (Day-Before Preparation)
*Merges AI Overview & Insights*
*   **Day-Before Prep Header**: Sets the timeline context immediately (e.g. "Meeting with Dr. Chen at 2:00 PM tomorrow").
*   **★ Contextually Relevant Banner**: A highlighted alert showcasing the single most critical mismatch or opportunity (e.g. Dr. Chen's caution on Immunotherapy re-challenge vs. recent Phase III RWE study showing manageable toxicity).
*   **Interactive 2-Column Split**:
    *   **Left Column (Talking Points)**: A concise list of recommended discussion items.
    *   **Right Column (Source Evidence)**: Context cards showing *where* the talking points came from (e.g. WCLC chair notes, advisor board transcripts, active publications).
    *   **Interactivity**: Hovering over a talking point on the left will highlight or focus its respective source card on the right (and vice-versa).

### 2. ⏳ Timeline (Combined Touchpoints)
*Merges Interactions & Inquiries*
*   **Unified Chronological Feed**: Combines meetings, calls, emails, and Scientific Inquiries (MIRs) in a single stream.
*   **Source Categorization**: Clearly marks whether a card is an "Interaction" or a "Medical Request (Inquiry)".
*   **Quick Filtering**: Buttons to filter the feed dynamically by type (All, Meetings, Emails, Calls, Inquiries).

### 3. 📚 Library (Publications & Reference Hub)
*Renames and expands Publications*
*   **KOL Accomplishments**: Shows Dr. Chen's publication metrics (h-index, total citations) and publication trends.
*   **Recent Papers**: Scrollable list of her papers with DOI external links.
*   **Reference Materials**: Quick-access section for resources related to the talking points (e.g., Corticosteroid guidelines, RWE data sheets).

---

## 🏗️ File Architecture

*   `src/App.jsx` — Configured with the updated tabs: `['Meeting Prep', 'Timeline', 'Library']`.
*   `src/components/Workspace.jsx` — Coordinates the rendering of the active tab.
*   `src/components/tabs/MeetingPrep.jsx` — *[NEW]* Core 2-column interactive preparation workspace.
*   `src/components/tabs/Timeline.jsx` — *[NEW]* Chronological activity stream with filters.
*   `src/components/tabs/Library.jsx` — *[NEW]* Merged publication metrics and medical literature guidelines.
*   `src/App.css` / `src/index.css` — Custom styling (Vanilla CSS) for hover connections, banner accents, and responsive layout grids.
