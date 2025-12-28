import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <Link href="/dashboard">Login</Link>
    </div>
  )
}

export default page