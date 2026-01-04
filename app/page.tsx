//'use client';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FadeIN } from "@/components/FadeIN";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  Zap,
  BarChart3,
} from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  colSpan = "col-span-1",
}: {
  icon: any;
  title: string;
  desc: string;
  colSpan?: string;
}) => (
  <div
    className={`bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-border rounded-2xl p-8 hover:border-foreground/25 transition-all h-full group ${colSpan}`}
  >
    <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-foreground/5">
      <Icon className="text-foreground w-5 h-5" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-foreground/60 leading-relaxed">{desc}</p>
  </div>
);

const HeroMockup = () => (
  <div className="relative mx-auto w-full  perspective-[2000px] group">
    {/* Glow Effect behind mockup */}
    <div className="absolute inset-0  rounded-full transform scale-75 group-hover:scale-90 transition-transform duration-700"></div>

    {/* The 3D Card */}
    <div className="relative bg-background border border-border rounded-xl shadow-2xl overflow-hidden transform md:rotate-x-12 group-hover:rotate-x-0 transition-transform duration-700 ease-out p-1">
      {/* Fake Browser Header */}
      <div className="h-8 bg-muted/15 rounded-t-lg border-b border-border flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
        <div className="ml-4 h-4 w-64 bg-muted/50 rounded-full"></div>
      </div>

      {/* App UI Representation */}
      <div className="p-6 grid gap-6">
        {/* App Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-mono text-border mb-2">
              MONDAY, OCT 24
            </div>
            <div className="text-3xl font-bold text-foreground">Hello, Deb</div>
          </div>
          <div className="flex gap-2">
            <div className="bg-card border border-border px-3 py-1 rounded text-xs text-foreground/25">
              Edit Mode
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "TOTAL", val: "4", color: "text-foreground" },
            { label: "ATTEND", val: "92%", color: "text-foreground" },
            { label: "PRESENT", val: "12", color: "text-emerald-400" },
            { label: "ABSENT", val: "1", color: "text-rose-400" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card/50 border border-border p-4 rounded-lg"
            >
              <div className="text-[10px] uppercase tracking-wider text-foreground/20 font-semibold">
                {stat.label}
              </div>
              <div className={`text-xl font-bold mt-1 ${stat.color}`}>
                {stat.val}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-3 relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-card"></div>
          {[
            {
              time: "09:00 AM",
              title: "Data Structures",
              code: "CS201",
              status: "present",
            },
            {
              time: "11:00 AM",
              title: "Linear Algebra",
              code: "MAT104",
              status: "pending",
            },
            {
              time: "02:00 PM",
              title: "Physics Lab",
              code: "PHY101",
              status: "absent",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 relative">
              <div
                className={`w-3 h-3 rounded-full border-2 border-border z-10 mt-6 translate-x-[13.5px] ${
                  item.status === "present"
                    ? "bg-emerald-500"
                    : item.status === "absent"
                    ? "bg-destructive"
                    : "bg-muted"
                }`}
              ></div>
              <div className="flex-1 bg-background border border-border rounded-lg p-4 flex justify-between items-center group/card hover:border-foreground/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono bg-background text-foreground/60 px-1 rounded border border-border">
                      {item.time}
                    </span>
                  </div>
                  <div className="text-foreground font-medium">
                    {item.title}
                  </div>
                  <div className="text-xs text-foreground/50">{item.code}</div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    item.status === "present"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                      : item.status === "absent"
                      ? "bg-rose-500/10 border-rose-500/50 text-rose-500"
                      : "bg-zinc-800 border-border text-foreground/50"
                  }`}
                >
                  {item.status === "present" && <CheckCircle2 size={14} />}
                  {item.status === "absent" && (
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  )}
                  {item.status === "pending" && (
                    <div className="w-2 h-2 border-2 border-current rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className=" flex flex-col  items-center ">
      <Navbar />
      <div id="hero" className="flex bg-grid flex-col gap-3 items-center justify-center w-full min-h-screen">
        <FadeIN delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 text-center">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40">
              Academic OS
            </span>
          </h1>
        </FadeIN>

        <FadeIN delay={200}>
          <p className="px-5 md:px-0 text-center text-lg md:text-xl text-foreground/30 max-w-2xl mx-auto mb-10 leading-relaxed">
            The smart and modern routine management system designed for
            students. Track attendance, manage holidays, and sync your schedule
            across all devices in real-time.
          </p>
        </FadeIN>
        <LoginButton>
          <button className="py-7 px-8 rounded-full bg-foreground text-background font-semibold cursor-pointer transition-colors flex items-center gap-2">
            Start for free <ArrowRight size={16} />
          </button>
        </LoginButton>
        <a
          href="#explore"
          className="group flex flex-col items-center gap-4 mt-12 transition-all duration-500 hover:scale-110"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground/40 group-hover:text-foreground transition-colors">
            Explore
          </span>

          {/* The Animated Line */}
          <div className="w-[1px] h-16 bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-foreground animate-scroll-line"></div>
          </div>
        </a>
      </div>
      <div className="w-full px-5 md:px-30 pb-10 scroll-mt-24" id="explore" >
        <FadeIN delay={300}>
          <HeroMockup  />
        </FadeIN>
      </div>

      {/*Feature Cards*/}
      <section id="features" className="py-24 px-5 md:px-30 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <br />
              graduate on time.
            </h2>
            <p className="text-foreground/55">
              Powerful features wrapped in a minimalist design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FadeIN delay={0} className="lg:col-span-2 h-full">
              <FeatureCard
                icon={BarChart3}
                title="Real-time Attendance Stats"
                desc="See your attendance stats and info in real-time. Know how many classes you can afford to skip (or not)."
                colSpan="lg:col-span-2"
              />
            </FadeIN>

            <FadeIN delay={100}>
              <FeatureCard
                icon={Zap}
                title="Cloud Sync"
                desc="Acces your routines everywhere. Powered by Supabase."
              />
            </FadeIN>

            <FadeIN delay={200}>
              <FeatureCard
                icon={Calendar}
                title="Smart Holidays"
                desc="Automatic holiday detection. The app switches to 'Vacation Mode' so you can relax guilt-free."
              />
            </FadeIN>

            <FadeIN delay={300} className="lg:col-span-2">
              <FeatureCard
                icon={LayoutGrid}
                title="Customizable Workflows"
                desc="Edit your schedule on the fly. Add extra classes, cancel lectures, or adjust your working days with a single click."
              />
            </FadeIN>
          </div>
        </div>
      </section>
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIN>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to organize your life?
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of students who have ditched their messy
              spreadsheets.
            </p>
            <div className="w-full flex justify-center">
              <LoginButton>
                <button className="py-7 px-8 rounded-full bg-foreground text-background font-semibold cursor-pointer transition-colors flex items-center gap-2">
                  Start for free <ArrowRight size={16} />
                </button>
              </LoginButton>
            </div>
          </FadeIN>
        </div>
      </section>
    </main>
  );
}
