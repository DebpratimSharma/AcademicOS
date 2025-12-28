'use client'

import * as React from "react"
import { Pencil, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all active:scale-90">
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border rounded-3xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Edit Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <Input 
            name="subject" 
            defaultValue={item.subject_name} 
            placeholder="Subject Name" 
            required 
            className="bg-input border-input rounded-xl py-6" 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              name="start" 
              type="time" 
              defaultValue={item.start_time.slice(0, 5)} 
              required 
              className="bg-input border-input rounded-xl" 
            />
            <Input 
              name="end" 
              type="time" 
              defaultValue={item.end_time.slice(0, 5)} 
              required 
              className="bg-input border-input rounded-xl" 
            />
          </div>
          <Input 
            name="room" 
            defaultValue={item.room_number} 
            placeholder="Room Number" 
            className="bg-input border-input rounded-xl py-6" 
          />
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold">
            {loading ? <Loader2 className="animate-spin" /> : "Update Class"}
          </Button>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full bg-secondary text-secondary-foreground py-6 rounded-2xl font-bold">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}