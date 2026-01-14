const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Active Sessions</h3>
                    <p className="text-3xl font-bold mt-2">89</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">System Health</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">Good</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Pending Tasks</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
