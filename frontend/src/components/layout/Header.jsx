import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const Header = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Welcome back!</h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-600">
                    {user?.first_name} {user?.last_name}
                </span>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
            </div>
        </header>
    );
};

export default Header;
