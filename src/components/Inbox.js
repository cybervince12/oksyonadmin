import React, { useState } from 'react';

const Inbox = ({ emails = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter emails based on the search term
  const filteredEmails = emails.filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Inbox Header */}
      <div className="p-6 bg-gradient-to-b from-[#257446] to-[#234D35] text-white">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>

      {/* Search Bar */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Search mail"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Inbox Content */}
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white rounded shadow-md">
          <ul>
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <li key={email.id} className="border-b p-4 flex justify-between items-center hover:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <div>
                      <div className="font-semibold">
                        {email.sender}
                        {email.isPrimary && <span className="text-blue-500"> (Primary)</span>}
                      </div>
                      <div className="text-gray-600">{email.subject}</div>
                    </div>
                  </div>
                  <span className="text-gray-500">{email.time}</span>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No emails found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
