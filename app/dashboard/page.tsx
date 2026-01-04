export const dynamic = 'force-dynamic'
import { Suspense, lazy} from 'react';
import React from 'react'
import Header from '@/components/dashboard/Header'
//import DashboardPage from '@/components/dashboard/Routine'
import { StatsCards } from '@/components/dashboard/StatsCard'
import { Skeleton } from '@/components/ui/skeleton';
const DashboardPage =lazy(()=> import("@/components/dashboard/Routine"))
export function RoutineSkeleton(){
  return (
    <div className='w-full p-1 '>
      <div className='p-1 w-full flex flex-wrap md:flex-nowrap md:justify-center mb-6 gap-2'>
        {Array.from({ length: 5}).map((_, index) =>(
          <Skeleton key={index}
            className='rounded-full w-44 py-5 lg:px-6'
          />
        ))}

      </div>
      <div className='w-full flex flex-wrap md:flex-nowrap md:justify-center mb-6 gap-2'>
        <Skeleton className='h-28 w-[calc(100%-30rem)] px-9'/>
      </div>
      <div className='w-full flex flex-wrap md:flex-nowrap md:justify-center mb-6 gap-2'>
        <Skeleton className='h-8 w-[calc(100%-30rem)] px-9'/>
      </div>
    </div>
    
  )
    
  }
const page = () => {

  
  return (
    <div className='w-full min-h-screen px-4 md:px-10 lg:px-20 space-y-6'>
      <StatsCards />
      <Suspense fallback={<RoutineSkeleton/>} >
        <DashboardPage />
      </Suspense>
      
    </div>
  )
}

export default page


