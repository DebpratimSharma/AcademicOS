"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, History, RotateCcw, Zap, Plus } from "lucide-react";
import { toast } from "sonner";
import { AddClassDialog } from "@/components/dashboard/AddClassDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ClassCard } from "./ClassCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AddSubstituteDialog } from "./AddSubstitueDialog";
import { cn } from "@/lib/utils";

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
  holidays: serverHolidays, // Renamed for clarity
}: {
  initialRoutine: any[];
  workingDays: string[];
  holidays: string[];
}) {
  const [overrideDate, setOverrideDate] = React.useState<Date | null>(null);
  const [extraSessions, setExtraSessions] = React.useState<any[]>([]);
  const [localHolidays, setLocalHolidays] = React.useState<string[]>(serverHolidays); // NEW: Local state for reactivity
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const sortedDays = React.useMemo(() => {
    return [...workingDays].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
  }, [workingDays]);

  const anchorDate = React.useMemo(
    () => overrideDate || new Date(),
    [overrideDate]
  );
  const getDayName = (date: Date) => DAYS[date.getDay()];

  const [activeTab, setActiveTab] = React.useState(() => {
    const todayName = getDayName(new Date());
    return sortedDays.includes(todayName) ? todayName : sortedDays[0];
  });

  // DATE CALCULATOR
  const getCalculatedDate = React.useCallback(
    (targetDayName: string) => {
      const anchorDayIndex = anchorDate.getDay();
      const targetDayIndex = DAYS.indexOf(targetDayName);
      const diff = targetDayIndex - anchorDayIndex;
      const resultDate = new Date(anchorDate);
      resultDate.setDate(anchorDate.getDate() + diff);
      return format(resultDate, "yyyy-MM-dd");
    },
    [anchorDate]
  );

  // FETCH HOLIDAYS (NEW: For real-time updates)
  const fetchHolidays = React.useCallback(async () => {
    const { data } = await supabase
      .from("holidays")
      .select("holiday_date");
    if (data) setLocalHolidays(data.map(h => h.holiday_date));
  }, [supabase]);

  // FETCH EXTRAS
  const fetchExtras = React.useCallback(async () => {
    const currentDateStr = getCalculatedDate(activeTab);
    const { data } = await supabase
      .from("extra_sessions")
      .select("*")
      .eq("date", currentDateStr);

    if (data) setExtraSessions(data);
  }, [activeTab, getCalculatedDate, supabase]);

  React.useEffect(() => {
    fetchExtras();

    // Listen for events to refresh both extras and holidays
    const handleRefresh = () => {
      fetchExtras();
      fetchHolidays();
    };
    
    window.addEventListener("attendanceUpdated", handleRefresh);
    return () => window.removeEventListener("attendanceUpdated", handleRefresh);
  }, [fetchExtras, fetchHolidays]);

  React.useEffect(() => {
    if (overrideDate) {
      const dayName = getDayName(overrideDate);
      if (sortedDays.includes(dayName)) setActiveTab(dayName);
    }
  }, [overrideDate, sortedDays]);

  const handleDelete = async (id: string, isExtra: boolean = false) => {
    const table = isExtra ? "extra_sessions" : "routines";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      toast.error(isExtra ? "Substitute removed" : "Class deleted");
      window.dispatchEvent(new Event("attendanceUpdated"));
      isExtra ? fetchExtras() : router.refresh();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setOverrideDate(new Date(date));
      toast.success(`Jumped to ${format(date, "PPP")}`);
    }
  };

  const clearOverride = () => {
    setOverrideDate(null);
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
        <TabsList className="bg-transparent w-full p-1 flex flex-wrap md:flex-nowrap md:justify-center mb-6 gap-2">
          {sortedDays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="rounded-full py-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:text-lg transition-all lg:px-6"
            >
              <div className="flex items-center gap-2 italic">
                {<span className="md:hidden">{day.substring(0, 3)}</span>}
                <span className="hidden md:inline-block">{day}</span>
                <div className="flex gap-1">
                  {getCalculatedDate(day) === format(new Date(), "yyyy-MM-dd") && (
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                )}
                {/* Updated to use localHolidays state */}
                {localHolidays.includes(getCalculatedDate(day)) && (
                  <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
                )}

                </div>
                
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedDays.map((day) => {
          const dateStr = getCalculatedDate(day);
          const isHoliday = localHolidays.includes(dateStr); // Updated to use localHolidays
          const classesForThisDay = initialRoutine.filter(
            (r) => r.day_of_week === day
          );

          return (
            <TabsContent
              key={day}
              value={day}
              className="outline-none space-y-4 md:space-y-6"
            >
              {overrideDate && (
                <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 rounded-lg text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-widest border border-dashed border-border">
                  <History className="h-3 w-3" />
                  Viewing: {format(new Date(dateStr), "MMMM do, yyyy")}
                </div>
              )}

              {isHoliday && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <Coffee className="h-5 w-5 shrink-0" />
                  <div className="text-sm md:text-base italic">
                    <span className="font-bold">Holiday:</span> Enjoy your
                    break!
                  </div>
                </div>
              )}

              <div className="relative ml-4 md:ml-8 lg:ml-12 border-l-2 border-border pl-8 md:pl-12 lg:pl-16 space-y-6 md:space-y-8">
                {/* 1. RENDER REGULAR CLASSES */}
                {classesForThisDay.map((item) => (
                  <ClassCard
                    key={item.id}
                    isHoliday={isHoliday}
                    item={item}
                    dateStr={dateStr}
                    onDelete={(id) => handleDelete(id, false)}
                  />
                ))}

                {/* 2. RENDER SUBSTITUTE CLASSES */}
                {extraSessions
                  .filter((extra) => extra.date === dateStr)
                  .map((extra) => (
                    <ClassCard
                      key={extra.id}
                      item={extra}
                      dateStr={dateStr}
                      onDelete={(id) => handleDelete(id, true)}
                      isExtra={true}
                      isHoliday={isHoliday}
                    />
                  ))}

                {classesForThisDay.length === 0 &&
                  extraSessions.filter((e) => e.date === dateStr).length ===
                    0 && (
                    <div className="text-center py-10 -ml-8 md:-ml-12 lg:-ml-16 text-muted-foreground italic">
                      No classes scheduled
                    </div>
                  )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* FOOTER & CALENDAR DRAWER */}
      <div className="py-6 mt-auto border-t border-border/50 lg:px-12">
        {overrideDate ? (
          <Button
            variant="secondary"
            className="w-full max-lg mx-auto flex items-center justify-center gap-2 h-12 rounded-lg"
            onClick={clearOverride}
          >
            <RotateCcw className="h-4 w-4" /> Continue with default week
          </Button>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="w-full mx-auto h-12 rounded-lg border border-dashed border-border text-muted-foreground"
              >
                <History className="h-4 w-4 mr-2" />Forgot to mark? Jump to date
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-5 pb-20 md:mx-20 lg:mx-50 border p-5 pt-0">
              <div className="overflow-y-auto mx-auto">
                <DrawerHeader>
                  <DrawerTitle>Jump to date</DrawerTitle>
                </DrawerHeader>

                <Calendar
                  mode="single"
                  className="mx-auto px-10 mb-16 w-full"
                  selected={overrideDate || new Date()}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date > new Date() || !sortedDays.includes(getDayName(date))
                  }
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      
      {/* FLOATING SPEED DIAL */}
      <div className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-3">
        <div
          className={cn(
            "transition-all duration-300 transform",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0 pointer-events-none"
          )}
        >
          <AddSubstituteDialog dateStr={getCalculatedDate(activeTab)} />
        </div>

        <div
          className={cn(
            "transition-all duration-300 delay-[50ms] transform",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0 pointer-events-none"
          )}
        >
          <AddClassDialog activeDay={activeTab} />
        </div>

        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            isMenuOpen
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          <Plus
            className={cn(
              "h-6 w-6 transition-transform duration-300",
              isMenuOpen ? "rotate-45" : "rotate-0"
            )}
          />
        </Button>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/20 backdrop-blur-[2px] z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}