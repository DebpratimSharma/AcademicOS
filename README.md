📅 AcademicOS: Smart Academic Scheduler

A high-performance, mobile-first academic routine manager built for students and educators. AcademicOS synchronizes your daily schedule with real-time attendance tracking, automated holiday logic, and substitute session management.

✨ Key Features

🕒 Intelligent Routine Management

Dynamic Tabs: Automatic day-selection based on current time.

Precision Scheduling: Handles regular weekly classes and one-time substitute sessions seamlessly.

Timezone-Safe Logic: Proprietary date calculation that prevents "date-drift" across different geographic regions.

🏖️ Smart Holiday System

Per-User Holidays: Personalize your break days with a sleek Calendar Drawer.

Global Reactive State: Mark a day as a holiday, and all attendance buttons instantly lock across the app to prevent accidental tracking.

Visual Indicators: Indicators on tab headers for upcoming holidays.

📊 Attendance Tracking (BETA)

One-Tap Logs: Mark presence, absence, or dismissed status with haptic-ready feedback.

Persistence: Powered by Supabase RLS (Row Level Security) for iron-clad data privacy.

📱 Modern UI/UX

Design: Minimalist aesthetics with a focus on typography (Bold & Italic accents).

Speed Dial Menu: Quick-action floating buttons for adding classes or substitutes on the fly.

Adaptive Dark Mode: Sophisticated palette that adjusts to your system theme.

🛠️ Tech Stack

Framework: Next.js 14+ (App Router)

Database & Auth: Supabase

Styling: Tailwind CSS

Components: Shadcn/UI

State Management: React Hooks & Custom Event Dispatching

Date Handling: date-fns

🚀 Getting Started

Prerequisites

Node.js 18+

Supabase Account

Installation

Clone the repository

git clone [https://github.com/DebpratimSharma/AcademicOS.git](https://github.com/DebpratimSharma/AcademicOS.git)
cd academicos


Install dependencies

pnpm install


Environment Setup
Create a .env.local file and add your Supabase credentials.

Database Schema
Run the SQL migrations provided in /supabase/migrations to set up:

routines table

holidays table

extra_sessions table

attendance table

attendance_stats  view

user_settings table

Launch

pnpm run dev


🔒 Security & Cookies

AcademicOS utilizes Strictly Necessary Cookies for authentication and session persistence via Supabase. We prioritize user privacy:

No third-party tracking or marketing cookies.

Row-Level Security ensures you only ever see your own data.

🗺️ Working On

[ ] Analytics Hub (Attendance Percentage)

[ ] Push Notifications for upcoming classes

Built with ❤️ for better academic productivity.