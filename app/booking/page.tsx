"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import "react-calendar/dist/Calendar.css";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  doctor?: { name: string };
}

export default function PatientBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  //  Patient info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    else toast.error("Token not found");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAppointments(data.appointments);
        else toast.error(data.message);
      } catch (err) {
        toast.error("An error occurred while loading appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  //  When confirming the booking
  const handleBooking = async () => {
    if (!selectedSlot) return toast.error("Please select a slot first");
    if (!fullName.trim() || !phone.trim())
      return toast.error("Please enter your full name and phone number");

    try {
      const res = await fetch("/api/booking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: selectedSlot,
          fullName,
          phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking confirmed successfully");
        setSelectedSlot(null);
        setFullName("");
        setPhone("");
        const res2 = await fetch(`/api/booking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = await res2.json();
        if (updated.success) setAppointments(updated.appointments);
      } else toast.error(data.message);
    } catch {
      toast.error("An error occurred while booking");
    }
  };

  if (!mounted) return null;

  const availableSlots = appointments.filter((a) => {
    const slotDate = new Date(a.date);
    const sameDay =
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getDate() === selectedDate.getDate();
    return sameDay && a.status === "AVAILABLE";
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-10 px-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10">
      {/*  Left Column - Form */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 order-2 lg:order-1">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Book an Appointment
        </h1>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
          />
        </div>

        {/* Appointment Slots */}
        <div className="mt-6 text-center">
          {loading ? (
            <p className="text-gray-500">Loading appointments...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-red-500">No available appointments</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-3">
                Available appointments for{" "}
                {selectedDate.toLocaleDateString("en-US")}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSlot === slot.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-blue-100"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/*  Patient Info Inputs */}
        <div className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleBooking}
            disabled={!selectedSlot}
            className={`px-6 py-2 font-semibold rounded-lg shadow ${
              selectedSlot
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/*  Right Column - Map */}
      <div className="w-full max-w-md h-[500px] rounded-2xl overflow-hidden shadow-lg order-1 lg:order-2">
        <iframe
          title="Doctor Clinic"
          className="w-full h-full border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57292.46892704195!2d32.76268211428832!3d26.171315969883146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144eb62eb4d2496f%3A0x50f240bdb670aa01!2z2YLZhtin2Iwg2YLYs9mFINmC2YbYp9iMINmF2LHZg9iyINmC2YbYp9iMINmF2K3Yp9mB2LjYqSDZgtmG2Kc!5e0!3m2!1sar!2seg!4v1761481263720!5m2!1sar!2seg"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
