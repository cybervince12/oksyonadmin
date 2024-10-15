import React from 'react';

const Users = () => {
  const users = [
    { id: '#001', name: 'Earnest Alkuino', location: 'Pagbilao Quezon', bidder: true, seller: true, phone: '0000000000' },
    { id: '#002', name: 'Vincent Castillo', location: 'Lucena City', bidder: true, seller: true, phone: '0000000000' },
    { id: '#003', name: 'Jane Reyes', location: 'Lucena City', bidder: true, seller: true, phone: '0000000000' },
  ];

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">User ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Bidder</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{user.id}</td>
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
  );
};

export default Users;
