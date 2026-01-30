"use client";
import Sidebar from "../../../../app/components/Sidebar";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-160px)] bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
\
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
