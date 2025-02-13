"use client"
import React from 'react'
import {useRouter, usePathname } from 'next/navigation';
const Navbar = () => {
    const router=useRouter();
    const currentPath=usePathname();
  return (
    <div>
    <h1 className="text-blue-500 font-bold p-6 text-2xl">CodeCraft</h1>
    <p className="text-black">Build Awesome</p>
    <div>
      <div className="flex flex-col gap-3">
      <div className={currentPath=='/dashboard'?"bg-slate-300 rounded px-3":"hover:bg-slate-200 rounded px-3"} onClick={()=>router.push('/dashboard')}>
      <img src="home.png" className="w-10 h-10"/>
      <h1 className="text-black font-bold">Workspace</h1>
      
      </div>
    <div className={currentPath=='/design'?"bg-slate-300 rounded px-3":"hover:bg-slate-200 rounded px-3"} onClick={()=>router.push('/design')}>
      <img src="layers.png" className="w-10 h-10"/>
      <h1 className="text-black font-bold">Design</h1>
      
      
      </div>
      <div className={currentPath=='/credits'?"bg-slate-300 rounded px-3": "hover:bg-slate-200 rounded px-3"} onClick={()=>router.push('/credits')}>
      <img src="credit.png" className="w-10 h-10"/>
      <h1 className="text-black font-bold">Credits</h1>
      
      </div>

      </div>
    


    </div>

   

  </div>
  )
}

export default Navbar;
