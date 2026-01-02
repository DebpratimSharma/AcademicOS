'use client'

import * as React from "react"
import { Pencil, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditClassDialog({ item }: { item: any }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()
  const isSubstitute = item.hasOwnProperty('date')

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    let error;

    if (isSubstitute) {
      const result = await supabase
        .from('extra_sessions')
        .update({
          subject_name: formData.get('subject'),
          start_time: formData.get('start'),
          end_time: formData.get('end'),
          weight: parseInt(formData.get('weight') as string),
          actual_weight: parseInt(formData.get('weight') as string),
        })
        .eq('id', item.id)
      error = result.error
    } else {
      const result = await supabase
        .from('routines')
        .update({
          subject_name: formData.get('subject'),
          start_time: formData.get('start'),
          end_time: formData.get('end'),
          room_number: formData.get('room'),
          weight: parseInt(formData.get('weight') as string),
        })
        .eq('id', item.id)
      error = result.error
    }

    if (!error) {
      toast.success(isSubstitute ? "Substitute class updated" : "Class updated")
      setOpen(false)
      router.refresh()
      window.dispatchEvent(new Event("attendanceUpdated"));
    } else {
      toast.error("Update failed")
    }
    setLoading(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all active:scale-90">
          <Pencil className="w-4 h-4" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="px-5 border border-border mx-auto w-[90%] md:w-[70%] md:px-10 lg:w-[60%] lg:px-15 xl:w-[50%]">
        <div className="overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold text-foreground">
              {isSubstitute ? "Edit Substitute Class" : "Edit Class"}
            </DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleUpdate} className=" space-y-4 mt-2">
            <Input 
              name="subject" 
              defaultValue={item.subject_name} 
              placeholder="Subject Name" 
              required 
              className=" border-input rounded-lg py-6" 
            />
            <div className="space-y-2">
              <span className=" text-[10px] font-bold text-muted-foreground uppercase ml-1">Weightage</span>
              <Input 
                name="weight" 
                type="number" 
                defaultValue={item.weight || 1} 
                min="1"
                max="5"
                placeholder="Weightage" 
                required
                className=" border-input rounded-lg py-6" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center justify-itemce">
              <span>Start time</span>
              <span>End time</span>
              <Input 
                name="start" 
                type="time" 
                defaultValue={item.start_time.slice(0, 5)} 
                required 
                className=" border-input rounded-lg" 
              />
              
              <Input 
                name="end" 
                type="time" 
                defaultValue={item.end_time.slice(0, 5)} 
                required 
                className=" border-input rounded-lg" 
              />
            </div>
            {!isSubstitute && (
              <Input 
                name="room" 
                defaultValue={item.room_number} 
                placeholder="Room Number" 
                className=" border-input rounded-lg py-6" 
              />
            )}
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-6 rounded-lg font-bold">
              {loading ? <Loader2 className="animate-spin" /> : (isSubstitute ? "Update Substitute Class" : "Update Class")}
            </Button>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-muted-foreground">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
