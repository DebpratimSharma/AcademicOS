import React from 'react'
import  InstallModal  from './InstallModals'
import LoginButton from './LoginButton'
import Image from 'next/image'

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
        <div className="max-w-full mx-auto px-5 md:px-20 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <a href="#hero" className='flex items-center gap-2'>
                <div className=" bg-transparent flex items-center justify-center">
                <Image src="/icon.png" alt='logo' height={30} width={30} className='h-auto w-auto' />
                </div>
                <span className="font-bold text-foreground tracking-tight">Academic OS</span>
                </a>
            </div>
            <div className="flex gap-4 items-center">
                <InstallModal />
                <LoginButton />
            </div>
        </div>
    </nav>
  )
}
