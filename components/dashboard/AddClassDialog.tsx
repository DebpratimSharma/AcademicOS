"use client";

import * as React from "react";
import { Zap, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Capture the weight from the form (convert string to number)
    const weightValue = parseInt(formData.get("weight") as string) || 1;

    const { error } = await supabase.from("routines").insert({
      user_id: user?.id,
      subject_name: formData.get("subject"),
      day_of_week: activeDay,
      start_time: formData.get("start"),
      end_time: formData.get("end"),
      room_number: formData.get("room"),
      weight: weightValue, // Save the weight here
    });

    if (!error) {
      toast.success(`Added to ${activeDay}`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Failed to add class");
    }
    setLoading(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="rounded-full p-7  shadow-lg bg-secondary text-foreground hover:bg-muted gap-2 border border-border">
          <Plus className="h-4 w-4" />
          <span className="text-md mr-4 font-bold uppercase tracking-wider">
            Regular Class
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-5 md:mx-50 md:px-20  max-h-[96%] mx-5 border">
        <div className="flex-1 overflow-y-auto py-4">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold text-foreground">
              New Class for {activeDay}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Enter schedule details below.
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Input
              name="subject"
              placeholder="Subject Name"
              required
              className="bg-input border-input rounded-lg py-6"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Class Weightage (Credits)
              </label>
              <Input
                name="weight" // Changed from register to name
                type="number"
                min="1"
                max="5"
                defaultValue="1"
                required
                className="bg-input border-input rounded-lg py-6"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Start time</span>
              <span>End time</span>
              <Input
                name="start"
                type="time"
                placeholder="Start time"
                required
                className="bg-input border-input rounded-lg"
              />
              <Input
                name="end"
                type="time"
                placeholder="End time"
                required
                className="bg-input border-input rounded-lg"
              />
            </div>

            <Input
              name="room"
              placeholder="Room Number"
              className="bg-input border-input rounded-lg py-6"
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
