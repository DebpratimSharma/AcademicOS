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

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from('routines')
      .update({
        subject_name: formData.get('subject'),
        start_time: formData.get('start'),
        end_time: formData.get('end'),
        room_number: formData.get('room'),
      })
      .eq('id', item.id)

    if (!error) {
      toast.success("Class updated")
      setOpen(false)
      router.refresh()
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
      <DrawerContent className="mx-5  border px-4 md:px-20 md:mx-50">
        <div className="overflow-y-auto">

        
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-foreground">Edit Class</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleUpdate} className=" space-y-4 mt-2">
          <Input 
            name="subject" 
            defaultValue={item.subject_name} 
            placeholder="Subject Name" 
            required 
            className="bg-input border-input rounded-lg py-6" 
          />
          <div className="grid grid-cols-2 gap-4 items-center justify-itemce">
            <span>Start time</span>
            <span>End time</span>
            <Input 
              name="start" 
              type="time" 
              defaultValue={item.start_time.slice(0, 5)} 
              required 
              className="bg-input border-input rounded-lg" 
            />
            
            <Input 
              name="end" 
              type="time" 
              defaultValue={item.end_time.slice(0, 5)} 
              required 
              className="bg-input border-input rounded-lg" 
            />
          </div>
          <Input 
            name="room" 
            defaultValue={item.room_number} 
            placeholder="Room Number" 
            className="bg-input border-input rounded-lg py-6" 
          />
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-6 rounded-lg font-bold">
            {loading ? <Loader2 className="animate-spin" /> : "Update Class"}
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full bg-secondary text-secondary-foreground py-6 rounded-lg font-bold">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}