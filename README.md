# 👁️ InSight — Enterprise Customer Feedback, Visual Bug Reporting & Backlog Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Design System](https://img.shields.io/badge/UI-Glassmorphic%20%2F%20Neon-38bdf8?style=flat-square)](https://github.com/abhijeetbafna/insight-feedback-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**InSight** is a production-grade, enterprise-ready customer feedback, visual bug reporting, and interactive backlog management platform. Designed with **vibrant glassmorphism, obsidian dark mode lighting, and micro-animations**, InSight empowers SaaS teams to capture in-context feedback directly from their end-users.

---

## ✨ Features & Capabilities

- 📥 **Interactive Inbox & Backlog**: Multi-column filtering by category (**Bug**, **Feature Request**, **Improvement**, **Praise**), status, project key, release version, and full-text search.
- 📊 **5-Column Kanban Workflow**: Visual board with smooth hover elevations, instant status drag/click transitions (`New` → `In Review` → `Planned` → `In Progress` → `Resolved`), and assignee management.
- 🧪 **Live Embedded Widget Sandbox**: Built-in simulated host application (*"Acme Revenue Analytics Hub"*) demonstrating real-time bottom-right floating widget integration, visual UI element inspection, and instant screenshot/attachment capture.
- ⚙️ **1-Line Embed Code Generator**: Generates clean, asynchronous `<script>` tags for instant integration into any web application (WordPress, Shopify, React, Next.js, or custom SaaS).
- 👤 **Enterprise User & Workspace Menu**: Integrated workspace profile management, seat license overview, and auth simulation modal.
- 🎨 **Deep Obsidian & Glassmorphic UI**: High-contrast neon accents, backdrop-blur frosted cards, glowing sparkline KPI indicators, and responsive table formatting.

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
  data-color="#38bdf8" 
  data-position="bottom-right" 
  async>
</script>
```

---

## 🛠️ Technology Stack & Clean Architecture

- **Core Framework**: React 18 (Functional Components, Custom Hooks)
- **Build & Bundle**: Vite 5
- **Styling**: Vanilla CSS Design Tokens (`src/styles/design-tokens.css`)
- **State & Sync**: Custom Hooks (`useSubmissions`, `useProjects`, `useTheme`) + LocalStorage Storage Service + BroadcastChannel Cross-Tab Synchronization
- **Zero External UI Library Lock-In**: Lightweight, ultra-fast custom modal, drawer, and notification components.

---

## 📄 License
MIT © Abhijeet
