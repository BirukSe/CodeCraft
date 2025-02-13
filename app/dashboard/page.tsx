"use client"
import React, {ChangeEvent, useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
const page = () => {
  const {data:session,isPending }=useSession();
  console.log("mydata",session)
  const router=useRouter();
  const [description, setDescription]=useState("");
  const [file, setFile]=useState<any>();
  const [error, setError]=useState("");
  const [isLoading, setIsLoading]=useState(false);
  const [genCode, setGenCode]=useState(null);
  const [previewUrl, setPreviewUrl]=useState<string | null>(null);
  const handleChangeFile=(event:ChangeEvent<HTMLInputElement>)=>{
    const files=event.target.files;
    if(files){
        const imageUrl=URL.createObjectURL(files[0])
        setFile(files[0]);
        setPreviewUrl(imageUrl);
    }

  }
  useEffect(()=>{
    if(!session && !isPending){
      router.push('/');

    }
    
   
  },[])
  const changeToCode=async()=>{
    try{
      setIsLoading(true);
      const formdata=new FormData();
      formdata.append("file", file);
      formdata.append("description", description);
      const response=await fetch('/api/upload', {
        method: "POST",
       
        body: formdata
      })
      const result=await response.json();
      if(!result){
        console.log("Something went wrong, please try again");
        setError("Something went wrong, Please try again");
  
      }
    
      localStorage.setItem("code", result.generatedCode);
      router.push('/result');

    }catch(error:any){
      console.log(error);


      setError(error.message);
    }finally{
      setIsLoading(false);
    }
  
  }
  return (
    <div className="min-h-screen min-w-screen w-full bg-slate-100">
      <div className="flex">
        <div>
          <h1 className="text-blue-500 font-bold p-6 text-2xl">CodeCraft</h1>
          <p className="text-black">Build Awesome</p>
          <div>
            <div className="flex flex-col gap-3">
            <div className="hover:bg-slate-300 rounded px-3">
            <img src="home.png" className="w-10 h-10"/>
            <h1 className="text-black font-bold">Workspace</h1>
            
            </div>
          <div className="hover:bg-slate-300 px-3">
            <img src="layers.png" className="w-10 h-10"/>
            <h1 className="text-black font-bold">Design</h1>
            
            
            </div>
            <div className="hover:bg-slate-300 px-3 cursor-pointer">
            <img src="credit.png" className="w-10 h-10"/>
            <h1 className="text-black font-bold">Credits</h1>
            
            </div>

            </div>
          
     

          </div>

         

        </div>

        <div className=" min-h-screen bg-white w-full">
          <div className="flex justify-around gap-2">
          <h1 className="text-black text-2xl flex justify-center">Hello, Developer</h1>
          <h1>{session?<div className="flex gap-2">
            <img src={session?.user?.image ?? undefined} alt="User Avatar"   className="w-10 h-10 rounded-xl"/>
            <h1 className="text-xl text-black flex justify-center items-center">{session.user.name}</h1>
          </div>:null}</h1>

          </div>
      
          <h1 className="text-black flex justify-center font-extrabold text-4xl mt-14">Convert wireframe to code</h1>
          <div className="flex flex-col gap-7 md:flex-row md:justify-around">
            {/* <div className="shadow-lg max-w-[300px] min-w-[50px] h-[400px] rounded flex flex-col justify-around">
              <div className="flex flex-col items-center">
                <img src="upload.svg"/>

              <h1 className="text-black">Upload Image</h1>

              </div>
             
              <p className="text-slate-400">Click Button to select wireframe image</p>
              <button className="bg-black text-white rounded">Select Image</button>
            </div> */}
              <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center">
                <div className={previewUrl?"hidden":"block"}>
                <h2 className="font-bold text-lg">Upload Image</h2>
                <p className="text-gray-400 mt-3">Click Button to select wireframe image</p>

                <div className="p-5 border border-dashed w-full flex justify-center mt-7 bg-black">
               <label htmlFor="imageSelect">
                <h2 className="p-2 bg-primary text-white rounded-md px-5">Select Image</h2>

               </label>
                </div>
                <input type="file" id="imageSelect" multiple={false} className="hidden" onChange={handleChangeFile}/>

                </div>
                
                  <img src={previewUrl!} className={previewUrl?"block":"hidden"}/>
              

                
         

            </div>
            <div className="shadow-xl rounded-xl p-7 object-cover">
              <h1 className="text-black font-bold text-2xl flex justify-center">Enter description about your website</h1>
              <textarea placeholder="Write about your website" className="text-black flex  pr-28 w-full h-[200px] relative" onChange={(e)=>setDescription(e.target.value)}></textarea>

            </div>
          
          </div>
          <div>
              <button className="cursor-pointer mt-16  text-white p-3 mb-7 font-bold text-xl rounded bg-black hover:bg-black/55" onClick={changeToCode}>{isLoading?"Converting...": "Convert to Code"}</button>
            </div>
         
        </div>
      </div>

     
      
    </div>
  )
}

export default page
