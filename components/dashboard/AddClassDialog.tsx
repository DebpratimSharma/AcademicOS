// components/AddClassDialog.tsx
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

    const { error } = await supabase.from('routines').insert({
      user_id: user?.id,
      subject_name: formData.get('subject'),
      day_of_week: activeDay, // Uses the prop from the active tab
      start_time: formData.get('start'),
      end_time: formData.get('end'),
      room_number: formData.get('room'),
    })

    if (!error) {
      toast.success(`Added to ${activeDay}`)
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary  text-primary-foreground hover:bg-primary/90 rounded-full font-bold h-10 px-4">
          <Plus className=" h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border rounded-3xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">New Class for {activeDay}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Enter schedule details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input name="subject" placeholder="Subject Name" required className="bg-input border-input rounded-xl py-6" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="start" type="time" required className="bg-input border-input rounded-xl" />
            <Input name="end" type="time" required className="bg-input border-input rounded-xl" />
          </div>
          <Input name="room" placeholder="Room Number" className="bg-input border-input rounded-xl py-6" />
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold">
            {loading ? <Loader2 className="animate-spin" /> : "Save Class"}
          </Button>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}