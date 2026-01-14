import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';
import { authAPI } from '../../services/api';
import { ROLE_ROUTES } from '../../utils/roleConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data;

            dispatch(setCredentials({ user, token }));

            const redirectPath = ROLE_ROUTES[user.role] + '/dashboard';
            navigate(redirectPath);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-2xl w-96">
                <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">HR ERP Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
