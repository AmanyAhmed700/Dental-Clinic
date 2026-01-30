"use client";

import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";


export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/20" 
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 hover:scale-110 animate-pulse-glow"
    >
      <FaWhatsapp className="text-3xl" />
    </Link>
  );
}
