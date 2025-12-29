"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Coffee, Trash2, Plus, Info } from "lucide-react";
import { toast } from "sonner";
import { AddClassDialog } from "@/components/dashboard/AddClassDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { EditClassDialog } from "@/components/dashboard/EditClassDialog";
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
  const now = new Date();
  const todayIndex = now.getDay();
  const todayName = DAYS[todayIndex];
  const router = useRouter();
  const supabase = createClient();

  const sortedDays = [...workingDays].sort(
    (a, b) => DAYS.indexOf(a) - DAYS.indexOf(b)
  );
  const defaultTab = sortedDays.includes(todayName) ? todayName : sortedDays[0];

  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const getCalculatedDate = (targetDayName: string) => {
    const targetIndex = DAYS.indexOf(targetDayName);
    const diff = targetIndex - todayIndex;
    const resultDate = new Date(now);
    resultDate.setDate(now.getDate() + diff);
    const y = resultDate.getFullYear();
    const m = String(resultDate.getMonth() + 1).padStart(2, "0");
    const d = String(resultDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (!error) {
      toast.error("Class deleted");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-[60vh]">
      <Tabs
        defaultValue={defaultTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-transparent w-full p-1 flex flex-wrap h-auto mb-6 gap-2">
          {sortedDays.map((day) => {
            const dateStr = getCalculatedDate(day);
            const isHoliday = holidays.includes(dateStr);

            return (
              <TabsTrigger
                key={day}
                value={day}
                className="rounded-full  py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2 italic">
                  {day.substring(0, 3)}
                  {isHoliday && (
                    <div className="w-1 h-1 bg-destructive rounded-full" />
                  )}
                </div>
              </TabsTrigger>
            );
          })}
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
              {/* HOLIDAY BANNER (Shows at the top if it's a holiday) */}
              {isHoliday && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
                  <Coffee className="h-5 w-5 shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold">Holiday Alert:</span> No classes
                    officially scheduled for {dateStr}.
                  </div>
                </div>
              )}

              {/* ROUTINE LIST WITH TIMELINE */}
{classesForThisDay.length > 0 ? (
  <div className="relative ml-4 border-l-2 border-border pl-8 pb-4 space-y-6">
    {classesForThisDay.map((item, index) => (
      <div key={item.id} className="relative">
        
        {/* THE NODE (The Dot on the line) */}
        <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10" />
        
        {/* THE CARD */}
        <div className="group bg-card border border-border p-5 rounded-2xl relative hover:border-primary transition-all">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-card-foreground uppercase tracking-wider mb-1">
                <span>{item.start_time.slice(0, 5)}</span>
                <span>—</span>
                <span>{item.end_time.slice(0, 5)}</span>
                <span className="text-card-foreground mx-1">|</span>
                <span className="text-card-foreground">{item.room_number || "N/A"}</span>
              </div>
              
              <h4 className="text-lg font-bold text-foreground tracking-tight italic">
                {item.subject_name}
              </h4>
              
              {/* Optional: Add a placeholder for Professor name if you add that to DB later */}
              <p className="text-sm text-muted-foreground">Scheduled Session</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-1">
              <EditClassDialog item={item} />
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-20 border border-dashed border-foreground rounded-3xl">
    <p className="text-muted-foreground italic">No classes scheduled</p>
  </div>
)}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddClassDialog activeDay={activeTab} />
      </div>
    </div>
  );
}
