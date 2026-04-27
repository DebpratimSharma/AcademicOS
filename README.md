# <img src="public/favicon.ico" width="32" height="32" valign="middle"> Schedura

**The Intelligent Academic Routine Manager**

Schedura is a high-performance, mobile-first academic routine manager designed for students and educators. It goes beyond a simple calendar by synchronizing your daily schedule with real-time attendance tracking, intelligent holiday logic, and seamless substitute session management.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Key Features

### 🕒 Intelligent Routine Management
- **Dynamic Context**: Automatic day-selection based on your local current time.
- **Precision Scheduling**: Handles regular weekly classes and one-time substitute sessions seamlessly.
- **Timezone-Safe Logic**: Built-in calculation logic that prevents "date-drift" across different geographic regions.

### 🏖️ Smart Holiday System
- **Personalized Breaks**: Mark specific days as holidays to instantly adjust your schedule.
- **Global Reactive State**: When a holiday is marked, attendance tracking for that day is automatically locked to prevent accidental logs.
- **Visual Indicators**: Clear indicators on tab headers for upcoming holidays.

### 📊 Advanced Attendance Tracking
- **Real-time Stats**: Instant calculation of your attendance percentage, classes conducted, and classes attended.
- **Manual Baseline Override**: NEW! Switch to Schedura easily by providing your previous attendance percentage/count as a starting point.
- **Correction Mode**: Correct master records or past logs without breaking your historical data.

### 🌓 Premium User Experience
- **Dark Mode Support**: Seamless integration with `next-themes` for comfortable late-night scheduling.
- **Glassmorphism Design**: A sleek, modern interface built with Tailwind CSS 4.0 and Radix UI.
- **Mobile First**: Fully responsive design with touch-friendly drawers and dialogs.

---

## 🛠️ Tech Stack

Schedura is built with a modern, scalable stack:

| Category | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4.0](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [TanStack Query](https://tanstack.com/query) |
| **Database & Auth** | [Supabase](https://supabase.com/) |
| **State & Fetching** | Server Actions, [Next-Themes](https://github.com/pacocoursey/next-themes) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Vaul](https://github.com/emilkowalski/vaul) (Drawers), [Sonner](https://sonner.emilkowal.ski/) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- pnpm (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/schedura.git
   cd schedura
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛡️ Core Architecture

- **Server Actions**: All database mutations (adding classes, marking attendance, resetting accounts) are handled via secure Next.js Server Actions.
- **RLS (Row Level Security)**: All user data is protected at the database level via Supabase RLS, ensuring your schedule is private to you.
- **Hydration Safety**: Advanced handling of client-side state (like themes and dates) to prevent SSR mismatches.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for students everywhere.
</p>