# HCP Segmentation and Targeting — Design

## Goal
Add one new screen to `medical-crm`, themed to match the Improzo-style shell
(sidebar + header) found in `medical-crm-local-backup`, without importing the
rest of that backup's pages.

## Shell port
- Port `AppShell.jsx` + `LeftNav.jsx` pattern into `medical-crm/src/components/`.
- Nav kept minimal: `Home` (default), `MSL / Insights` group (MSL Call Brief,
  Weekly Insights, Executive Insights — existing components, re-themed), and
  `HCP` group with one sub-item: `Segmentation & Targeting`.
- Port required CSS blocks (`.app-shell`, `.left-nav*`, `.app-header*`,
  `.kpi-card*`, `.dashboard-card*`, `.page-header`, `.data-table`) from
  `medical-crm-local-backup/src/App.css` into `medical-crm/src/App.css`.
- `App.jsx`: swap `DashboardLayout` for the new `AppShell`.

## New page: HCPSegmentationPage.jsx
- Page header: "HCP Segmentation and Targeting".
- Horizontal clickable 12-stage stepper (from user's flowchart):
  1. Data Upload
  2. Data Validation
  3. Data Mapping & Standardization
  4. Attribute Selection
  5. Model / Strategy Selection
  6. Configure Parameters
  7. Run Segmentation
  8. Review & Compare Results
  9. Approve Segmentation
  10. Targeting
  11. Call Plan
  12. Export & Dashboard
- Content panel below stepper swaps per selected stage; each stage is mocked
  prototype-level UI reusing existing theme classes (cards, tables, KPI tiles).
- Stage 5 (Model/Strategy Selection) is the core: selectable cards for each
  segmentation type from the reference spreadsheet, grouped/colored by
  Dimension:
  - Value & Potential (yellow): M1 Market Potential Decile, M2 Brand
    Performance Decile, M3 NBRx Share, S1 Prescription Potential Tier
  - Status & Direction (green): M4 Months Since First Rx, S2 Prescriber
    Lifecycle Stage
  - Behaviour (orange): S3 Writer Persona
  - Engagement (purple): S4 Digital Engagement Segment
  - Selecting a card shows its detail (What it means / How it's used /
    Values) pulled from the spreadsheet content.
- Nav entry: one item, "Segmentation & Targeting", under `HCP`.

## Out of scope
- No backend/data wiring — mock data only.
- No other backup pages (Home widgets, KOL, Medical, RWE, etc.) ported.
