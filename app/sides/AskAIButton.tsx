"use client";

import { RiRobot3Line } from "react-icons/ri";
import Link from "next/link";

export default function AskAIButton() {
  return (
    <Link
      href="/pages/ai" 
      className="fixed bottom-28  mb-8 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 hover:scale-110 animate-pulse-glow"
    >
    <RiRobot3Line className="text-3xl" />
    </Link>
  );
}
