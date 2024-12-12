import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';  // Import Supabase client

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query the admin table to find a matching username and password
      const { data, error } = await supabase
        .from('admin')  // Reference the admin table
        .select('*')    // Select all columns
        .eq('username', username)  // Filter by username
        .single();     // Get only the first matching result (since usernames should be unique)

      if (error || !data) {
        // Error handling if username is not found
        alert('Invalid username or password');
        console.error(error);
        return;
      }

      // Check if the password matches
      if (data.password === password) {
        // If the password matches, redirect to the dashboard
        navigate('/admin/dashboard');
      } else {
        alert('Invalid username or password');
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-green-600 to-green-800">
      <div className="w-full sm:w-1/2 bg-gradient-to-b from-[#257446] to-[#234D35] p-12 flex flex-col justify-center items-center text-white">
        <img
          src={`${process.env.PUBLIC_URL}/images/cattle.png`} 
          alt="Cattle illustration"
          className="mb-8 w-3/4 h-auto opacity-90"
        />
        <p className="text-3xl sm:text-4xl font-semibold mb-2 text-center">
          Empowering <span className="text-yellow-400">farmers</span>, transforming <span className="text-yellow-400">auctions</span>.
        </p>
      </div>

      {/* Right Section with Login Form */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-12 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-bold mb-8 text-green-800">Welcome to OKsyon</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
