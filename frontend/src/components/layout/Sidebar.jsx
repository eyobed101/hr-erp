import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentRole, logout } from '../../features/auth/authSlice';
import { NAVIGATION_CONFIG } from '../../utils/roleConfig';

const Sidebar = () => {
    const role = useSelector(selectCurrentRole);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navItems = NAVIGATION_CONFIG[role] || [];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold">HR ERP</h2>
                <p className="text-sm text-gray-400 mt-1 capitalize">{role} Portal</p>
            </div>

            <nav className="flex-1 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="block py-3 px-4 rounded hover:bg-gray-700 transition mb-2"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
