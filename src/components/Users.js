import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrorMessage(null);
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setErrorMessage('Error fetching users. Please try again later.');
        console.error('Error fetching users:', error);
      } else {
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

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditedUser(user);
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedUser.name,
        })
        .eq('id', editedUser.user_id);

      if (error) {
        setErrorMessage('Error updating user. Please try again later.');
        console.error('Error updating user:', error);
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === editedUser.user_id
              ? { ...user, name: editedUser.name }
              : user
          )
        );
        setIsEditing(false);
        setEditedUser(null);
      }
    } catch (error) {
      setErrorMessage('Unexpected error occurred while updating user.');
      console.error('Unexpected error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userToDelete.user_id);
      if (error) {
        setErrorMessage('Error deleting user. Please try again later.');
        console.error('Error deleting user:', error);
      } else {
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userToDelete.user_id));
        setShowConfirmDelete(false);
        setUserToDelete(null);
      }
    } catch (error) {
      setErrorMessage('Unexpected error occurred while deleting user.');
      console.error('Unexpected error deleting user:', error);
    }
  };

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

      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-800 text-white text-left">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.user_id} className="border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setShowConfirmDelete(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl mb-4">Edit User</h2>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
