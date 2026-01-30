"use client";
import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";
import { TbDental } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-10 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6 gap-10">
        
        {/* Left - Logo & Info */}
        <div className="flex flex-col items-start gap-3 w-full md:w-1/3">
          <Link href="/" className="flex items-center gap-2">
            <TbDental className="text-5xl text-white" />
            <span className="text-xl font-bold text-white">Al-hayah clinic</span>
          </Link>

          <div className="flex flex-col text-sm mt-2">
            <span>123 Dental Street, Cairo, Egypt</span>
            <span>Phone: +20 111 111 1111</span>
            <span>
              Email:{" "}
              <a href="mailto:yourclinic@gmail.com" className="underline">
                yourclinic@gmail.com
              </a>
            </span>
          </div>

          <div className="flex gap-4 text-2xl mt-3 ">
      <a
  href="https://wa.me/1111111111"
  target="_blank"
  rel="noopener noreferrer"
  className="transition-transform duration-200 hover:scale-130 active:scale-130"
>
  <FaWhatsapp className="text-2xl text-whie" />
</a>

<a
  href="https://facebook.com"
  target="_blank"
  rel="noopener noreferrer"
  className="transition-transform duration-200 hover:scale-130 active:scale-130"
>
  <FaFacebook className="text-2xl text-whie" />
</a>

<a
  href="https://instagram.com"
  target="_blank"
  rel="noopener noreferrer"
  className="transition-transform duration-200 hover:scale-130 active:scale-130"
>
  <FaInstagram className="text-2xl text-whie" />
</a>

<a
  href="mailto:yourclinic@gmail.com"
  className="transition-transform duration-200 hover:scale-130 active:scale-130"
>
  <FaEnvelope className="text-2xl text-whie" />
</a>

          </div>
        </div>

        {/* Center - Support Links */}
        <div className="flex flex-col items-start md:items-center gap-3 w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-1">Support</h3>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link href="/support" className="hover:underline">
            Support
          </Link>
        </div>

        {/* Right - Clinic Links */}
        <div className="flex flex-col items-start md:items-center gap-3 w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-1">Clinic</h3>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/pages/ai" className="hover:underline">
            Ask Ai
          </Link>
          <Link href="/pages/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/pages/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-sm mt-8 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} Amany Ahmed. All rights reserved.
      </div>
    </footer>
  );
}
