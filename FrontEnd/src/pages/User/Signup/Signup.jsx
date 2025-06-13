import React, { useState, useEffect } from "react";
import '@styles/user.css';
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    // Redirect to home if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Submit signup data (without confirmPassword)
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const result = await signup(userData);
            if (!result.success) {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="font-robot min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="font-robot max-w-[25rem] w-full space-y-8 bg-white p-8 rounded-lg border border-[#0000002e]">
                <div style={{borderBottom: '0.5px solid '}}>
                    <h2 className="font-robot mt-6 text-center text-3xl font-bold text-black">
                        Sign up
                    </h2>
                    <h2 className="font-robot mt-6 text-center text-[12px] text-[#0000007a]">
                        Enter your information below to create an account
                    </h2>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                        {error}
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="font-robot block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="font-robot block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="font-robot block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Create a password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="font-robot block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{' '}
                        <button 
                            type="button"
                            onClick={() => navigate('/signin')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in
                        </button>
                    </p>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-black bg-white hover:bg-grey-100 focus:outline-none border-gray-300"
                        >
                            Continue without signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

