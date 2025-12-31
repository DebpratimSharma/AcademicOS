"use client";

import * as React from "react";
import { CheckCircle2, Circle, Loader2, Settings, CircleChevronRight  } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MASTER_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function WorkingDaysDialog() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const supabase = createClient();

  // 1. Fetch saved days from Supabase when dialog opens
  const fetchSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_settings")
      .select("working_days")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setSelectedDays(data.working_days);
    } else {
      // Default days if no settings found
      setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    }
  };

  React.useEffect(() => {
    if (open) fetchSettings();
  }, [open]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 2. Save/Sync with Cloud
  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const sortedToSave = [...selectedDays].sort(
      (a, b) => MASTER_WEEK.indexOf(a) - MASTER_WEEK.indexOf(b)
    );

    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      working_days: sortedToSave,
    });

    if (error) {
      toast.error("Failed to sync settings");
    } else {
      toast.success("Working days updated!");
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start  py-1.5">
          <Settings size={18} />
          <span>Working Days</span>
          <CircleChevronRight className="ml-auto my-auto h-4 w-4 text-accent-foreground" />

        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Working Days
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-6 text-center">
          Select the days you have classes.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-border text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center",
                    isSelected
                      ? "bg-primary-foreground border-primary-foreground"
                      : "border-border"
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 bg-primary rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium">{day}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg font-bold text-base"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
