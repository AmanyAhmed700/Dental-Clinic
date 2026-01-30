"use client";

import Image from "next/image";

export default function About() {
  return (
    <section className="py-16 px-6 md:px-20 bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* العنوان الرئيسي */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 text-center mb-8">
          About Us
        </h1>

        {/* المحتوى */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          
          <div className="md:w-1/2 w-full">
            <Image
              src="/doctors/bg.jpg"
              alt="Al-Haya Clinic"
              className="rounded-lg shadow-lg object-cover w-full h-full"
              width={600}
              height={400}
            />
          </div>

          {/* النص */}
          <div className="md:w-1/2 w-full text-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Al-Haya Clinic</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <strong>Al-Haya Clinic</strong>, your premier destination for professional dental care. 
              We combine state-of-the-art technology with personalized attention to ensure every patient receives the highest quality treatment.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team of experienced dentists and specialists is dedicated to providing comprehensive dental solutions, 
              including cosmetic dentistry, orthodontics, dental implants, and preventive care. We prioritize patient comfort, safety, and satisfaction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              At <strong>Al-Haya Clinic</strong>, we believe a healthy and beautiful smile can transform lives. 
              Our mission is to create confident smiles and long-lasting relationships with our patients through exceptional dental care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
