import React from 'react';
import TopHeader from './TopHeader';

const Auction = () => {
  const auctionData = [
    {
      species: 'Cattle',
      PNS1: '500-600 kg',
      PNS2_3: '450-500 kg',
      PNS4_3: '350-400 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Fattener',
    },
    {
      species: 'Carabao',
      PNS1: '220-330 kg',
      PNS2_3: '450-470 kg',
      PNS4_3: '480-500 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Work/Draft',
    },
    {
      species: 'Horse',
      PNS1: '500-600 kg',
      PNS2_3: '450-500 kg',
      PNS4_3: '350-400 kg',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
      thirdRow: 'Work/Draft',
    },
    {
      species: 'Goat',
      PNS1: '',
      PNS2_3: '',
      PNS4_3: '',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
    },
    {
      species: 'Hog',
      PNS1: '',
      PNS2_3: '',
      PNS4_3: '',
      liveWeight: 'Liveweight',
      dressedWeight: 'Estimated Dressed weight',
    },
  ];

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
                    <td className="p-3">{item.PNS1}</td>
                    <td className="p-3">{item.PNS2_3}</td>
                    <td className="p-3">{item.PNS4_3}</td>
                  </tr>
                  <tr className="border-t bg-gray-100">
                    <td className="p-3">Liveweight</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Estimated Dressed weight</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  {item.thirdRow && (
                    <tr className="border-t bg-gray-100">
                      <td className="p-3">{item.thirdRow}</td>
                      <td className="p-3"></td>
                      <td className="p-3"></td>
                      <td className="p-3"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded self-center">Edit</button>
      <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded self-center">Add</button>      
      <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded self-center">DONE</button>   
    </div>
  );
};

export default Auction;
