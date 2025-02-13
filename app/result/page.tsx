"use client";

import { useEffect, useState } from "react";

const ResultPage = () => {
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    const storedCode = localStorage.getItem("code");
    if (storedCode) {
      setGeneratedCode(storedCode);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-black flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Generated Code</h1>
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-lg relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-gray-300 text-black px-2 py-1 text-sm rounded hover:bg-gray-400"
        >
          Copy
        </button>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words p-2 text-sm bg-gray-900 text-green-300 rounded-md">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default ResultPage;
