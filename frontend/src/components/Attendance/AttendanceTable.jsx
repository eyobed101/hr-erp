import React from 'react';

export default function AttendanceTable() {
  const employees = [
    {
      id: 1,
      name: 'John Doe',
      clockIn: '2026-01-14T08:30:00',
      clockOut: '2026-01-14T17:00:00',
      shiftStart: '2026-01-14T08:00:00',
      shiftEnd: '2026-01-14T16:00:00',
      status: 'Present',
    },
    {
      id: 2,
      name: 'Jane Smith',
      clockIn: '2026-01-14T09:15:00',
      clockOut: '2026-01-14T15:00:00',
      shiftStart: '2026-01-14T08:00:00',
      shiftEnd: '2026-01-14T16:00:00',
      status: 'Late',
    },
    {
      id: 3,
      name: 'Michael Lee',
      clockIn: null,
      clockOut: null,
      shiftStart: '2026-01-14T08:00:00',
      shiftEnd: '2026-01-14T16:00:00',
      status: 'Absent',
    },
    {
      id: 4,
      name: 'Sarah Kim',
      clockIn: '2026-01-14T08:00:00',
      clockOut: '2026-01-14T12:00:00',
      shiftStart: '2026-01-14T08:00:00',
      shiftEnd: '2026-01-14T16:00:00',
      status: 'Half Day',
    },
  ];

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
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800">{emp.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {emp.clockIn ? new Date(emp.clockIn).toLocaleTimeString() : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {emp.clockOut ? new Date(emp.clockOut).toLocaleTimeString() : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {new Date(emp.shiftStart).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {new Date(emp.shiftEnd).toLocaleTimeString()}
              </td>
              <td
                className={`px-4 py-2 text-sm font-medium ${
                  emp.status === 'Present'
                    ? 'text-green-600'
                    : emp.status === 'Late'
                    ? 'text-yellow-600'
                    : emp.status === 'Absent'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
              >
                {emp.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}