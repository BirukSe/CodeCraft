"use client";
import React from "react";
import { useSession } from "@/lib/auth-client";
import Navbar from "../_components/Navbar";

const CreditsPage = () => {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen min-w-screen w-full bg-slate-100 flex">
      {/* Navbar on the Left */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Credits & Acknowledgments</h1>

        <div className="max-w-2xl bg-white shadow-lg p-6 rounded-lg">
          {/* Project Description */}
          <h2 className="text-xl font-semibold text-gray-700">Project</h2>
          <p className="text-gray-600">
            <span className="font-medium">Wireframe to Code Changer</span> is an AI-powered tool that converts hand-drawn or digital wireframes into functional code, helping developers and designers streamline their workflow.
          </p>

          {/* Developers Section */}
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Developers</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li><span className="font-medium">Biruk Seyoum</span> - Lead Developer</li>
            <li>ChatGPT - Backend Engineer</li>
            <li>You tube - UI/UX Designer</li>
          </ul>

          {/* Technologies Used */}
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Technologies Used</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Next.js</li>
            <li>React</li>
            <li>Tailwind CSS</li>
            <li>Better Auth</li>
            <li>Gemini API </li>
          </ul>

          {/* Special Thanks */}
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Special Thanks</h2>
          <p className="text-gray-600">
            A huge thank you to the open-source community, early testers, and contributors who helped shape this project.
          </p>

          {/* Contact Information */}
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Contact</h2>
          <p className="text-gray-600">
            For inquiries, feedback, or collaboration, reach out at:  
            <span className="text-blue-500"> bseyoum003@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
