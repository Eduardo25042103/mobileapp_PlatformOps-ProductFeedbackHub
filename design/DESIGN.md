---
name: Obsidian Telemetry
displayName: Obsidian Telemetry
theme:
  colorMode: DARK
  primary: "#6366F1"
  secondary: "#8B5CF6"
  tertiary: "#06B6D4"
  neutralCanvas: "#0F172A"
  surfaceCard: "#1E293B"
  surfaceBorder: "#334155"
  textPrimary: "#F8FAFC"
  textSecondary: "#94A3B8"
  textMuted: "#64748B"
  errorRed: "#EF4444"
  warningAmber: "#F59E0B"
  infoBlue: "#3B82F6"
  successEmerald: "#10B981"
typography:
  headlineFont: "Geist, system-ui, sans-serif"
  bodyFont: "Inter, system-ui, sans-serif"
  labelFont: "JetBrains Mono, monospace"
radii:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
---

# Design System: Obsidian Telemetry

## 1. Brand & Aesthetic Overview
This design system targets infrastructure engineers, product managers, support teams, and site reliability teams operating in mission-critical environments. The tone is utilitarian, hyper-precise, and fast—evoking developer platforms like Linear, Datadog, and Vercel.

- **Theme Mode:** Technical Dark Mode.
- **Base Canvas (`Level 0`):** `#0F172A`
- **Cards & Row Panels (`Level 1`):** `#1E293B` bounded by a 1px solid `#334155` hairline border.
- **Modals & Overlays (`Level 2`):** `#1E293B` with border `rgba(255, 255, 255, 0.15)` and ambient directional shadow.

## 2. Color Palette & Semantic Tokens
- **Canvas Base:** `#0F172A`
- **Card / Surface:** `#1E293B`
- **Border / Divider:** `#334155`
- **Primary Indigo (CTA & Focus):** `#6366F1`
- **Secondary Violet:** `#8B5CF6`
- **Tertiary Cyan:** `#06B6D4`
- **Text Headings:** `#F8FAFC`
- **Text Body:** `#CBD5E1`
- **Text Muted / Placeholders:** `#64748B`

### Severities & Priorities
- **P1 Crítico:** Text `#EF4444`, background `rgba(239, 68, 68, 0.12)`, border `rgba(239, 68, 68, 0.25)`
- **P2 Alta:** Text `#F59E0B`, background `rgba(245, 158, 11, 0.12)`, border `rgba(245, 158, 11, 0.25)`
- **P3 Media:** Text `#3B82F6`, background `rgba(59, 130, 246, 0.12)`, border `rgba(59, 130, 246, 0.25)`
- **P4 Baja:** Text `#94A3B8`, background `rgba(148, 163, 184, 0.12)`, border `rgba(148, 163, 184, 0.25)`

### Status Indicators & Live Pulse
- **Live SSE Status:** Pulsing green circular dot `#10B981` with infinite concentric pulse.
- **En Diagnóstico / En Desarrollo:** Violet `#8B5CF6`
- **En QA:** Amber `#F59E0B`
- **Resuelto / Cerrado:** Emerald `#10B981`

## 3. Typography
- **Headlines:** Geist / Inter Semibold (`16px`, `20px`, `24px`)
- **Body:** Inter Regular / Medium (`12px`, `14px`, `16px`)
- **Labels, Codes & Ticket IDs:** JetBrains Mono (`10px`, `11px`, `12px`) uppercase or monospace.

## 4. UI Components

### 4.1 Buttons
- **Primary:** Background `#6366F1`, text `#F8FAFC`, font Inter 14px weight 500, height 38px, radius 6px.
- **Secondary:** Surface `#1E293B`, border 1px solid `#334155`, text `#F8FAFC`.
- **Ghost:** Transparent, text `#94A3B8`, active background `rgba(255, 255, 255, 0.05)`.

### 4.2 Priority Badges & Status Pills
- Structure: Pill-shaped `rounded-full` (`9999px`), height 20px, padding `2px 8px`.
- Monospace label (e.g. `P1 CRÍTICO`, `EN DESARROLLO`).

### 4.3 Input Fields
- Background `#0F172A`, border 1px solid `#334155`, padding `10px 14px`, text `#F8FAFC`, placeholder `#64748B`.
- Focus state: border `#6366F1` with subtle glow.

### 4.4 Feed Cards (`TicketCard`)
- Background `#1E293B`, border 1px solid `#334155`, border-radius 8px, padding 12px.
- Monospace ticket identifier (`#TK-1082`) in `#64748B`.
- Status pill & Priority badge aligned on top right.

### 4.5 Concurrency Conflict Warning (409)
- Banner/Modal with background `rgba(239, 68, 68, 0.15)`, border 1px solid `#EF4444`, warning icon and primary "Recargar datos" button.
