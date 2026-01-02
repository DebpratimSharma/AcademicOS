"use client";

import * as React from "react";
import { Plus, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// We need dateStr (e.g., "2025-12-31") so the DB knows WHICH day this extra class belongs to
export function AddSubstituteDialog({ dateStr }: { dateStr: string;}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget; // Reference the form
    const formData = new FormData(form);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const weightValue = parseInt(formData.get("weight") as string) || 1;

    const { error } = await supabase.from("extra_sessions").insert({
      user_id: user?.id,
      subject_name: formData.get("subject"),
      date: dateStr,
      start_time: formData.get("start"),
      end_time: formData.get("end"),
      weight: weightValue, // Scheduled weight (Denominator)
      actual_weight: weightValue, // Default received weight (Numerator)
    });

    if (!error) {
      toast.success(`Substituted class added for ${dateStr}`);
      setOpen(false);
      form.reset(); // Clear the form for next time

      // ENSURE THIS MATCHES YOUR OTHER FILES
      window.dispatchEvent(new Event("attendanceUpdated"));
      router.refresh();
    } else {
      toast.error("Error adding substitute");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="rounded-full shadow-lg bg-card text-secondary-foreground hover:bg-secondary/90 gap-2 border border-border">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Substitute
                </span>
              </Button>
      </DrawerTrigger>
      <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] md:px-10 lg:w-[60%] lg:px-15 xl:w-[50%]">
        <div className="mx-auto w-full overflow-y-auto ">
          <DrawerHeader>
            <DrawerTitle>Substitute Class</DrawerTitle>
            <DrawerDescription>
              This class will only appear for this specific date.
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-4">
            <Input
              name="subject"
              placeholder="Subject Name"
              required
              className="py-6 rounded-lg"
            />

            <div className="space-y-2">
              <span className=" text-[10px] font-bold text-muted-foreground uppercase ml-1">
                Weightage
              </span>
              <Input
                name="weight"
                type="number"
                min="1"
                max="5"
                defaultValue="1"
                required
                className="py-6 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Start time</span>
              <span>End time</span>
              <Input name="start" type="time" required className="rounded-lg" />
              <Input name="end" type="time" required className="rounded-lg" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-lg font-bold mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Substitution"
              )}
            </Button>
          </form>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
