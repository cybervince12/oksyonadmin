import React from 'react';

const Auction = () => {
  const auctionData = [
    { species: 'Cattle', PNS1: '500-600 kg', PNS2_3: '450-500 kg', PNS4_3: '350-400 kg' },
    { species: 'Carabao', PNS1: '220-330 kg', PNS2_3: '450-470 kg', PNS4_3: '480-500 kg' },
    { species: 'Horse', PNS1: '500-600 kg', PNS2_3: '450-500 kg', PNS4_3: '350-400 kg' },
  ];

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Auction</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Species</th>
              <th className="p-2">PNS 1</th>
              <th className="p-2">PNS 2-3</th>
              <th className="p-2">PNS 4-3</th>
            </tr>
          </thead>
          <tbody>
            {auctionData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.species}</td>
                <td className="p-2">{item.PNS1}</td>
                <td className="p-2">{item.PNS2_3}</td>
                <td className="p-2">{item.PNS4_3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Auction;
