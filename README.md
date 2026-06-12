# 🌌 Aether - Premium Task & Product Management Workspace

Aether is a visual-first, high-fidelity Task and Product Management Workspace frontend designed for elite product teams. Inspired by modern SaaS design trends on Dribbble, Behance, and Pinterest, Aether combines minimalist aesthetics with rich animations, seamless drag-and-drop operations, real-time email OTP verification, and a keyboard-first navigation system.

---

## 🌟 Visual Showcase & Design Philosophy

Aether is designed around a **Modern SaaS Aesthetic** featuring:
- **Subtle Glassmorphism**: Soft background blurs and transparent card layouts that adapt to dark and light modes.
- **Elite Color Gradients**: Deep indigo, violet, mint, emerald, and sunset amber highlights.
- **Class-Based Dark Mode**: Integrated manually via Tailwind v4 custom variants for instantaneous, flicker-free toggling.
- **Fluid Micro-interactions**: Smooth card lifts, focus states, and button presses powered by Framer Motion.

---

## 🚀 Core Capabilities & Features

### 🔐 1. Bulletproof Authentication Flow
- **Frictionless Onboarding**: Toggles between Login, Register, and Forgot Password panels smoothly.
- **Real Client-Side Email OTP**: Integrated with a free, zero-config transactional mailer. Submitting an email triggers a real POST dispatch to the user's inbox containing the 4-digit code.
- **Input Shaking & Error Indicators**: Wrong OTP codes trigger a smooth shaking animation and red highlight.

### 🧭 2. Collapsible Sidebar & Hamburger Menu (Responsive for All Devices)
- **Desktop & Laptop Mode**: Sidebar collapses into a compact 16px icon bar with a single tap of the **Close Chevron** button.
- **Mobile & Tablet Mode**: Fully hidden by default, sliding out as a premium drawer overlay using a floating hamburger menu button.
- **Command Palette Integration**: Includes a search box trigger displaying the `⌘K` shortcut.

### 📊 3. Interactive Productivity Hub (Dashboard)
- **Radial Goal Gauges**: Tracks week-over-week completion rates.
- **Focus of the Day**: Quick-check list prioritizing critical items due shortly.
- **Custom-Coded SVG Line Charts**: Features glowing area gradients showing task completions over the last 7 days.

### 📋 4. Task Command Center
- **HTML5 Drag-and-Drop Kanban**: Fully reactive columns supporting direct touch/pointer movements.
- **Spreadsheet List View**: High-density grid with sorting, label filters, and instant action overlays (duplicate, archive, delete).
- **Masonry Card Grid**: Highlights checklists, file attachments, and comment counters.

### 📅 5. Timeline Calendar View
- Toggles dynamically between **Monthly Grid**, **Weekly Schedule**, and **Daily Agenda**.
- Click any calendar cell to trigger a quick-add dialog pre-filled with that date.

### 📈 6. Intelligence Analytics
- **Radial Productivity Indexes**: Calculates a score (e.g. 84/100) based on task velocity.
- **Donut Priority Distribution**: Visually segments workloads (High, Medium, Low) using custom SVG circles.

---

## 🛠️ Repository Structure

Aether follows a modern, professional, and scalable React + TypeScript folder structure:

```bash
aether-workspace/
├── public/                 # Static assets, mock upload templates, and logos
├── src/
│   ├── components/         # Premium modular UI views and cards
│   │   ├── AuthView.tsx          # Real OTP Login, Register & Social login UI
│   │   ├── Onboarding.tsx        # Multi-step workspace & theme configurator
│   │   ├── Sidebar.tsx           # Collapsible responsive navigation drawer
│   │   ├── Header.tsx            # Sticky glassmorphic header with notifications
│   │   ├── DashboardView.tsx     # Hero banner, focus list, SVG line charts
│   │   ├── TasksView.tsx         # Kanban board, List, Grid layout systems
│   │   ├── TaskModal.tsx         # Slide-out task editor, checklists, timeline audit log
│   │   ├── ProjectsView.tsx      # Milestone tracker, color vibe themes
│   │   ├── CalendarView.tsx      # Monthly, Weekly & Daily schedule timeline
│   │   ├── AnalyticsView.tsx     # Productivity indexes, donut priority charts
│   │   ├── TeamView.tsx          # Member rosters, invite module, stream feeds
│   │   ├── ProfileView.tsx       # Account settings, 2FA security, notifications
│   │   ├── CommandPalette.tsx    # Spot-on ⌘K search & navigation console
│   │   └── QuickAddTaskModal.tsx # Centered quick-add card with checklist builder
│   ├── store/              # Global state management
│   │   └── taskStore.ts          # Zustand master state, pre-populated seed data, and core actions
│   ├── utils/              # Helper utilities
│   │   └── cn.ts                 # Tailwind class merger (clsx + tailwind-merge)
│   ├── App.tsx             # Master viewport router and layout coordinator
│   ├── main.tsx            # React hydration mount point
│   └── index.css           # Tailwind v4 import, scrollbars, and dark mode variants
├── index.html              # HTML entry point containing high-fidelity metadata
├── vite.config.ts          # Vite compilation settings
├── tsconfig.json           # TypeScript compilation configurations
└── package.json            # Project dependencies and script runner
```

---

## ⚙️ State Management & Architecture

Aether utilizes a **Zustand** global store (`src/store/taskStore.ts`) to manage state cleanly without prop-drilling or complex boilerplate:
- **Reactive Actions**: Redux-style action setters for task creation, project favoriting, profile auto-saves, and notification clears.
- **Dynamic Milestones**: Toggling milestones instantly recalculates parent project progress bars via custom math reducers.
- **Theme Synchronization**: The theme setter immediately toggles the `.dark` class on the `<html>` root, keeping theme preferences perfectly in sync.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`⌘ + K`** (or `Ctrl + K`) | Toggle Global Search Command Palette |
| **`⌘ + T`** (or `Ctrl + T`) | Toggle Dark / Light Mode instantly |
| **`ESC`** | Close Modals, Dropdowns, or Command Palette |
| **`↑ / ↓`** | Navigate through Command Palette search results |
| **`Enter`** | Select / Execute highlighted item in Command Palette |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (version 18 or higher) and npm installed.

### 2. Installation
Clone the repository and install the npm packages:
```bash
git clone https://github.com/your-username/aether-workspace.git
cd aether-workspace
npm install
```

### 3. Run Development Server
Start the Vite development server:
```bash
npm run dev
```

### 4. Build for Production
Build a highly optimized production bundle:
```bash
npm run build
```
The compiled output will be generated inside the `dist/` folder, ready for deployment to platforms like Vercel, Netlify, or AWS.

---

## 🎨 Technology Stack

- **Framework**: React 19 + Vite 7 (High-performance build engine)
- **Language**: TypeScript (Strict typing for robust component states)
- **Styling**: Tailwind CSS v4 (CSS-First utility architecture)
- **Animations**: Framer Motion (Smooth page transitions and modal lifts)
- **State Management**: Zustand (Clean, lightweight global store)
- **Icons**: Lucide React (Crisp, premium vector icons)
