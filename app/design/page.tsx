"use client"
import React, { useRef, useState, useEffect } from 'react';  
import { useSession } from '@/lib/auth-client';  
import Navbar from '../_components/Navbar';  
import { useRouter } from 'next/navigation';  

const Page = () => {  
  const router = useRouter();  
  const { data: session, isPending } = useSession();  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  
  const [isLoading, setIsLoading] = useState(false);  
  const [drawing, setDrawing] = useState(false);  
  const [description, setDescription] = useState("");  

  useEffect(() => {  
    if (canvasRef.current) {  
      const canvas = canvasRef.current;  
      const ctx = canvas.getContext('2d');  
      if (ctx) {  
        ctx.lineWidth = 2;  
        ctx.strokeStyle = "black";  
        ctx.lineJoin = "round";  
        ctx.lineCap = "round";  
      }  
    }  
  }, []); // Run once when the component mounts  

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {  
    if (!canvasRef.current) return;  
    const canvas = canvasRef.current;  
    const ctx = canvas.getContext('2d');  
    if (!ctx) return;  

    ctx.beginPath();  
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);  
    setDrawing(true);  
  };  

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {  
    if (!drawing || !canvasRef.current) return;  
    const canvas = canvasRef.current;  
    const ctx = canvas.getContext('2d');  
    if (!ctx) return;  

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);  
    ctx.stroke();  
  };  

  const stopDrawing = () => {  
    setDrawing(false);  
  };  

  return (  
    <div className="min-h-screen min-w-screen w-full bg-slate-100 flex">  
      <Navbar />  
      <div className="flex-1 p-6">  
        <div className="text-black font-bold flex justify-center text-2xl mb-6">  
          Draw your wireframe here  
        </div>  

        <div className="flex flex-col items-center space-y-4">  
          {/* Drawing Canvas */}  
          <div className="flex justify-center w-full">  
            <canvas  
              ref={canvasRef}  
              width={800}  
              height={600}  
              style={{  
                border: '1px solid black',  
                backgroundColor: 'white',  
                cursor: 'crosshair',  
                maxWidth: '100%',  
              }}  
              onMouseDown={startDrawing}  
              onMouseMove={draw}  
              onMouseUp={stopDrawing}  
              onMouseLeave={stopDrawing}  
            ></canvas>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Page;  
