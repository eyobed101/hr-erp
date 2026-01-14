import React, { useState } from "react";
import axios from "axios";

// Create an axios instance with base URL (optional but clean)
const api = axios.create({
  baseURL: "http://localhost:3004/api",
});

export default function AttendanceForm({ profile }) {
  const [clockIn, setClockIn] = useState(null);
  const [clockOut, setClockOut] = useState(null);
  const [status, setStatus] = useState("Absent");
  const [loading, setLoading] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null); // ← Add this
  const shiftStart = "08:00 AM";
  const shiftEnd = "04:00 PM";

  // Helper: Get today's date in YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const handleClockIn = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const now = new Date();
      const nowISO = now.toISOString();
      const today = getTodayDate();

      let newStatus = "Present";
      if (now.getHours() > 8) {
        newStatus = "Late";
      }
      if (8/now.getHours()===2 ) {
        newStatus = "half day";
      }

      const payload = {
        employee_id: 103,
        clock_date: today,
        clock_in: nowISO,
        shift_start: `${today}T08:00:00Z`,
        status: newStatus,
      };

      const response = await api.post("/attendance/clockin", payload);

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        setAttendanceId(data.id);
        setClockIn(nowISO);
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Clock-in error:", error.response?.data || error.message);
      alert("Failed to clock in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (loading) return;
    if (!attendanceId) {
      alert("No attendance record found to clock out.");
      return;
    }
    setLoading(true);

    try {
      const nowISO = new Date().toISOString();

      const payload = {
        clock_out_time: nowISO,
      };

      const response = await api.put(
        `/attendance/clockout/${attendanceId}`,
        payload
      );

      if (response.status === 200) {
        setClockOut(nowISO);
      }
    } catch (error) {
      console.error("Clock-out error:", error.response?.data || error.message);
      alert("Failed to clock out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px] mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Attendance Form</h2>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Shift Start: {shiftStart}</span>
        <span>Shift End: {shiftEnd}</span>
      </div>
      <div className="flex justify-between space-x-4">
        <button
          onClick={handleClockIn}
          disabled={loading || !!clockIn}
          className={`flex-1 py-2 rounded ${
            clockIn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {clockIn ? "Already Clocked In" : "Clock In"}
        </button>
        <button
          onClick={handleClockOut}
          disabled={loading || !clockIn || !!clockOut}
          className={`flex-1 py-2 rounded ${
            !clockIn || clockOut
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {clockOut ? "Already Clocked Out" : "Clock Out"}
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-700">
          Clock In: {clockIn ? new Date(clockIn).toLocaleTimeString() : "-"}
        </p>
        <p className="text-gray-700">
          Clock Out: {clockOut ? new Date(clockOut).toLocaleTimeString() : "-"}
        </p>
        <p
          className={`font-semibold mt-2 ${
            status === "Present"
              ? "text-green-600"
              : status === "Late"
              ? "text-yellow-600"
              : status === "Half Day"
              ? "text-blue-600"
              : "text-red-600"
          }`}
        >
          Status: {status}
        </p>
      </div>
    </div>
  );
}
