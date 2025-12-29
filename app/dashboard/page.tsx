export const dynamic = 'force-dynamic'
import React from 'react'
import Header from '@/components/dashboard/Header'
import DashboardPage from '@/components/dashboard/Routine'




const page = () => {
  return (
    <div className='w-full h-screen p-5'>
      <Header />
      <DashboardPage />
      
    </div>
  )
}

export default page