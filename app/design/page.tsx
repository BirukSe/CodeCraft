"use client"
import React, { useRef, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Navbar from '../_components/Navbar';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router=useRouter();
  const { data: session, isPending } = useSession();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading]=useState(false);
  const [drawing, setDrawing] = useState(false);
  const [description, setDescription] = useState(""); // To capture the description from the user

  // Handle drawing start
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    setDrawing(true);
  };

  // Handle drawing
  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  };

  // Handle drawing stop
  const stopDrawing = () => {
    setDrawing(false);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Convert canvas to image and send it with description
  const convertToCode = async () => {
    try{
        setIsLoading(true);
    console.log("i am in the function")
    const canvas = canvasRef.current;
    const imageData = await canvas.toDataURL(); 
    console.log("my image", imageData);// Get the image data from the canvas
    function dataURLtoBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: "image/png" });
      }
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', dataURLtoBlob(imageData)); // Append the image data
    formData.append('description', description); // Append the description
console.log(formData);
    // Send the FormData to your endpoint
   
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if(!result){
        console.log("Something went wrong, Please try again")
        return;
    }
    localStorage.setItem("code", result.generatedCode);
   router.push('/result')

    }catch(error){
        console.log(error);
    }finally{
        setIsLoading(false);
    }
    
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
              width={Math.min(800, window.innerWidth - 200)} // Ensure it doesn't overflow on small screens
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

          {/* Description Input */}
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={handleDescriptionChange}
            className="px-6 py-2 border border-gray-300 rounded w-full max-w-lg text-black"
          />

          {/* Convert to Code Button */}
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded w-full max-w-lg"
            onClick={convertToCode}
          >
            {isLoading?"Converting...": "Convert to code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
