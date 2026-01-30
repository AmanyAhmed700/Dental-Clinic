"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: "AVAILABLE" | "PENDING" | "ACCEPTED" | "REJECTED";
  patientName?: string | null;
  patientPhone?: string | null;
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  //  تحميل المواعيد الخاصة بالطبيب
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setAppointments(data.appointments);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  //  تحديث حالة الموعد
  const updateStatus = async (id: number, status: "ACCEPTED" | "REJECTED") => {
    try {
      setUpdating(id);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: id, status }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Appointment updated successfully");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  //  تصفية المواعيد
  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "ALL") return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* العنوان */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">
          Doctor Appointments
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage and review all patient appointments
        </p>
      </div>

      {/* مرشحات الحالة */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {["ALL", "PENDING", "ACCEPTED", "REJECTED", "AVAILABLE"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-gray-800">{appointments.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === "PENDING").length}
          </div>
          <div className="text-xs sm:text-sm text-yellow-700">Pending</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-blue-600">
            {appointments.filter(a => a.status === "ACCEPTED").length}
          </div>
          <div className="text-xs sm:text-sm text-blue-700">Accepted</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-red-600">
            {appointments.filter(a => a.status === "REJECTED").length}
          </div>
          <div className="text-xs sm:text-sm text-red-700">Rejected</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg shadow-sm border text-center col-span-2 sm:col-span-1">
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {appointments.filter(a => a.status === "AVAILABLE").length}
          </div>
          <div className="text-xs sm:text-sm text-green-700">Available</div>
        </div>
      </div>

      {/* جدول المواعيد - عرض الجدول على الشاشات المتوسطة والكبيرة */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>

              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Patient</th>
              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Phone</th>
              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Date</th>
              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Time</th>
              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
              <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 sm:p-8 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">{i + 1}</td>
                  <td className="p-3 sm:p-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {a.patientName || "-"}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                    {a.patientPhone || "-"}
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                    {new Date(a.date).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-gray-900">
                    {a.time}
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${a.status === "AVAILABLE" ? "bg-green-100 text-green-800" : ""}
                      ${a.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${a.status === "ACCEPTED" ? "bg-blue-100 text-blue-800" : ""}
                      ${a.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    {a.status === "PENDING" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => updateStatus(a.id, "ACCEPTED")}
                          disabled={updating === a.id}
                          className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {updating === a.id ? "..." : "Accept"}
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, "REJECTED")}
                          disabled={updating === a.id}
                          className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {updating === a.id ? "..." : "Reject"}
                        </button>
                      </div>
                    )}
                    {(a.status === "ACCEPTED" || a.status === "REJECTED") && (
                      <span className="text-xs text-gray-400">Completed</span>
                    )}
                    {a.status === "AVAILABLE" && (
                      <span className="text-xs text-gray-400">Available Slot</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* بطاقات المواعيد - عرض على الشاشات الصغيرة */}
      <div className="md:hidden space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-500">No appointments found</div>
          </div>
        ) : (
          filteredAppointments.map((a, i) => (
            <div key={a.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
       
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${a.status === "AVAILABLE" ? "bg-green-100 text-green-800" : ""}
                    ${a.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${a.status === "ACCEPTED" ? "bg-blue-100 text-blue-800" : ""}
                    ${a.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                  `}>
                    {a.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">{a.time}</div>
              </div>

              {/* معلومات المريض */}
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500">Patient</div>
                  <div className="text-sm font-medium">{a.patientName || "Available Slot"}</div>
                </div>
                {a.patientPhone && (
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="text-sm font-medium">{a.patientPhone}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm font-medium">
                    {new Date(a.date).toLocaleDateString("en-US")}
                  </div>
                </div>
              </div>

              
              {a.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateStatus(a.id, "ACCEPTED")}
                    disabled={updating === a.id}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {updating === a.id ? "Processing..." : "Accept"}
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, "REJECTED")}
                    disabled={updating === a.id}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {updating === a.id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}