"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Trash2,
  Save,
  Loader2,
  CircleChevronRight,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function HolidayDrawer({
  customTrigger,
}: {
  customTrigger?: React.ReactNode;
}) {
  const router = useRouter();

  const [date, setDate] = React.useState<Date>();

  const [holidays, setHolidays] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState(false);

  const supabase = createClient();

  // Fetch holidays for the LOGGED-IN user

  const fetchHolidays = React.useCallback(async () => {
    const { data } = await supabase

      .from("holidays")

      .select("holiday_date");

    // RLS will automatically filter these by user_id

    if (data) setHolidays(data.map((h) => h.holiday_date));
  }, [supabase]);

  React.useEffect(() => {
    setDate(new Date());

    fetchHolidays();
  }, [fetchHolidays]);

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : null;

  const isAlreadyHoliday = selectedDateStr
    ? holidays.includes(selectedDateStr)
    : false;

  const handleSave = async () => {
    if (!selectedDateStr) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase

      .from("holidays")

      .insert([
        {
          holiday_date: selectedDateStr,

          user_id: user?.id, // Explicitly set user_id
        },
      ]);

    if (!error) {
      setHolidays((prev) => [...prev, selectedDateStr]);

      toast.success("Holiday added");

      // Notify other components to disable buttons

      window.dispatchEvent(new Event("attendanceUpdated"));

      router.refresh();
    } else {
      toast.error("Failed to save holiday");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedDateStr) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase

      .from("holidays")

      .delete()

      .eq("holiday_date", selectedDateStr)

      .eq("user_id", user?.id); // Safety check

    if (!error) {
      setHolidays((prev) => prev.filter((h) => h !== selectedDateStr));

      toast.error("Holiday removed");

      // Notify other components to re-enable buttons

      window.dispatchEvent(new Event("attendanceUpdated"));

      router.refresh();
    } else {
      toast.error("Failed to remove holiday");
    }

    setLoading(false);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {customTrigger || (
          <Button variant="ghost" className="w-full justify-start py-1.5">
            <CalendarIcon size={18} />

            <span>Add Holidays</span>

            <CircleChevronRight className="md:hidden ml-auto h-4 w-4 text-accent-foreground" />
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] md:px-10 lg:w-[60%] lg:px-15 xl:w-[50%]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl font-bold italic">
              Manage Holidays
            </DrawerTitle>
          </DrawerHeader>

          
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiers={{
                holiday: (d) => holidays.includes(format(d, "yyyy-MM-dd")),
              }}
              modifiersClassNames={{
                holiday:
                  "bg-destructive/20 text-destructive font-black rounded-md",
              }}
            />
          

          <div className="flex flex-col px-5 gap-3">
            {isAlreadyHoliday ? (
              <Button
                variant="destructive"
                className="w-full py-6 rounded-xl gap-2 font-bold shadow-lg shadow-destructive/20"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                Remove Holiday
              </Button>
            ) : (
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
                onClick={handleSave}
                disabled={loading || !date}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Mark as Holiday
              </Button>
            )}

            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-muted rounded-xl"
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
