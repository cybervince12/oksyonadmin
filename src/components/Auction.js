import React, { useState } from 'react';
import TopHeader from './TopHeader';

const Auction = () => {
  const [auctionData, setAuctionData] = useState([
    {
      species: 'Cattle',
      PNS1: '500-600 kg',
      PNS2_3: '450-500 kg',
      PNS4_3: '350-400 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Fattener',
      liveWeightValue: '',
      dressedWeightValue: '',
      workDraftValue: '',
      isEditable: false, // New property for edit mode
    },
    {
      species: 'Carabao',
      PNS1: '220-330 kg',
      PNS2_3: '450-470 kg',
      PNS4_3: '480-500 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Work/Draft',
      liveWeightValue: '',
      dressedWeightValue: '',
      workDraftValue: '',
      isEditable: false,
    },
    {
      species: 'Horse',
      PNS1: '500-600 kg',
      PNS2_3: '450-500 kg',
      PNS4_3: '350-400 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Work/Draft',
      liveWeightValue: '',
      dressedWeightValue: '',
      workDraftValue: '',
      isEditable: false,
    },
    {
      species: 'Goat',
      PNS1: '',
      PNS2_3: '',
      PNS4_3: '',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      liveWeightValue: '',
      dressedWeightValue: '',
      workDraftValue: '',
      isEditable: false,
    },
    {
      species: 'Hog',
      PNS1: '',
      PNS2_3: '',
      PNS4_3: '',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      liveWeightValue: '',
      dressedWeightValue: '',
      workDraftValue: '',
      isEditable: false,
    },
  ]);

  // Function to handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedData = [...auctionData];
    updatedData[index][field] = value;
    setAuctionData(updatedData);
  };

  // Function to toggle edit mode for a specific item
  const toggleEdit = (index) => {
    const updatedData = [...auctionData];
    updatedData[index].isEditable = !updatedData[index].isEditable;
    setAuctionData(updatedData);
  };

  // Function to save changes and exit edit mode
  const saveChanges = () => {
    const updatedData = auctionData.map(item => ({
      ...item,
      isEditable: false, // Disable edit mode for all items
    }));
    setAuctionData(updatedData);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Apply Top Header */}
      <TopHeader title="Auction" />

      {/* Main Content */}
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4 relative">
          <table className="w-full table-auto border-collapse mt-10">
            <thead>
              <tr className="bg-green-800 text-white text-left">
                <th className="p-3 border">Species</th>
                <th className="p-3 border">PNS 1</th>
                <th className="p-3 border">PNS 2-3</th>
                <th className="p-3 border">PNS 4-3</th>
              </tr>
            </thead>
            <tbody>
              {auctionData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="border-t">
                    <td className="p-3 font-bold">{item.species}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.PNS1}
                        onChange={(e) => handleInputChange(index, 'PNS1', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable} 
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.PNS2_3}
                        onChange={(e) => handleInputChange(index, 'PNS2_3', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.PNS4_3}
                        onChange={(e) => handleInputChange(index, 'PNS4_3', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                  </tr>
                  <tr className="border-t bg-gray-100">
                    <td className="p-3">{item.liveWeight}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.liveWeightValue}
                        onChange={(e) => handleInputChange(index, 'liveWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                    <td className="p-3">
                    <input
                        type="text"
                        value={item.liveWeightValue}
                        onChange={(e) => handleInputChange(index, 'liveWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                    <td className="p-3">
                    <input
                        type="text"
                        value={item.liveWeightValue}
                        onChange={(e) => handleInputChange(index, 'liveWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>

                  </tr>
                  <tr className="border-t">
                    <td className="p-3">{item.dressedWeight}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.dressedWeightValue}
                        onChange={(e) => handleInputChange(index, 'dressedWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                    <td className="p-3">
                    <input
                        type="text"
                        value={item.dressedWeightValue}
                        onChange={(e) => handleInputChange(index, 'dressedWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                    <td className="p-3">
                    <input
                        type="text"
                        value={item.dressedWeightValue}
                        onChange={(e) => handleInputChange(index, 'dressedWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                    </td>
                  </tr>
                  {item.thirdRow && (
                    <tr className="border-t bg-gray-100">
                      <td className="p-3">{item.thirdRow}</td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.workDraftValue}
                          onChange={(e) => handleInputChange(index, 'workDraftValue', e.target.value)}
                          className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                          disabled={!item.isEditable}
                        />
                      </td>
                      <td className="p-3">
                      <input
                        type="text"
                        value={item.dressedWeightValue}
                        onChange={(e) => handleInputChange(index, 'dressedWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                      </td>
                      <td className="p-3">
                      <input
                        type="text"
                        value={item.dressedWeightValue}
                        onChange={(e) => handleInputChange(index, 'dressedWeightValue', e.target.value)}
                        className={`border border-gray-300 p-1 rounded w-full ${item.isEditable ? '' : 'bg-gray-200 cursor-not-allowed'}`}
                        disabled={!item.isEditable}
                      />
                      </td>
                    </tr>
                  )}
                  {/* Edit and Done buttons for each row */}
                  <tr>
                    <td colSpan="4" className="p-3">
                      <button
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={() => toggleEdit(index)} // Toggle edit mode for the specific row
                      >
                        {item.isEditable ? 'Cancel' : 'Edit'}
                      </button>
                      {item.isEditable && (
                        <button
                          className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                          onClick={saveChanges} // Save changes and disable all edit modes
                        >
                          DONE
                        </button>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex space-x-2">
            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded self-center">SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
