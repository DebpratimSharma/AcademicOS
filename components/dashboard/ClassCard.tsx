"use client";

import * as React from "react";
import {
  Trash2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { EditClassDialog } from "@/components/dashboard/EditClassDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ClassCard({
  item,
  dateStr,
  onDelete,
  isExtra = false,
  isHoliday = false,
}: {
  item: any;
  dateStr: string;
  onDelete: (id: string) => void;
  isExtra?: boolean;
  isHoliday?: boolean;
}) {
  const [actualWeight, setActualWeight] = React.useState(
    isExtra ? item.actual_weight ?? item.weight : item.weight
  );
  const [loading, setLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [attendance, setAttendance] = React.useState<string | null>(
    isExtra ? item.status : null
  );

  const supabase = createClient();

  React.useEffect(() => {
    if (isExtra) {
      setAttendance(item.status);
      setActualWeight(item.actual_weight ?? item.weight);
      return;
    }

    const fetchAttendance = async () => {
      const { data } = await supabase
        .from("attendance")
        .select("status, actual_weight")
        .eq("routine_id", item.id)
        .eq("date", dateStr)
        .maybeSingle();

      if (data) {
        setAttendance(data.status);
        if (data.actual_weight !== null) setActualWeight(data.actual_weight);
      } else {
        setAttendance(null);
        setActualWeight(item.weight);
      }
    };
    fetchAttendance();
  }, [
    item.id,
    dateStr,
    item.weight,
    item.status,
    item.actual_weight,
    supabase,
    isExtra,
  ]);

  const handleWeightChange = async (newWeight: number) => {
    if (attendance !== "present") return;
    setActualWeight(newWeight);
    setLoading(true);

    if (isExtra) {
      await supabase
        .from("extra_sessions")
        .update({ actual_weight: newWeight })
        .eq("id", item.id);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("attendance").upsert(
        {
          user_id: user?.id,
          routine_id: item.id,
          status: "present",
          date: dateStr,
          actual_weight: newWeight,
        },
        { onConflict: "routine_id, date" }
      );
    }

    toast.success("Weight updated");
    window.dispatchEvent(new Event("attendanceUpdated"));
    setLoading(false);
  };

  const handleAttendance = async (
    status: "present" | "absent" | "dismissed"
  ) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const weightToSubmit = status === "present" ? actualWeight : 0;

    let error;
    if (isExtra) {
      const { error: err } = await supabase
        .from("extra_sessions")
        .update({
          status,
          actual_weight: weightToSubmit,
        })
        .eq("id", item.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("attendance").upsert(
        {
          user_id: user?.id,
          routine_id: item.id,
          status,
          date: dateStr,
          actual_weight: weightToSubmit,
        },
        { onConflict: "routine_id, date" }
      );
      error = err;
    }

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
      <div
        className={cn(
          "absolute -left-10.25 md:-left-14.25 lg:-left-18.25 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 z-10 transition-colors",
          attendance === "present"
            ? "border-green-500 bg-green-500 shadow-2xl shadow-green-900"
            : attendance === "absent"
            ? "border-destructive bg-destructive"
            : "border-primary"
        )}
      />

      <div
        className={cn(
          "group bg-card border p-5 rounded-lg relative transition-all shadow-sm",
          isExtra
            ? "border-dashed border-primary/40 bg-primary/2"
            : "border-border hover:border-primary"
        )}
      >
        {isExtra && (
          <div className="absolute -top-3 left-4 bg-primary text-[10px] font-black text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter italic">
            Extra Session
          </div>
        )}
        <div className="flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex ml-1 items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              <span>
                {item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)}
              </span>
              {item.room_number && (
                <>
                  <span className="mx-1">|</span>
                  <span>Room {item.room_number}</span>
                </>
              )}
            </div>
            <h4 className="text-lg ml-1 font-bold text-foreground italic">
              {item.subject_name}
            </h4>
            <h5 className="text-sm ml-1 font-thin text-foreground/70">
              {item.subject_code}
            </h5>

            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost"
                size="icon"
                disabled={loading || isHoliday}
                onClick={() => handleAttendance("present")}
                className={cn(
                  "rounded-full",
                  attendance === "present"
                    ? "text-green-500 bg-green-500/10"
                    : "text-muted-foreground"
                )}
              >
                <CheckCircle2 className="scale-150" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={loading || isHoliday}
                onClick={() => handleAttendance("absent")}
                className={cn(
                  "rounded-full",
                  attendance === "absent"
                    ? "text-destructive bg-destructive/10"
                    : "text-muted-foreground"
                )}
              >
                <XCircle className="scale-150" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={loading || isHoliday}
                onClick={() => handleAttendance("dismissed")}
                className={cn(
                  "rounded-full",
                  attendance === "dismissed"
                    ? "text-foreground bg-muted-foreground/20"
                    : "text-muted-foreground"
                )}
              >
                <MinusCircle className="scale-150" />
              </Button>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
              )}
              <div className="flex w-full items-center justify-end  gap-1 self-end">
                {item.weight > 1 && (
                  <div className="hidden self-center w-full  md:flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/50">
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
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Weightage Received
                    </div>
                  </div>
                )}
                <EditClassDialog item={item} />
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
            </div>

            {item.weight > 1 && (
                  <div className="md:hidden self-center w-full flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/50">
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
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Weightage Received
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION ALERT */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="w-[95%] rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Permanent Delete</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              This will remove this class and **all its attendance records**
              from your entire history.
              <br />
              <br />
              If you only want to stop this class from appearing in the future,
              use{" "}
              <span className="font-bold italic text-primary">
                "New Routine"
              </span>{" "}
              instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2">
            <AlertDialogAction
              onClick={() => {
                onDelete(item.id);
                setShowDeleteConfirm(false);
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Permanently
            </AlertDialogAction>
            <AlertDialogCancel>Keep Class</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
