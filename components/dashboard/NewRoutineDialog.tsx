"use client";

import * as React from "react";
import { Loader2, RefreshCcw, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { archiveRoutine } from "@/app/dashboard/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function NewRoutineDialog({ activeDay }: { activeDay: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Helper to get formatted date strings safely
  const getLocalDateStrings = () => {
    const todayObj = new Date();
    const yesterdayObj = new Date();
    yesterdayObj.setDate(todayObj.getDate() - 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      today: formatDate(todayObj),
      yesterday: formatDate(yesterdayObj)
    };
  };

  async function handleArchiveOldRoutine() {
    setLoading(true);
    const { yesterday } = getLocalDateStrings();

    try {
      await archiveRoutine(activeDay, yesterday);
      toast.success(`Archived previous ${activeDay} routine`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update routine");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="p-7 rounded-full shadow-lg bg-card text-secondary-foreground hover:bg-secondary/90 gap-2 border border-border">
          <RefreshCcw className="h-4 w-4" />
          <span className="text-md mr-4 font-bold uppercase tracking-wider">
            New Routine
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] md:px-10 lg:w-[60%] lg:px-15 xl:w-[50%]">
        <div className="flex-1 overflow-y-auto py-6">
          <DrawerHeader className="items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <DrawerTitle className="text-xl font-bold text-foreground">
              Archive {activeDay}&apos;s Routine?
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground max-w-sm">
              This will end all current classes for **{activeDay}** as of yesterday. 
              The past will remain unchanged, and you can start adding a new routine for today.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border mb-6">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>• Records will be marked as <strong>archived</strong>.</li>
              <li>• End date will be set to <strong>yesterday</strong>.</li>
              <li>• New classes added after this will start <strong>today</strong>.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleArchiveOldRoutine}
              disabled={loading}
              variant="destructive"
              className="w-full py-6 rounded-lg font-bold"
              autoFocus
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                "Confirm & Archive"
              )}
            </Button>
            
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-muted-foreground py-6">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}