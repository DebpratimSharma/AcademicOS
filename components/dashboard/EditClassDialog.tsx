"use client";

import * as React from "react";
import { Pencil, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditClassDialog({ item }: { item: any }) {
  const [open, setOpen] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const router = useRouter();
  const supabase = createClient();
  const isSubstitute = item.hasOwnProperty("date");

  // This handles the actual database call
  async function executeUpdate() {
    if (!formRef.current) return;
    setLoading(true);
    const formData = new FormData(formRef.current);

    let error;
    if (isSubstitute) {
      const result = await supabase
        .from("extra_sessions")
        .update({
          subject_name: formData.get("subject"),
          start_time: formData.get("start"),
          end_time: formData.get("end"),
          weight: parseInt(formData.get("weight") as string),
          actual_weight: parseInt(formData.get("weight") as string),
        })
        .eq("id", item.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("routines")
        .update({
          subject_name: formData.get("subject"),
          start_time: formData.get("start"),
          end_time: formData.get("end"),
          room_number: formData.get("room"),
          weight: parseInt(formData.get("weight") as string),
          subject_code: formData.get("subject_code"),
        })
        .eq("id", item.id);
      error = result.error;
    }

    if (!error) {
      toast.success(isSubstitute ? "Correction applied" : "Master record updated");
      setOpen(false);
      setShowConfirm(false);
      router.refresh();
      window.dispatchEvent(new Event("attendanceUpdated"));
    } else {
      toast.error("Update failed");
    }
    setLoading(false);
  }

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    // Only show alert for regular routines, substitutes are unique anyway
    if (!isSubstitute) {
      setShowConfirm(true);
    } else {
      executeUpdate();
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all active:scale-90">
            <Pencil className="w-4 h-4" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] lg:w-[50%]">
          <div className="overflow-y-auto max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold italic">
                {isSubstitute ? "Edit Substitute" : "Correct Master Record"}
              </DrawerTitle>
            </DrawerHeader>
            
            <form ref={formRef} onSubmit={handleSubmitAttempt} className="space-y-4 mt-2 p-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Subject Info</span>
                <Input name="subject" defaultValue={item.subject_name} placeholder="Subject Name" required className="py-6" />
                {!isSubstitute && <Input name="subject_code" defaultValue={item.subject_code} placeholder="Subject Code" className="py-6" />}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Weightage (1-5)</span>
                <Input name="weight" type="number" defaultValue={item.weight || 1} min="1" max="5" required className="py-6" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Start</span>
                  <Input name="start" type="time" defaultValue={item.start_time.slice(0, 5)} required />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">End</span>
                  <Input name="end" type="time" defaultValue={item.end_time.slice(0, 5)} required />
                </div>
              </div>

              {!isSubstitute && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Location</span>
                  <Input name="room" defaultValue={item.room_number} placeholder="Room Number" className="py-6" />
                </div>
              )}

              <Button type="submit" className="w-full py-6 rounded-lg font-bold shadow-lg">
                Save Changes
              </Button>
            </form>

            <DrawerFooter className="pb-8">
              <DrawerClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* GLOBAL HISTORY ALERT */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="w-[95%] rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Global Correction Warning</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-foreground/80">
              Editing this class will change its details across your <span className="font-bold text-foreground underline">entire history</span> (past, present, and future).
              <br /><br />
              If your schedule has changed for the future, use <span className="font-bold italic text-primary">"New Routine"</span> instead to preserve your past logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2">
            <AlertDialogAction 
              onClick={executeUpdate}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Update Everywhere
            </AlertDialogAction>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}