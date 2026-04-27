"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addRegularClass, getSubjectDetails } from "@/app/dashboard/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  // Form States for Auto-fill
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectCode, setSubjectCode] = React.useState("");
  const [weight, setWeight] = React.useState("1");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [room, setRoom] = React.useState("");

  // useQuery for auto-fill details
  const { data: details, isFetching: fetchingDetails } = useQuery({
    queryKey: ["subjectDetails", subjectCode],
    queryFn: () => getSubjectDetails(subjectCode),
    enabled: !!subjectCode && subjectCode.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Populate form when details are found
  React.useEffect(() => {
    if (details) {
      setSubjectName(details.subject_name || "");
      setWeight(String(details.weight || "1"));
      setRoom(details.room_number || "");
      toast.info("Auto-filled details from previous record", {
        description: `Found match for ${subjectCode}`,
        duration: 3000,
      });
    }
  }, [details, subjectCode]);

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
    
    try {
      const formData = new FormData(e.currentTarget);
      const today = getLocalDateString();
      await addRegularClass(formData, activeDay, today);
      toast.success(`Added to ${activeDay}`);
      
      // Reset form
      setSubjectName("");
      setSubjectCode("");
      setWeight("1");
      setStartTime("");
      setEndTime("");
      setRoom("");
      
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add class");
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-4 px-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Subject Code
              </label>
              <div className="relative">
                <Input
                  name="subject_code"
                  placeholder="e.g. CS101"
                  required
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                  className="rounded-lg py-6 pr-10"
                  autoFocus
                />
                {fetchingDetails && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Subject Name
              </label>
              <Input
                name="subject"
                placeholder="Subject Name"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className=" rounded-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Class Weightage (Credits)
              </label>
              <Input
                name="weight"
                type="number"
                min="1"
                max="5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className=" rounded-lg py-6"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Start Time</span>
                <Input
                  name="start"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className=" rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">End Time</span>
                <Input
                  name="end"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className=" rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Room Number
              </label>
              <Input
                name="room"
                placeholder="Room Number"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="border-input rounded-lg py-6"
              />
            </div>

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
