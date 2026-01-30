"use client";
import React from "react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Ali",
    specialty: "Orthodontist",
  
    bio: "Expert in braces and smile alignment with over 10 years of experience.",
  },
  {
    id: 2,
    name: "Dr. Omar Hassan",
    specialty: "Cosmetic Dentist",

    bio: "Specialized in smile makeovers, veneers, and aesthetic restorations.",
  },
  {
    id: 3,
    name: "Dr. Mohamed Salah",
    specialty: "Pediatric Dentist",
  
    bio: "Dedicated to providing gentle and friendly dental care for children.",
  },
  {
    id: 4,
    name: "Dr. Youssef Nabil",
    specialty: "Implant Specialist",
  
    bio: "Experienced in dental implants and full-mouth restorations.",
  },
];

export default function Doctor() {
  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-10">
            Our Professional Doctors 
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <Tilt
              key={doctor.id}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1200}
              transitionSpeed={900}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform transition-all duration-100"
            >
              <div className="flex flex-col h-full">
                {/* Image Half */}
        

                {/* Text Half */}
                <div className="p-5 flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  <p className="text-gray-600 mt-3 text-sm">{doctor.bio}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
