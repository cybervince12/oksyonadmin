import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client

const TopHeader = ({ title}) => {
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const { data, error } = await supabase
          .from('admins') // Replace 'admins' with the name of your table
          .select('username') // Replace 'username' with the column that stores the admin's name
          .eq('role', 'admin') // Example condition to fetch admin user
          .single();

        if (error) {
          console.error('Error fetching admin username:', error);
          setAdminName('Admin'); // Fallback in case of an error
        } else if (data && data.username) {
          setAdminName(data.username);
        } else {
          setAdminName('Admin'); // Fallback if username is unavailable
        }
      } catch (error) {
        console.error('Unexpected error fetching admin username:', error);
        setAdminName('Admin'); // Fallback in case of an unexpected error
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="fixed top-0 left-16 lg:left-64 w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] z-50 p-4 lg:p-6 bg-white shadow-md flex justify-between items-center">
      {/* Title */}
      <h1 className="text-xl lg:text-3xl font-bold text-green-800">{title}</h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Profile Section */}
        <div className="hidden sm:flex items-center gap-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm lg:text-base">{adminName}</p>
            <p className="text-xs lg:text-sm text-green-700">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
