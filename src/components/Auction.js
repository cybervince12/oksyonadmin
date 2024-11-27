import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Make sure your Supabase client is correctly configured
import TopHeader from './TopHeader';

const Auction = () => {
  const [currentPage, setCurrentPage] = useState('PNS1'); // Set PNS1 as default page
  const [auctionData, setAuctionData] = useState([]);

  // Fetch data from Supabase based on the current page
  useEffect(() => {
    const fetchData = async () => {
      let dataResponse;
      let error;

      if (currentPage === 'PNS1') {
        ({ data: dataResponse, error } = await supabase.from('pns1_prices').select('*'));
      } else if (currentPage === 'PNS2') {
        const { data: animals, error: animalError } = await supabase.from('pns2_animals').select('*');
        if (animalError) console.error(animalError);

        const animalIds = animals.map((animal) => animal.id);
        const { data: prices, error: priceError } = await supabase
          .from('pns2_prices')
          .select('*')
          .in('animal_id', animalIds);

        if (priceError) console.error(priceError);

        dataResponse = animals.map((animal) => ({
          animal: animal.animal,
          weightRange: animal.weight_range,
          prices: prices
            .filter((price) => price.animal_id === animal.id)
            .map((price) => ({ label: price.label, value: price.price_value })),
        }));
      } else if (currentPage === 'PNS3') {
        ({ data: dataResponse, error } = await supabase.from('pns3_prices').select('*'));
      }

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // Organize data by animal for easier mapping in the component
        if (currentPage === 'PNS1' || currentPage === 'PNS3') {
          const organizedData = dataResponse.reduce((acc, item) => {
            const { animal, weight_range, label, price_value } = item;
            const existingAnimal = acc.find((a) => a.animal === animal);

            if (existingAnimal) {
              existingAnimal.prices.push({ label, value: price_value });
            } else {
              acc.push({
                animal,
                weightRange: weight_range,
                prices: [{ label, value: price_value }],
              });
            }
            return acc;
          }, []);
          setAuctionData(organizedData);
        } else {
          setAuctionData(dataResponse);
        }
      }
    };

    fetchData();
  }, [currentPage]);

  // Render the main content based on the current page
  const renderContent = () => {
    return (
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4 relative">
          <div className="flex justify-center space-x-2 mb-4">
            <button onClick={() => setCurrentPage('PNS1')} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">PNS1</button>
            <button onClick={() => setCurrentPage('PNS2')} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">PNS2</button>
            <button onClick={() => setCurrentPage('PNS3')} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">PNS3</button>
          </div>
          <table className="w-full table-auto border-collapse mt-4">
            <thead>
              <tr className="bg-green-800 text-white text-left">
                <th className="p-3 border">Species</th>
                {currentPage === 'PNS1' && <th className="p-3 border">PNS 1</th>}
                {currentPage === 'PNS2' && <th className="p-3 border">PNS 2-3</th>}
                {currentPage === 'PNS3' && <th className="p-3 border">PNS 4-5</th>}
              </tr>
            </thead>
            <tbody>
              {auctionData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="border-t">
                    <td className="p-3 font-bold">{item.animal}</td>
                    {currentPage === 'PNS1' && (
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.weightRange}
                          className="border border-gray-300 p-1 rounded w-full bg-gray-200 cursor-not-allowed"
                          disabled
                        />
                      </td>
                    )}
                    {currentPage === 'PNS2' && (
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.weightRange}
                          className="border border-gray-300 p-1 rounded w-full bg-gray-200 cursor-not-allowed"
                          disabled
                        />
                      </td>
                    )}
                    {currentPage === 'PNS3' && (
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.weightRange}
                          className="border border-gray-300 p-1 rounded w-full bg-gray-200 cursor-not-allowed"
                          disabled
                        />
                      </td>
                    )}
                  </tr>
                  {item.prices.map((price, priceIndex) => (
                    <tr key={priceIndex} className="border-t bg-gray-100">
                      <td className="p-3">{price.label}</td>
                      <td className="p-3" colSpan="3">
                        <input
                          type="text"
                          value={price.value}
                          className="border border-gray-300 p-1 rounded w-full bg-gray-200 cursor-not-allowed"
                          disabled
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex space-x-2">
            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded self-center">SAVE</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <TopHeader title={currentPage} />
      {renderContent()}
    </div>
  );
};

export default Auction;
