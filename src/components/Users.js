import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrorMessage(null); // Clear any existing errors

      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setErrorMessage('Error fetching users. Please try again later.');
        console.error('Error fetching users:', error);
      } else {
        // Map data to match the UI structure
        const formattedData = data.map((profile) => ({
          user_id: profile.id,
          name: profile.full_name,
          email: profile.email,
        }));
        setUsers(formattedData);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopHeader title="Users" />

      {/* Main Content */}
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-800 text-white text-left">
                <th className="p-2">User ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-t">
                  <td className="p-2">{user.user_id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
