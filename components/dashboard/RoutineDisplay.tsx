"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AddClassDialog } from "@/components/dashboard/AddClassDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ClassCard } from "./ClassCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { format } from "date-fns";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function RoutineDisplay({
  initialRoutine,
  workingDays,
  holidays,
}: {
  initialRoutine: any[];
  workingDays: string[];
  holidays: string[];
}) {
  const [overrideDate, setOverrideDate] = React.useState<Date | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. FIX: Memoize sortedDays so it doesn't trigger re-renders
  const sortedDays = React.useMemo(() => {
    return [...workingDays].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
  }, [workingDays]);

  // Logic: "Anchor" is either the selected date OR today
  const anchorDate = React.useMemo(
    () => overrideDate || new Date(),
    [overrideDate]
  );

  // 2. FIX: Determine the default tab only once on mount or when anchor changes
  const getDayName = (date: Date) => DAYS[date.getDay()];

  const [activeTab, setActiveTab] = React.useState(() => {
    const todayName = getDayName(new Date());
    return sortedDays.includes(todayName) ? todayName : sortedDays[0];
  });

  // 3. FIX: Only auto-switch tabs if the USER changes the date (overrideDate changes)
  React.useEffect(() => {
    if (overrideDate) {
      const dayName = getDayName(overrideDate);
      if (sortedDays.includes(dayName)) {
        setActiveTab(dayName);
      }
    }
  }, [overrideDate, sortedDays]);

  // DATE CALCULATOR
  const getCalculatedDate = React.useCallback(
    (targetDayName: string) => {
      const anchorDayIndex = anchorDate.getDay(); // e.g., Wednesday = 3
      const targetDayIndex = DAYS.indexOf(targetDayName); // e.g., Monday = 1

      // Calculate difference (e.g., 1 - 3 = -2 days)
      const diff = targetDayIndex - anchorDayIndex;

      const resultDate = new Date(anchorDate);
      resultDate.setDate(anchorDate.getDate() + diff);
      return resultDate.toISOString().split("T")[0];
    },
    [anchorDate]
  );

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (!error) {
      toast.error("Class deleted");
      router.refresh();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new date object to avoid reference issues
      const newDate = new Date(date);
      setOverrideDate(newDate);
      toast.success(`Jumped to ${format(newDate, "PPP")}`);
    }
  };

  const clearOverride = () => {
    setOverrideDate(null);
    // Optional: Snap back to "Today" tab when clearing
    const todayName = getDayName(new Date());
    if (sortedDays.includes(todayName)) setActiveTab(todayName);
    toast.info("Back to present day");
  };

  return (
    <div className="relative min-h-[60vh] flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-1"
      >
        <TabsList className="bg-transparent w-full p-1 flex flex-wrap h-auto mb-6 gap-2">
          {sortedDays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <div className="flex items-center gap-2 italic">
                {day.substring(0, 3)}
                {holidays.includes(getCalculatedDate(day)) && (
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedDays.map((day) => {
          const dateStr = getCalculatedDate(day);
          const isHoliday = holidays.includes(dateStr);
          const classesForThisDay = initialRoutine.filter(
            (r) => r.day_of_week === day
          );

          return (
            <TabsContent
              key={day}
              value={day}
              className="outline-none pb-24 space-y-4"
            >
              {overrideDate && (
                <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground uppercase tracking-widest border border-dashed border-border">
                  <History className="h-3 w-3" />
                  Viewing: {format(new Date(dateStr), "MMMM do, yyyy")}
                </div>
              )}

              {isHoliday && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
                  <Coffee className="h-5 w-5 shrink-0" />
                  <div className="text-sm italic">
                    <span className="font-bold">Holiday:</span> Enjoy your
                    break!
                  </div>
                </div>
              )}

              {classesForThisDay.length > 0 ? (
                <div className="relative ml-4 border-l-2 border-border pl-8 pb-4 space-y-6">
                  {classesForThisDay.map((item) => (
                    <ClassCard
                      key={item.id}
                      item={item}
                      dateStr={dateStr}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-3xl text-muted-foreground italic">
                  No classes scheduled
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="py-6 mt-auto border-t border-border/50">
        {overrideDate ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              onClick={clearOverride}
            >
              <RotateCcw className="h-4 w-4" />
              Continue with default week
            </Button>
          </div>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-dashed border-border"
              >
                <History className="h-4 w-4" />
                Missed to mark your attendance? Jump to date
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Select a Date</DrawerTitle>
                  <DrawerDescription>
                    Pick a date from the past to mark missed attendance.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={overrideDate || new Date()}
                    onSelect={handleDateSelect}
                    // This disables future dates AND days not in sortedDays
                    disabled={(date) =>
                      date > new Date() ||
                      !sortedDays.includes(getDayName(date))
                    }
                    initialFocus
                    className="rounded-md border"
                  />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <AddClassDialog activeDay={activeTab} />
      </div>
    </div>
  );
}
