'use client'

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Trash2, Save, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { format } from "date-fns"
import { toast } from "sonner" // Optional: for notifications
import { useRouter } from "next/navigation"
import { CircleChevronRight } from "lucide-react"
import { ro } from "date-fns/locale"

export function HolidayDrawer() {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [holidays, setHolidays] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const supabase = createClient()

  // Fetch holidays on load
  const fetchHolidays = async () => {
    const { data } = await supabase.from('holidays').select('holiday_date')
    if (data) setHolidays(data.map(h => h.holiday_date))
  }

  React.useEffect(() => { fetchHolidays() }, [])

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : null
  const isAlreadyHoliday = selectedDateStr ? holidays.includes(selectedDateStr) : false

  const handleSave = async () => {
    
    if (!date) return
    setLoading(true)
    const { error } = await supabase.from('holidays').insert([{ holiday_date: selectedDateStr }])
    
    if (!error) {
      setHolidays([...holidays, selectedDateStr!])
      toast.success("Holiday added")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    
    if (!date) return
    setLoading(true)
    const { error } = await supabase.from('holidays').delete().eq('holiday_date', selectedDateStr)
    
    if (!error) {
      setHolidays(holidays.filter(h => h !== selectedDateStr))
      toast.error("Holiday removed")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full justify-start py-1.5">
          <CalendarIcon className=" h-4 w-4" />
          <span>Add Holidays</span>
          <CircleChevronRight className="ml-auto my-auto h-4 w-4 text-accent-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background border-border mx-5 pb-8 border text-foreground">
        <div className="mx-auto w-full max-w-sm ">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl">Manage Holidays</DrawerTitle>
          </DrawerHeader>
          
          
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full "
              // Highlight existing holidays in the calendar
              modifiers={{ holiday: (d) => holidays.includes(format(d, 'yyyy-MM-dd')) }}
              modifiersClassNames={{ holiday: "bg-destructive/20 text-destructive font-bold rounded-md" }}
            />
          

          <div className="flex flex-col px-5 gap-3 mt-4">
            {isAlreadyHoliday ? (
              <Button 
                variant="destructive" 
                className="w-full py-6 rounded-lg gap-2"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Trash2 className="h-5 w-5" />}
                Delete Holiday
              </Button>
            ) : (
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg gap-2 font-bold"
                onClick={handleSave}
                disabled={loading || !date}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5" />}
                Save as Holiday
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="ghost" className="text-muted-foreground">Cancel</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}