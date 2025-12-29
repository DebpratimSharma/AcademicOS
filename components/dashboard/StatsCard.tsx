"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

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
    const { data: stats, error } = await supabase
      .from('attendance_stats')
      .select('*');

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

  // Fetch once on mount
  useEffect(() => {
    fetchStats();
    const handleUpdate = () => fetchStats();
    window.addEventListener('attendanceUpdated', handleUpdate);
    // Cleanup listener on unmount
    return () => window.removeEventListener('attendance-updated', handleUpdate);
  }, [fetchStats]);

  const statsConfig = [
    { label: "TOTAL", value: data.conducted, color: "text-foreground" },
    { label: "ATTEND", value: `${data.percentage}%`, color: "text-foreground" },
    { label: "PRESENT", value: data.present, color: "text-green-400" },
    { label: "ABSENT", value: data.absent, color: "text-red-400" },
  ];

  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      <div className="flex justify-end">
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Sync Stats
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full">
        {statsConfig.map((stat, index) => (
          <div 
            key={index} 
            className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between aspect-square transition-all  shadow-sm"
          >
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
              {stat.label}
            </span>
            <span className={cn("text-2xl font-bold tracking-tight", stat.color)}>
              {loading ? "..." : stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}