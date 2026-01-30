"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { FaUser, FaCalendarAlt, FaUserEdit, FaTimes } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaUserClock } from "react-icons/fa6";

interface SidebarProps {
  active?: string;
  setActive?: Dispatch<SetStateAction<string>>;
  onMobileClose?: () => void;
}

export default function Sidebar({ active = "", setActive, onMobileClose }: SidebarProps) {
  const [localActive, setLocalActive] = useState(active);

  const items = [
    { name: "Users", icon: <FaUser className="text-xl" /> },
    { name: "Appointments", icon: <FaUserClock className="text-xl" /> },
    { name: "Calendar", icon: <FaCalendarAlt className="text-xl" /> },
    { name: "Blog Form", icon: <FaUserEdit className="text-xl" /> },
    { name: "Blog Edit", icon: <MdEditSquare className="text-xl" /> },
  ];

  const handleSelect = (name: string) => {
    if (setActive) setActive(name);
    else setLocalActive(name);
    
    // Close sidebar on mobile after selection
    if (onMobileClose) onMobileClose();
  };

  const currentActive = setActive ? active : localActive;

  return (
    <aside className="w-64 md:w-56 min-h-screen bg-gray-100 p-4 flex flex-col relative mt-16 md:mt-10">
      {/* Close button for mobile */}
      <button 
        className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={onMobileClose}
      >
        <FaTimes className="text-xl" />
      </button>

      {items.map((item) => (
        <div
          key={item.name}
          className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
            currentActive === item.name 
              ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600" 
              : "hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleSelect(item.name)}
        >
          <span className="mr-3">{item.icon}</span>
          <span className="font-medium text-sm md:text-base">{item.name}</span>
        </div>
      ))}
    </aside>
  );
}