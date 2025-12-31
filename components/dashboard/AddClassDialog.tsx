'use client'

import * as React from "react"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AddClassDialog({ activeDay }: { activeDay: string }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()

    // Capture the weight from the form (convert string to number)
    const weightValue = parseInt(formData.get('weight') as string) || 1

    const { error } = await supabase.from('routines').insert({
      user_id: user?.id,
      subject_name: formData.get('subject'),
      day_of_week: activeDay,
      start_time: formData.get('start'),
      end_time: formData.get('end'),
      room_number: formData.get('room'),
      weight: weightValue, // Save the weight here
    })

    if (!error) {
      toast.success(`Added to ${activeDay}`)
      setOpen(false)
      router.refresh()
    } else {
      toast.error("Failed to add class")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold h-10 px-4">
          <Plus className=" h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border rounded-t-3xl sm:rounded-3xl sm:max-w-100 sm:top-[50%] translate-y-0 sm:translate-y-[-50%] max-h-[95vh] overflow-y-auto duration-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">New Class for {activeDay}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Enter schedule details below.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input name="subject" placeholder="Subject Name" required className="bg-input border-input rounded-xl py-6" />
          
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
              className="bg-input border-input rounded-xl py-6"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="start" type="time" placeholder="Start time" required className="bg-input border-input rounded-xl" />
            <Input name="end" type="time" placeholder="End time" required className="bg-input border-input rounded-xl" />
          </div>
          
          <Input name="room" placeholder="Room Number" className="bg-input border-input rounded-xl py-6" />
          
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold">
            {loading ? <Loader2 className="animate-spin text-white" /> : "Save Class"}
          </Button>
        </form>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full text-muted-foreground">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}