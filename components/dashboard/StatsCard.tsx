"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function StatsCards() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    percentage: 0,
    present: 0,
    conducted: 0,
    absent: 0
  });
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    
    // 1. Get the current user to ensure we only fetch THEIR data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    // 2. Filter by user_id even if the View has RLS
    const { data: stats, error } = await supabase
      .from('attendance_stats')
      .select('*')
      .eq('user_id', user.id);

    if (!error && stats) {
      const totalPresent = stats.reduce((acc, curr) => acc + curr.total_present, 0);
      const totalConducted = stats.reduce((acc, curr) => acc + curr.total_conducted, 0);
      const percentage = totalConducted > 0 ? Math.round((totalPresent / totalConducted) * 100) : 0;
      
      setData({
        percentage,
        present: totalPresent,
        conducted: totalConducted,
        absent: totalConducted - totalPresent
      });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();

    const handleUpdate = () => fetchStats();
    
    // Fixed: Ensure the event names match exactly what is dispatched in ClassCard
    window.addEventListener('attendanceUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('attendanceUpdated', handleUpdate);
    };
  }, [fetchStats]);

  const statsConfig = [
    { label: "TOTAL", value: data.conducted, color: "text-foreground" },
    { label: "ATTEND", value: `${data.percentage}%`, color: "text-foreground" },
    { label: "PRESENT", value: data.present, color: "text-green-400" },
    { label: "ABSENT", value: data.absent, color: "text-red-400" },
  ];

  return (
    <div className="space-y-2 md:space-y-5 mx-auto mb-0">
      <div className="flex justify-end">
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Sync Stats
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-7 w-full">
        {statsConfig.map((stat, index) => (
          <div 
            key={index} 
            className="bg-card border border-border aspect-square md:aspect-auto md:space-y-6 rounded-lg p-4 flex flex-col justify-between  transition-all shadow-sm"
          >
            <span className="text-[10px] md:text-xl font-bold text-muted-foreground tracking-wider uppercase">
              {stat.label}
            </span>
            <span className={cn("text-2xl font-bold tracking-tight", stat.color)}>
              {loading ? "..." : stat.value}
            </span>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-end'>
        <Button variant="secondary" disabled={true} className='rounded-full bg-card border border-border text-foreground/70'>
        Go to Hub (Coming soon...)
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </Button>
      </div>
    </div>
  );
}