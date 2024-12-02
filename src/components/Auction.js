import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';

const Auction = () => {
  const [currentPage, setCurrentPage] = useState('PNS1');
  const [auctionData, setAuctionData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

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

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e, index, priceIndex) => {
    const { name, value } = e.target;
    const updatedData = [...auctionData];
    updatedData[index].prices[priceIndex][name] = value;
    setAuctionData(updatedData);
  };

  // Save the updated auction data to the database
  const handleSave = async () => {
    try {
      if (currentPage === 'PNS1' || currentPage === 'PNS3') {
        // Save updates for PNS1 and PNS3
        for (const item of auctionData) {
          for (const price of item.prices) {
            const { label, value } = price;

            // Update price in the corresponding table (PNS1 or PNS3)
            const { error } = await supabase
              .from(currentPage === 'PNS1' ? 'pns1_prices' : 'pns3_prices')
              .upsert({ label, price_value: value }, { onConflict: ['label'] });

            if (error) {
              console.error('Error saving data:', error);
            }
          }
        }
      } else if (currentPage === 'PNS2') {
        // Save updates for PNS2
        for (const item of auctionData) {
          for (const price of item.prices) {
            const { label, value } = price;

            // Update price for the animal in PNS2 table
            const { error } = await supabase
              .from('pns2_prices')
              .upsert(
                { animal_id: item.animal.id, label, price_value: value },
                { onConflict: ['animal_id', 'label'] }
              );

            if (error) {
              console.error('Error saving data:', error);
            }
          }
        }
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  const renderContent = () => {
    return (
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-center space-x-4 mb-6">
            {['PNS1', 'PNS2', 'PNS3'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-6 py-2 font-semibold rounded-lg ${
                  currentPage === page
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="p-3 border">Species</th>
                  <th className="p-3 border">Weight Range</th>
                  <th className="p-3 border">Prices</th>
                </tr>
              </thead>
              <tbody>
                {auctionData.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-gray-50 border-b">
                      <td className="p-3 font-semibold">{item.animal}</td>
                      <td className="p-3 text-gray-700">{item.weightRange}</td>
                      <td className="p-3">
                        {item.prices.map((price, priceIndex) => (
                          <div key={priceIndex} className="mb-2">
                            <span className="font-medium text-gray-700">{price.label}: </span>
                            {isEditable ? (
                              <input
                                type="text"
                                name="value"
                                value={price.value}
                                onChange={(e) => handleInputChange(e, index, priceIndex)}
                                className="ml-2 border p-1 rounded"
                              />
                            ) : (
                              <span className="text-gray-800">{price.value}</span>
                            )}
                          </div>
                        ))}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleEditToggle}
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 shadow-md"
            >
              {isEditable ? 'Cancel Edit' : 'Edit'}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-md"
            >
              SAVE
            </button>
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
