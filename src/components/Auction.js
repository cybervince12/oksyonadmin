import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';

const Auction = () => {
  const [currentPage, setCurrentPage] = useState('PNS1');
  const [auctionData, setAuctionData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataResponse;

        // Fetch data based on the current page selection
        if (currentPage === 'PNS1') {
          const { data, error } = await supabase.from('pns1_prices').select('*');
          if (error) throw error;
          dataResponse = data;
        } else if (currentPage === 'PNS2') {
          // Fetch livestock data
          const { data: livestock, error: livestockError } = await supabase.from('pns2_prices').select('*');
          if (livestockError) throw livestockError;

          // Organizing the data: group prices by livestock type (avoiding duplication)
          const livestockTypes = [...new Set(livestock.map((l) => l.livestock))]; // Get unique livestock types
          const dataWithPrices = livestockTypes.map((livestockType) => {
            const pricesForType = livestock.filter((l) => l.livestock === livestockType);
            return {
              livestock: livestockType,
              weightRange: pricesForType[0]?.weight_range, // Use the weight range of the first price entry
              prices: pricesForType.map((price) => ({
                id: price.id,
                label: price.label,
                price_min: price.price_min || '',
                price_max: price.price_max || '',
              })),
            };
          });

          dataResponse = dataWithPrices;
        } else if (currentPage === 'PNS3') {
          const { data, error } = await supabase.from('pns3_prices').select('*');
          if (error) throw error;
          dataResponse = data;
        }

        // Organize data for PNS1 and PNS3 where prices are listed by weight range and livestock
        if (currentPage === 'PNS1' || currentPage === 'PNS3') {
          const organizedData = dataResponse.reduce((acc, item) => {
            const { livestock, weight_range, label, id, price_min, price_max } = item;
            const existingLivestock = acc.find((a) => a.livestock === livestock);

            if (existingLivestock) {
              existingLivestock.prices.push({ id, label, price_min, price_max });
            } else {
              acc.push({
                livestock,
                weightRange: weight_range,
                prices: [{ id, label, price_min, price_max }],
              });
            }
            return acc;
          }, []);
          setAuctionData(organizedData);
        } else {
          setAuctionData(dataResponse);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e, index, priceIndex, field) => {
    const { value } = e.target;
    const updatedData = [...auctionData];
    updatedData[index].prices[priceIndex][field] = value;
    setAuctionData(updatedData);
  };

  const handleSave = async () => {
    try {
      const updates = auctionData.flatMap((item) =>
        item.prices.map((price) => ({
          id: price.id,
          price_min: price.price_min,
          price_max: price.price_max,
        }))
      );

      // Save the updates based on the current page
      for (const update of updates) {
        if (currentPage === 'PNS1' || currentPage === 'PNS3') {
          const { error } = await supabase
            .from(currentPage === 'PNS1' ? 'pns1_prices' : 'pns3_prices')
            .update({
              price_min: update.price_min,
              price_max: update.price_max,
            })
            .eq('id', update.id);

          if (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
            return;
          }
        } else if (currentPage === 'PNS2') {
          const { error } = await supabase
            .from('pns2_prices')
            .update({
              price_min: update.price_min,
              price_max: update.price_max,
            })
            .eq('id', update.id);

          if (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
            return;
          }
        }
      }

      setIsEditable(false);
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
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center space-x-4 mb-6">
            {['PNS1', 'PNS2', 'PNS3'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-6 py-2 font-semibold rounded-lg ${currentPage === page ? 'bg-green-700 text-white shadow-md' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="overflow-auto">
            <table className="table-auto sm:table-fixed w-full border border-gray-300">
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
                      <td className="p-3 font-semibold">{item.livestock}</td>
                      <td className="p-3 text-gray-700">{item.weightRange}</td>
                      <td className="p-3">
                        {item.prices.map((price, priceIndex) => (
                          <div key={priceIndex} className="mb-2">
                            <span className="font-medium text-gray-700">{price.label}: </span>
                            <input
                              type="text"
                              name="price_min"
                              value={price.price_min}
                              onChange={(e) => handleInputChange(e, index, priceIndex, 'price_min')}
                              className="ml-2 border p-1 rounded"
                              disabled={!isEditable}
                            />
                            <input
                              type="text"
                              name="price_max"
                              value={price.price_max}
                              onChange={(e) => handleInputChange(e, index, priceIndex, 'price_max')}
                              className="ml-2 border p-1 rounded w-full sm:w-auto"
                              disabled={!isEditable}
                            />
                          </div>
                        ))}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleEditToggle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditable ? 'Cancel Edit' : 'Edit'}
            </button>
            {isEditable && (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <TopHeader title="Auction" />
      {renderContent()}
    </div>
  );
};

export default Auction;
