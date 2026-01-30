"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image (Responsive & Full Screen) */}
      <div className="absolute inset-0 w-full h-full">
    <img
  src="/doctors/hero.jpg"
  alt="Modern Dental Clinic"
  className="w-full h-full object-cover"
/>

      </div>

      {/* Soft Overlay - طبقة تظليل لجعل النص (إذا أضفته مستقبلاً) واضحاً */}
      <div className="absolute inset-0 bg-black/30" />

      {/* يمكنك هنا إضافة محتوى فوق الصورة إذا أردت */}
      <div className="relative z-10 text-center">
         {/* <h1 className="text-white text-4xl font-bold">ابتسامتك وجهتنا</h1> */}
      </div>
    </section>
  );
}