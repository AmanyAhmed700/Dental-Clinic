"use client";

import { useState, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: "AVAILABLE" | "PENDING" | "ACCEPTED" | "REJECTED";
  patient?: { name: string } | null;
}

export default function DoctorCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newTime, setNewTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      console.log("Error fetching appointments:", err);
    }
  };

  const createSlot = async () => {
    if (!newTime || !selectedDate)
      return toast.error("Please select a day and enter time.");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: selectedDate + "T" + newTime, time: newTime }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
        setNewTime("");
        toast.success("Slot created successfully");
      } else toast.error(data.message);
    } catch (err) {
      console.log("Error creating slot:", err);
    }
  };

  const deleteSlot = async (id: number) => {
    try {
      const res = await fetch(`/api/appointments?appointmentId=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
        toast.success("Appointment deleted");
      } else toast.error(data.message);
    } catch (err) {
      console.log("Error deleting slot:", err);
    }
  };

  const clearAllAppointments = async () => {
    if (!confirm("Are you sure you want to delete ALL appointments?")) return;
    try {
      const res = await fetch(`/api/appointments`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAppointments([]);
        toast.success("All appointments cleared permanently");
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Error clearing appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => {
      const day = i + 1;
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    });
  };

  const monthDays = getDaysInMonth(currentMonth);
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="p-2 sm:p-4 md:p-6 flex flex-col items-center relative w-full">
      {/* Clear All Button */}
      <button
        onClick={clearAllAppointments}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl md:text-3xl"
        title="Clear all appointments"
      >
        <FaTimesCircle />
      </button>

      <h2 className="text-xl  sm:text-2xl md:text-3xl font-bold mb-4 text-center">
        Doctor Calendar
      </h2>

      {/* Month Navigation */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4 w-full max-w-md">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            )
          }
          className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm w-full sm:w-auto"
        >
          Previous Month
        </button>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-center">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            )
          }
          className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm w-full sm:w-auto"
        >
          Next Month
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full max-w-4xl mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-xs sm:text-sm p-1">
            {day}
          </div>
        ))}
        {monthDays.map((day) => {
          const dayAppointments = appointments.filter(
            (a) => a.date.split("T")[0] === day
          );
          const isPast = day < todayStr;
          const isSelected = selectedDate === day;

          const bgColor =
            dayAppointments.some((a) => a.status === "REJECTED")
              ? "bg-red-200"
              : dayAppointments.some((a) => a.status === "ACCEPTED")
              ? "bg-green-200"
              : isSelected
              ? "bg-blue-100"
              : "bg-white";

          return (
            <div
              key={day}
              onClick={() => !isPast && setSelectedDate(day)}
              className={`cursor-pointer p-1 sm:p-2 rounded flex flex-col items-center justify-start shadow-sm transition-all min-h-[60px] sm:min-h-[80px] ${
                isPast ? "bg-gray-200 text-gray-500" : `${bgColor} hover:scale-105`
              }`}
            >
              <p className="font-bold text-xs sm:text-sm mb-1">
                {day.split("-")[2]}
              </p>

              {dayAppointments.slice(0, 2).map((a) => (
                <div
                  key={a.id}
                  className={`w-full mt-0.5 p-0.5 text-[10px] sm:text-xs rounded text-center truncate ${
                    a.status === "ACCEPTED"
                      ? "bg-green-500 text-white"
                      : a.status === "REJECTED"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {a.time}
                </div>
              ))}
              {dayAppointments.length > 2 && (
                <div className="text-[10px] text-gray-500 mt-0.5">
                  +{dayAppointments.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Appointments for Selected Day */}
      <div className="mt-4 w-full max-w-2xl px-2">
        <h3 className="text-lg font-semibold mb-2">
          Appointments on {selectedDate}
        </h3>

        {/* Add Slot */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded flex-1 text-sm md:text-base"
          />
          <button
            onClick={createSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
          >
            Add Slot
          </button>
        </div>

        {/* Appointments List */}
        <div className="max-h-60 overflow-y-auto">
          {appointments
            .filter((a) => a.date.split("T")[0] === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((a) => (
              <div
                key={a.id}
                className={`border p-3 rounded mb-2 text-sm ${
                  a.status === "ACCEPTED"
                    ? "bg-green-100 border-green-300"
                    : a.status === "REJECTED"
                    ? "bg-red-100 border-red-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">Time: {a.time}</p>
                    <p className="text-xs text-gray-600">Status: {a.status}</p>
                    {a.patient && <p className="text-xs">Patient: {a.patient.name}</p>}
                  </div>
                  {a.status === "AVAILABLE" && (
                    <button
                      onClick={() => deleteSlot(a.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs ml-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}