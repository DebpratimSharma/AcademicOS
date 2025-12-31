"use client";

import * as React from "react";
import {
  Trash2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { EditClassDialog } from "@/components/dashboard/EditClassDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ClassCard({
  item,
  dateStr,
  onDelete,
}: {
  item: any;
  dateStr: string;
  onDelete: (id: string) => void;
}) {
  const [actualWeight, setActualWeight] = React.useState(item.weight);
  const [loading, setLoading] = React.useState(false);
  const [attendance, setAttendance] = React.useState<string | null>(null);
  const supabase = createClient();

  // Fetch initial attendance for this specific date
  React.useEffect(() => {
    const fetchAttendance = async () => {
      const { data } = await supabase
        .from("attendance")
        .select("status, actual_weight")
        .eq("routine_id", item.id)
        .eq("date", dateStr)
        .maybeSingle();
        
      if (data) {
        setAttendance(data.status);
        if(data.actual_weight!== null)
          setActualWeight(data.actual_weight);
        }
        else {
          setAttendance(null);
          setActualWeight(item.weight);
        }
    };
    fetchAttendance();
  }, [item.id, dateStr, item.weight, supabase]);

  // 1. Modified Weight Change Handler*
  const handleWeightChange = async (newWeight: number) => {
    setActualWeight(newWeight);

    // If already marked present, update the DB immediately
    if (attendance === "present") {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("attendance").upsert(
        {
          user_id: user?.id,
          routine_id: item.id,
          status: "present",
          date: dateStr,
          actual_weight: newWeight, // Use the newly selected weight
        },
        { onConflict: "routine_id, date" }
      );

      if (!error) {
        toast.success(`Weight updated to ${newWeight}`);
        // Refresh stats across the app
        window.dispatchEvent(new Event("attendanceUpdated"));
      }
      setLoading(false);
    }
  };

  const handleAttendance = async (
    status: "present" | "absent" | "dismissed"
  ) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const weightToSubmit = status === "present" ? actualWeight : 0;

    const { error } = await supabase.from("attendance").upsert(
      {
        user_id: user?.id,
        routine_id: item.id,
        status,
        date: dateStr,
        actual_weight: weightToSubmit, // This is the 'punishment-aware' value
      },
      { onConflict: "routine_id, date" }
    );

    if (!error) {
      setAttendance(status);
      toast.success(`Marked as ${status}`);

      window.dispatchEvent(new Event("attendanceUpdated"));
    } else {
      toast.error("Failed to save attendance");
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* THE NODE (The Dot on the line) */}
      <div
        className={cn(
          "absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 z-10 transition-colors",
          attendance === "present"
            ? "border-green-500 bg-green-500 shadow-2xl shadow-green-900"
            : attendance === "absent"
            ? "border-destructive bg-destructive"
            : "border-primary"
        )}
      />

      <div className="group bg-card border border-border p-5 rounded-2xl relative hover:border-primary transition-all shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              <span>
                {item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)}
              </span>
              <span className="mx-1">|</span>
              <span>Room {item.room_number || "N/A"}</span>
            </div>
            <h4 className="text-lg font-bold text-foreground italic">
              {item.subject_name}
            </h4>

            {/* ATTENDANCE ICONS */}
            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost"
                size="icon"
                disabled={loading}
                onClick={() => handleAttendance("present")}
                className={cn(
                  "rounded-full h-8 w-8",
                  attendance === "present"
                    ? "text-green-500 bg-green-500/10"
                    : "text-muted-foreground"
                )}
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={loading}
                onClick={() => handleAttendance("absent")}
                className={cn(
                  "rounded-full h-8 w-8",
                  attendance === "absent"
                    ? "text-destructive bg-destructive/10"
                    : "text-muted-foreground"
                )}
              >
                <XCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={loading}
                onClick={() => handleAttendance("dismissed")}
                className={cn(
                  "rounded-full h-8 w-8",
                  attendance === "dismissed"
                    ? "text-foreground bg-muted-foreground/20"
                    : "text-muted-foreground"
                )}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
              )}
            </div>
          </div>
          {item.weight > 1 && (
            <div className="mt-3 flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/50">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Weightage Received
              </div>
              <div className="flex gap-1">
                {[...Array(item.weight)].map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      key={val}
                      disabled={loading}
                      onClick={() => handleWeightChange(val)} // TRIGGER DB UPDATE
                      className={cn(
                        "px-2 py-1 text-xs font-bold rounded-md transition-all",
                        actualWeight === val
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80",
                        loading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
