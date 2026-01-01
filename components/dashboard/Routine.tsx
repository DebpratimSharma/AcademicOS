import { createClient } from '@/utils/supabase/server'

import { RoutineDisplay } from './RoutineDisplay'


export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Working Days
  const { data: settings } = await supabase
    .from('user_settings')
    .select('working_days')
    .single()

  // 2. Fetch Holidays (RLS will filter by user automatically)
  const { data: holidays } = await supabase
    .from('holidays')
    .select('holiday_date')

  // 3. Fetch Classes/Routine
  const { data: routine } = await supabase
    .from('routines')
    .select('*')
    .order('start_time', { ascending: true })

  const holidayDates = holidays?.map(h => h.holiday_date) || []
  const workingDays = settings?.working_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="max-w-4xl mx-auto py-2">
        <RoutineDisplay 
          holidays={holidayDates} 
          initialRoutine={routine || []} 
          workingDays={workingDays} 
        />
    </div>
  )
}