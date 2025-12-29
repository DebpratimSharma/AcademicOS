export const dynamic = 'force-dynamic'
import React from 'react'
import Header from '@/components/dashboard/Header'
import DashboardPage from '@/components/dashboard/Routine'
import { StatsCards } from '@/components/dashboard/StatsCard'

const page = () => {
  return (
    <div className='w-full min-h-screen p-4 md:p-8 space-y-6'>
      <Header />
      <StatsCards />
      <DashboardPage />
    </div>
  )
}

export default page