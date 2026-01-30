// app/dashboard/doctor/page.tsx
"use client";

import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";
import UsersList from "@/app/components/UserList";
import AppointmentsList from "@/app/components/AppointmentsList";
import AddBlogPage from "../../blogform/page";
import BlogList from "@/app/components/BlogList";
import DoctorBlogsDashboard from "@/app/components/BlogEdit";
import DoctorCalendar from "@/app/components/DoctorCalendar";
import PatientAppointments from "@/app/components/AppointmentsList";

export default function DoctorDashboard() {
  const [active, setActive] = useState("Users"); // default tab
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "Users":
        return <UsersList />;
      case "Appointments":
        return <PatientAppointments/>;
      case "Calendar":
        return <DoctorCalendar />;
      case "Blog Edit":
        return <DoctorBlogsDashboard/>
      default:
        return <div><AddBlogPage/></div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-6 right-20 z-50 bg-blue-600 text-white p-1 rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0  left-0 z-40 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar active={active} setActive={setActive} onMobileClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 bg-gray-50 md:pt-[100px] pt-20 w-full">
        {renderContent()}
      </div>
    </div>
  );
}