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
        // If password doesn't match
        alert('Invalid username or password');
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-b from-[#257446] to-[#234D35] p-12 flex flex-col justify-center items-center text-white">
        <img
          src={`${process.env.PUBLIC_URL}/images/cattle.png`} 
          alt="Cattle illustration"
          className="mb-8 w-3/4 h-auto"
        />
        <p className="text-3xl font-bold mb-2">
          Empowering <span className="text-yellow-400">farmers</span>,
        </p>
        <p className="text-3xl font-bold">
          transforming <span className="text-yellow-400">auctions</span>.
        </p>
      </div>

      {/* Right Section with Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-white">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Welcome to OKsyon</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
