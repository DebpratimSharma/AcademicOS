"use client";

import * as React from "react";
import { Loader2, Calculator } from "lucide-react";
import { addManualBaseline } from "@/app/dashboard/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ManualOverrideDialog({ customTrigger }: { customTrigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const conducted = parseInt(formData.get("conducted") as string) || 0;
      const present = parseInt(formData.get("present") as string) || 0;

      if (present > conducted) {
        toast.error("Present classes cannot be greater than conducted classes.");
        setLoading(false);
        return;
      }

      await addManualBaseline(conducted, present);
      toast.success("Previous attendance baseline set successfully!");
      setOpen(false);
      window.dispatchEvent(new Event("attendanceUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to set baseline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant="outline" className="w-full justify-start py-1.5 border-none h-auto px-2 hover:bg-transparent">
            <div className="flex items-center text-sm font-normal w-full px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Calculator className="mr-2 h-4 w-4" />
              <span>Set Manual Baseline</span>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Manual Attendance Baseline
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Enter your previous attendance numbers. This will act as a starting point, and your new classes will be added on top.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Total Previous Conducted
            </label>
            <Input
              name="conducted"
              type="number"
              min="0"
              required
              placeholder="e.g. 100"
              className="rounded-lg py-6"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Total Previous Attended (Present)
            </label>
            <Input
              name="present"
              type="number"
              min="0"
              required
              placeholder="e.g. 75"
              className="rounded-lg py-6"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg font-bold mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Save Baseline"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
