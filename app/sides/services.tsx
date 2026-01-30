"use client";

import { FaTooth, FaTeethOpen, FaSmile, FaStethoscope, FaRegGrinStars } from "react-icons/fa";

const services = [
  {
    id: 1,
    icon: <FaTooth size={40} className="text-blue-700 mb-4" />,
    title: "Dental Implants",
    description: "High-quality dental implants to restore your smile and improve oral health.",
  },
  {
    id: 2,
    icon: <FaTeethOpen size={40} className="text-blue-700 mb-4" />,
    title: "Orthodontics",
    description: "Expert braces and aligners to straighten teeth and enhance your smile.",
  },
  {
    id: 3,
    icon: <FaRegGrinStars size={40} className="text-blue-700 mb-4" />,
    title: "Preventive Care",
    description: "Regular check-ups, cleaning, and preventive treatments to keep teeth healthy.",
  },
  {
    id: 4,
    icon: <FaSmile size={40} className="text-blue-700 mb-4" />,
    title: "Cosmetic Dentistry",
    description: "Teeth whitening, veneers, and aesthetic treatments for a confident smile.",
  },
  {
    id: 5,
    icon: <FaStethoscope size={40} className="text-blue-700 mb-4" />,
    title: "Oral Surgery",
    description: "Professional oral surgery services including extractions and complex treatments.",
  },
];

export default function Services() {
  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4 text-blue-700">Our Services</h2>
        <p className="text-gray-700">
          We provide a wide range of professional dental services to ensure your smile stays healthy and beautiful.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {services.map(service => (
          <div
            key={service.id}
            className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition"
          >
            {service.icon}
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
