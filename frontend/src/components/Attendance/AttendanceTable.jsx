import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceTable() {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Adjust URL to match your backend route
        const res = await axios.get("http://localhost:5000/api/attendance");
        setAttendances(res.data); // backend should return array of attendance records
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Clock In</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Clock Out</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Shift Start</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Shift End</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((emp) => (
            <tr key={emp.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{emp.name}</td>
              <td className="px-4 py-2">{emp.clockIn || "-"}</td>
              <td className="px-4 py-2">{emp.clockOut || "-"}</td>
              <td className="px-4 py-2">{emp.shiftStart}</td>
              <td className="px-4 py-2">{emp.shiftEnd}</td>
              <td className="px-4 py-2">{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}