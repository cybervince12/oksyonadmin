import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader'; // Import TopHeader component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        setErrorMessage('Error fetching users. Please try again later.');
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Apply TopHeader component */}
      <TopHeader title="Users" />

      {/* Main Content */}
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-800 text-white text-left">
                <th className="p-2">User ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Location</th>
                <th className="p-2">Bidder</th>
                <th className="p-2">Seller</th>
                <th className="p-2">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.user_id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.location}</td>
                  <td className="p-2">{user.bidder ? '✔' : '✘'}</td>
                  <td className="p-2">{user.seller ? '✔' : '✘'}</td>
                  <td className="p-2">{user.phone}</td>
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
