# 👁️ InSight — Enterprise Customer Feedback, Visual Bug Reporting & Backlog Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Design System](https://img.shields.io/badge/Design%20System-HeroUI%20%2F%20NextUI%20Enterprise-0072F5?style=flat-square)](https://github.com/abhijeetbafna/insight-feedback-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**InSight** is a production-grade, enterprise-ready customer feedback, visual bug reporting, and interactive backlog management platform. Designed with a **crisp HeroUI / NextUI Enterprise Card System, high-contrast typography, and full Light & Dark mode support**, InSight empowers SaaS teams to capture rich, in-context feedback and visual bug reports directly from their end-users.

---

## ✨ Features & Capabilities

- 📥 **Interactive Inbox & Backlog Table**: Multi-column filtering by category (**Bug Report**, **Feature Request**, **Improvement**, **Praise**), status, project key (`PRJ-ANALYTICS`, `PRJ-MOBILE`, etc.), release version, and full-text search.
- 📊 **5-Column Enterprise Kanban Board**: Visual workflow with smooth hover elevations, instant status drag/click transitions (`New` → `In Review` → `Planned` → `In Progress` → `Resolved`), and assignee management.
- 🧪 **Fully Functional Interactive Host App Sandbox**: Built-in mock SaaS application (*"Acme Revenue Analytics Hub"*) featuring 4 fully interactive tabs:
  - **Overview**: Revenue KPI cards (`$184,290 MRR`, `1,429 Teams`, `68.4% Conversion`) and an interactive **Weekly Revenue Velocity & Cohort Performance** chart with instant praise feedback injection.
  - **Conversions**: Conversion Funnel SLAs, Cart Abandonment rates, Payment Retry Success, and an interactive **Checkout Funnel Monitoring** panel with instant bug report simulation.
  - **Billing**: Invoicing KPIs, auto-renewal rates, and an interactive **Invoice Ledger & CSV Data Export** table.
  - **Api-Logs**: API Gateway throughput, P99 latency SLA monitoring, and a **Real-Time Webhook & API Gateway Event Log console** with live Request ID tracing requests.
- 📸 **Visual DOM Screenshot Capture & Annotation Engine**: Standalone widget script (`/insight-widget.js`) featuring real DOM visual screenshot capture via **HTML2Canvas** (with SVG fallback), target DOM element inspection & framing, interactive canvas drawing annotations, and **automatic state resetting** on modal close.
- ⚙️ **1-Line Embed Code Generator & Webhook Console**: Generates clean, asynchronous `<script>` tags for instant integration into any web application (WordPress, Shopify, React, Next.js, or custom SaaS). Includes CSV dataset exporter and webhook payload simulator.
- 👤 **Enterprise Workspace & User Profiles**: Integrated workspace switcher, seat license management, and authenticated user profile simulation.
- 🎨 **HeroUI v3 / NextUI Enterprise Aesthetics**: Solid, clean surface cards, professional dark slate terminal code boxes (`.ant-code-box`), crisp alert banners, and zero jarring glassmorphism.

---

## 🚀 Quickstart & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/abhijeetbafna/insight-feedback-platform.git
cd insight-feedback-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for production
```bash
npm run build
```

---

## 🔌 1-Line Embed Integration

To add the InSight Feedback Widget to any web application, paste this snippet inside your page `<body>`:

```html
<script 
  src="https://your-domain.com/insight-widget.js" 
  data-project-key="PRJ-ANALYTICS" 
  data-release-version="v2.4.1" 
  data-color="#1677FF" 
  data-position="bottom-right" 
  async>
</script>
```

### Widget Script Capabilities:
- **Zero External UI Lock-in**: Lightweight shadow DOM container that won't conflict with your app's stylesheets.
- **Visual Element Inspector**: Let end-users point and click any DOM element on your page (`data-component` or CSS selector) to automatically attach it to their bug report.
- **Real Screen Capture**: Automatically hides the feedback modal during capture so the screenshot reflects the true underlying application view.
- **Clean DOM Teardown**: Automatically removes standalone script and widget nodes when navigating between dashboard tabs.

---

## 🛠️ Technology Stack & Clean Architecture

- **Core Framework**: React 18 (Functional Components, Custom Hooks)
- **Build & Bundle**: Vite 5
- **Styling**: Vanilla CSS Design Tokens (`src/styles/design-tokens.css`) structured around modern HeroUI / NextUI enterprise patterns.
- **State & Sync**: Custom Hooks (`useSubmissions`, `useProjects`, `useTheme`) + LocalStorage Storage Service + BroadcastChannel Cross-Tab Synchronization.
- **Screenshot Engine**: HTML2Canvas with high-fidelity DOM canvas fallback.

---

## 📄 License
MIT © Abhijeet
