"use client";

import * as React from "react";
import { Trash2, CheckCircle2, XCircle, MinusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { EditClassDialog } from "@/components/dashboard/EditClassDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ClassCard({ item, dateStr, onDelete }: { item: any, dateStr: string, onDelete: (id: string) => void }) {
  const [loading, setLoading] = React.useState(false);
  const [attendance, setAttendance] = React.useState<string | null>(null);
  const supabase = createClient();

  // Fetch initial attendance for this specific date
  React.useEffect(() => {
    const fetchAttendance = async () => {
      const { data } = await supabase
        .from("attendance")
        .select("status")
        .eq("routine_id", item.id)
        .eq("date", dateStr)
        .single();
      if (data) setAttendance(data.status);
    };
    fetchAttendance();
  }, [item.id, dateStr]);

  const handleAttendance = async (status: 'present' | 'absent' | 'dismissed') => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("attendance")
      .upsert({
        user_id: user?.id,
        routine_id: item.id,
        status,
        date: dateStr,
      }, { onConflict: 'routine_id, date' });

    if (!error) {
      setAttendance(status);
      toast.success(`Marked as ${status}`);

      window.dispatchEvent(new Event('attendanceUpdated'));
    } else {
      toast.error("Failed to save attendance");
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* THE NODE (The Dot on the line) */}
      <div className={cn(
        "absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 z-10 transition-colors",
        attendance === 'present' ? "border-green-500 bg-green-500" : 
        attendance === 'absent' ? "border-destructive bg-destructive" : "border-primary"
      )} />

      <div className="group bg-card border border-border p-5 rounded-2xl relative hover:border-primary transition-all shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              <span>{item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)}</span>
              <span className="mx-1">|</span>
              <span>Room {item.room_number || "N/A"}</span>
            </div>
            <h4 className="text-lg font-bold text-foreground italic">{item.subject_name}</h4>
            
            {/* ATTENDANCE ICONS */}
            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost" size="icon"
                disabled={loading}
                onClick={() => handleAttendance('present')}
                className={cn("rounded-full h-8 w-8", attendance === 'present' ? "text-green-500 bg-green-500/10" : "text-muted-foreground")}
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                disabled={loading}
                onClick={() => handleAttendance('absent')}
                className={cn("rounded-full h-8 w-8", attendance === 'absent' ? "text-destructive bg-destructive/10" : "text-muted-foreground")}
              >
                <XCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                disabled={loading}
                onClick={() => handleAttendance('dismissed')}
                className={cn("rounded-full h-8 w-8", attendance === 'dismissed' ? "text-blue-500 bg-blue-500/10" : "text-muted-foreground")}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
            </div>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-center">
            <EditClassDialog item={item} />
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}