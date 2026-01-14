import AttendanceTable from "../../components/Attendance/AttendanceTable";
import AttendanceForm from "../../components/Attendance/AttendanceForm";
import AttendanceFilter from "../../components/Attendance/AttendanceFilter";

const Attendance = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Attendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceForm profile={{ id: 106, name: "Abe" }} />
        <AttendanceFilter />
      </div>

      {/* Attendance Table below */}
      <div className="bg-white p-6 rounded-lg shadow">
        <AttendanceTable />
      </div>
    </div>
  );
};

export default Attendance;