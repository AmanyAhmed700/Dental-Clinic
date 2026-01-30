// components/FAQAccordion.tsx
"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    q: "How can I book an appointment?",
    a: "You can book an appointment by filling the booking form on our website, calling our clinic, or using the WhatsApp button at the bottom-right of the site.",
  },
  {
    q: "Do you accept walk-ins?",
    a: "Walk-ins are accepted based on availability. We recommend booking in advance to guarantee a slot and avoid waiting times.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, major credit/debit cards, and mobile payment options. For certain treatments, bank transfer or installment plans are available on request.",
  },
  {
    q: "What should I bring to my first visit?",
    a: "Please bring a valid ID, any previous dental records or X-rays (if available), and a list of medications you are taking.",
  },
  {
    q: "Do you offer emergency dental services?",
    a: "Yes — we provide urgent care for dental emergencies. Contact us directly via phone or WhatsApp for immediate assistance.",
  },
  {
    q: "Is there parking available at the clinic?",
    a: "Yes, there is limited patient parking near the clinic and street parking. We recommend arriving a few minutes early to find a spot.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-7 py-4 md:py-5 text-left transition-colors bg-gray-200 hover:bg-gray-300"
              >
                <span className="flex-1 text-lg md:text-xl font-medium text-gray-800">
                  {item.q}
                </span>

                <span
                  className={`ml-4 inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform ${
                    isOpen ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}
                  aria-hidden
                >
                  {isOpen ? <FiMinus className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                </span>
              </button>

              {/* content */}
              <div
                className={`px-5 pb-5 transition-[max-height,opacity] duration-300 overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
