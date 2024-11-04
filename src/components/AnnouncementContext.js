// AnnouncementContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure correct import path for Supabase client

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null); // State to handle errors

  // Fetch announcements from Supabase on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error.message);
        setError('Error fetching announcements. Please try again later.');
      }
    };

    fetchAnnouncements();
  }, []);

  // Function to save a new announcement in Supabase
  const saveAnnouncement = async (newAnnouncement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([newAnnouncement]);

      if (error) throw error;

      // Optimistically update state with new announcement
      setAnnouncements((prev) => [
        { ...newAnnouncement, created_at: new Date().toISOString() }, // Add timestamp for consistency
        ...prev,
      ]);
    } catch (error) {
      console.error('Error saving announcement:', error.message);
      setError('Error saving announcement. Please try again.');
    }
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, saveAnnouncement, error }}>
      {children}
    </AnnouncementContext.Provider>
  );
};
