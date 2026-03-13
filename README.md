# Bharat-Insight AI-Driven Data Platform

A professional multi-tenant analytics platform built with React, TypeScript, and deep analytics models. This project showcases high-performance data handling, modern UI/UX patterns, and real-time insights using Indian public data.

## 🚀 Live Demo
[Insert Hosted Link Here]

## ✨ Features

### 1. Modern Landing Page
- **Bento Grid Layout**: Visually stunning feature showcase.
- **Scroll-Reveal Animations**: Powered by `framer-motion` for a smooth entry experience.
- **Dark Mode Aesthetic**: A sleek, minimalist "Dark Mode" theme with clean gradients.
- **Interactive Hero**: Animated typography and background effects to preview platform power.

### 2. High-Performance Analytics Dashboard
- **Virtualized Data Grid**: Renders over **345,000+ rows** of Indian Agricultural data smoothly using `@tanstack/react-virtual`.
- **Advanced Grid Features**: Multi-column sorting, global fuzzy search, sticky headers, and responsive columns.
- **Multi-Tenant Architecture**: 
  - **Org Switcher**: Instantly switch between departments (Agriculture, Health, Education, Finance).
  - **Dynamic UI**: UI themes and data update instantly without page refresh.
  - **Role-Based Access**: Context-aware UI for **Admin** (can export/edit) and **Viewer** (read-only) roles.

### 3. Deep Data Insights
- **Real-time Insights**: Automated analysis indicators for grid data.
- **Reasoning State**: Visible indicators explaining platform logic.
- **Context Awareness**: System is primed to answer based on the agricultural dataset context.

### 4. Enterprise-Grade UI/UX
- **Command Palette**: `Cmd+K` (or `Ctrl+K`) search bar for rapid navigation and actions.
- **Skeleton Loaders**: Shimmering placeholders for all data-fetching states to reduce perceived latency.
- **Modern Typography**: Uses "Inter" and "Geist" for a professional look.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Framer Motion
- **Icons**: Lucide React
- **Data Management**: TanStack Table, TanStack Virtual
- **Parsing**: PapaParse (Web Worker supported)
- **Command Menu**: CMDK

## 📦 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bharat-insight.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📊 Data Source
This project uses the **India Agriculture Crop Production** dataset (~345,000 rows) sourced from `data.gov.in` via community-maintained repositories.
