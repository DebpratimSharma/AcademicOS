"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee } from "lucide-react";
import { toast } from "sonner";
import { AddClassDialog } from "@/components/dashboard/AddClassDialog";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ClassCard } from "./ClassCard"; // Import our new component

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RoutineDisplay({ initialRoutine, workingDays, holidays }: {
  initialRoutine: any[];
  workingDays: string[];
  holidays: string[];
}) {
  const now = new Date();
  const todayIndex = now.getDay();
  const todayName = DAYS[todayIndex];
  const router = useRouter();
  const supabase = createClient();

  const sortedDays = [...workingDays].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
  const defaultTab = sortedDays.includes(todayName) ? todayName : sortedDays[0];
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const getCalculatedDate = (targetDayName: string) => {
    const targetIndex = DAYS.indexOf(targetDayName);
    const diff = targetIndex - todayIndex;
    const resultDate = new Date(now);
    resultDate.setDate(now.getDate() + diff);
    return resultDate.toISOString().split('T')[0];
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
      <Tabs defaultValue={defaultTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent w-full p-1 flex flex-wrap h-auto mb-6 gap-2">
          {sortedDays.map((day) => (
            <TabsTrigger key={day} value={day} className="rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2 italic">
                {day.substring(0, 3)}
                {holidays.includes(getCalculatedDate(day)) && <div className="w-1 h-1 bg-destructive rounded-full" />}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedDays.map((day) => {
          const dateStr = getCalculatedDate(day);
          const isHoliday = holidays.includes(dateStr);
          const classesForThisDay = initialRoutine.filter((r) => r.day_of_week === day);

          return (
            <TabsContent key={day} value={day} className="outline-none pb-24 space-y-4">
              {isHoliday && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
                  <Coffee className="h-5 w-5 shrink-0" />
                  <div className="text-sm italic"><span className="font-bold">Holiday:</span> Enjoy your break!</div>
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

      <div className="fixed bottom-8 right-8 z-50">
        <AddClassDialog activeDay={activeTab} />
      </div>
    </div>
  );
}