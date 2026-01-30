"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: number;
  phone: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Failed to fetch users");

        setUsers(data.users);
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // تصفية المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* العنوان والإحصائيات */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Users Management
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage all system users and their roles
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-blue-600">{users.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {users.filter(u => u.role === "PATIENT").length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Patients</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-purple-600">
            {users.filter(u => u.role === "DOCTOR").length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Doctors</div>
        </div>
   
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* شريط البحث */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          {/* تصفية الدور */}
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Patient</option>
              <option value="DOCTOR">Doctor</option>
          
            </select>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين - للشاشات المتوسطة والكبيرة */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>

                 <th className="p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
           
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    
                    <td className="p-4">
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      
                        ${user.role === "DOCTOR" ? "bg-purple-100 text-purple-800" : ""}
                     
                      `}>
                        {user.role === "USER" ? "Patient" : user.role.toLowerCase()}
                      </span>
                    </td>
                  <td className="p-4">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* بطاقات المستخدمين - للشاشات الصغيرة */}
     {/* بطاقات المستخدمين - للشاشات الصغيرة */}
<div className="md:hidden space-y-4">
  {filteredUsers.length === 0 ? (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
      <div className="text-gray-500">No users found matching your criteria</div>
    </div>
  ) : (
    filteredUsers.map((user) => (
      <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-semibold text-gray-900">{user.name}</div>

       
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${user.role === "DOCTOR" ? "bg-purple-100 text-purple-800" : ""}
            `}
          >
            {user.role === "USER" ? "Patient" : user.role.toLowerCase()}
          </span>
        </div>
               {/* رقم الهاتف + أيقونة */}
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a1.5 1.5 0 001.5-1.5v-2.25a1.5 1.5 0 00-1.272-1.479l-3.861-.643a1.5 1.5 0 00-1.579.684l-.982 1.637a11.048 11.048 0 01-5.208-5.208l1.637-.982a1.5 1.5 0 00.684-1.579l-.643-3.861A1.5 1.5 0 008.25 3.75H6a1.5 1.5 0 00-1.5 1.5v1.5z"
                  />
                </svg>
                <span>{user.phone}</span>
              </div>

        {/* الإيميل أسفل الهاتف */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center text-sm">
            <svg
              className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-600">{user.email}</span>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      
      {filteredUsers.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
          {(searchTerm || roleFilter !== "ALL") && " (filtered)"}
        </div>
      )}
    </div>
  );
}