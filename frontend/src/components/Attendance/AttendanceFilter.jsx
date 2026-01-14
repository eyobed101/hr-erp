import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendanceFilter from "./AttendanceFilter";

const api = axios.create({
  baseURL: "http://localhost:3004/api",
});

export default function AttendanceList() {
  const [attendances, setAttendances] = useState([]);

  const fetchFilteredAttendance = async ({ startDate, endDate, employeeId }) => {
    try {
      const res = await api.get("/attendance/filter", {
        params: { startDate, endDate, employeeId },
      });
      setAttendances(res.data);
    } catch (err) {
      console.error("Error fetching filtered attendance:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Component */}
      <AttendanceFilter onFilter={fetchFilteredAttendance} />

      {/* Attendance Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Attendance Records</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Employee ID</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Clock In</th>
              <th className="border px-2 py-1">Clock Out</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((att) => (
              <tr key={att.id}>
                <td className="border px-2 py-1">{att.id}</td>
                <td className="border px-2 py-1">{att.employee_id}</td>
                <td className="border px-2 py-1">{att.clock_date}</td>
                <td className="border px-2 py-1">{att.clock_in ? new Date(att.clock_in).toLocaleTimeString() : "-"}</td>
                <td className="border px-2 py-1">{att.clock_out ? new Date(att.clock_out).toLocaleTimeString() : "-"}</td>
                <td className="border px-2 py-1">{att.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
