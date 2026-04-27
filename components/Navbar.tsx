import React from 'react'
import  InstallModal  from './InstallModals'
import LoginButton from './LoginButton'
import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
        <div className="max-w-full mx-auto px-5 md:px-20 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <Image 
                src="/icon.png"
                alt="logo"
                width={32}
                height={32}
              />
            </div>
            <span className="font-bold text-lg italic tracking-tight text-foreground">Schedura</span>
          </Link>
            </div>
            <div className="flex gap-4 items-center">
                <InstallModal />
                <LoginButton />
            </div>
        </div>
    </nav>
  )
}
