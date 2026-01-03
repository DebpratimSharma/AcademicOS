"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function AddClassDialog({ activeDay }: { activeDay: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Helper to get local date string YYYY-MM-DD without ISO/Hydration issues
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    const weightValue = parseInt(formData.get("weight") as string) || 1;
    const today = getLocalDateString();

    const { error } = await supabase.from("routines").insert({
      user_id: user?.id,
      subject_name: formData.get("subject"),
      day_of_week: activeDay,
      start_time: formData.get("start"),
      end_time: formData.get("end"),
      room_number: formData.get("room"),
      weight: weightValue,
      // --- New Temporal Fields ---
      status: 'active',
      start_date: today, // Initializes the routine from today onwards
      end_date: null,    // Remains active indefinitely
      subject_code: formData.get("subject_code")
    });

    if (!error) {
      toast.success(`Added to ${activeDay}`);
      setOpen(false);
      router.refresh();
    } else {
      console.error(error);
      toast.error("Failed to add class");
    }
    setLoading(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="p-7 rounded-full shadow-lg bg-card text-secondary-foreground hover:bg-secondary/90 gap-2 border border-border">
          <Plus className="h-4 w-4" />
          <span className="text-md mr-4 font-bold uppercase tracking-wider">
            Regular Class
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] md:px-10 lg:w-[60%] lg:px-15 xl:w-[50%]">
        <div className="flex-1 overflow-y-auto py-4">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold text-foreground">
              New Class for {activeDay}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Enter schedule details. This class will start appearing in the routine from today.
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Input
              name="subject"
              placeholder="Subject Name"
              required
              className="border-input rounded-lg py-6"
            />
            <Input
              name="subject_code"
              placeholder="Subject Code"
              required
              className="border-input rounded-lg py-6"
            />
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Class Weightage (Credits)
              </label>
              <Input
                name="weight"
                type="number"
                min="1"
                max="5"
                defaultValue="1"
                required
                className="border-input rounded-lg py-6"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Start Time</span>
                <Input
                  name="start"
                  type="time"
                  required
                  className="border-input rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">End Time</span>
                <Input
                  name="end"
                  type="time"
                  required
                  className="border-input rounded-lg"
                />
              </div>
            </div>

            <Input
              name="room"
              placeholder="Room Number"
              className="border-input rounded-lg py-6"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-6 rounded-lg font-bold"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                "Save Class"
              )}
            </Button>
          </form>

          <DrawerFooter className="sm:justify-start">
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-muted-foreground">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}