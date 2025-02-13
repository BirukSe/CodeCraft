"use client"
import React from 'react'
import { useSession } from '@/lib/auth-client';
import Navbar from '../_components/Navbar';
const page = () => {
    const {data:session, isPending}=useSession();
  return (
    <div className="min-h-screen min-w-screen w-full bg-slate-100">
        <div className="flex">

            <Navbar/>
            <div className="text-black font-bold flex justify-center text-2xl">
                This is my credits page
            </div>

        </div>
      
    </div>
  )
}

export default page;
