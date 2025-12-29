import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { RoutineDisplay } from './RoutineDisplay'


export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Working Days
  const { data: settings } = await supabase
    .from('user_settings')
    .select('working_days')
    .single()

  // 2. Fetch Holidays
  const { data: holidays } = await supabase
    .from('holidays')
    .select('holiday_date')

  // 3. Fetch Classes/Routine
  const { data: routine } = await supabase
    .from('routines')
    .select('*')
    .order('start_time', { ascending: true })

  const today = format(new Date(), 'yyyy-MM-dd')
  const holidayDates = holidays?.map(h => h.holiday_date) || []
  console.log('Holidays this week:', holidayDates)
  const isHolidayToday = holidayDates.includes(today)
  const workingDays = settings?.working_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  

  return (
    <div className="max-w-4xl mx-auto py-6">
        <RoutineDisplay 
          holidays={holidayDates} 
          initialRoutine={routine || []} 
          workingDays={workingDays} 
        />
        
        
    </div>
  )
}