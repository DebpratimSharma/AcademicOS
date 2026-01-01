export const dynamic = 'force-dynamic'
import React from 'react'
import Header from '@/components/dashboard/Header'
import DashboardPage from '@/components/dashboard/Routine'
import { StatsCards } from '@/components/dashboard/StatsCard'

const page = () => {
  return (
    <div className='w-full min-h-screen px-4 md:px-10 lg:px-20 space-y-6'>
      
      <StatsCards />
      <DashboardPage />
    </div>
  )
}

export default page