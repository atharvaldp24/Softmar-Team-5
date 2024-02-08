import React, { useEffect } from 'react';

const Connection = () => {
  useEffect(() => {
    const checkInternetConnection = async () => {
      if (navigator.onLine) {
        // Check local storage for data
        const localStorageKeys = Object.keys(localStorage);

        for (const key of localStorageKeys) {
          const storedData = localStorage.getItem(key);

          if (storedData) {
            const dataToPost = JSON.parse(storedData);
            const serverEndpoint = 'http://localhost:5000/save/report';

            try {
              // Make POST request for each data entry
              const response = await fetch(serverEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Add any other headers you may need
                },
                body: JSON.stringify({
                  unique_key: "kugdiu43287tiurgo34r824rgoiuhewoihfw", 
                  reportData: dataToPost,
                  reportNumber: key
                }),
              });

              if (response.ok) {
                // Save the record in the "synced" array only if it doesn't already exist
                const syncedArray = JSON.parse(localStorage.getItem('synced')) || [];
                const existingRecordIndex = syncedArray.findIndex(record => Object.keys(record)[0] === key);

                if (existingRecordIndex === -1) {
                  syncedArray.push({ [key]: dataToPost });

                  // Sort the array by key values in descending order
                  syncedArray.sort((a, b) => Object.keys(b)[0] - Object.keys(a)[0]);

                  // Keep only the top three records
                  const topThreeSynced = syncedArray.slice(0, 3);

                  // Save the updated "synced" array in local storage
                  localStorage.setItem('synced', JSON.stringify(topThreeSynced));

                  // Remove the item from local storage
                  localStorage.removeItem(key);
                  console.log("deleting");
                }
              }
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          }
        }
      }
    };

    // Check for internet connection periodically
    const intervalId = setInterval(checkInternetConnection, 30000);

    // Initial check on component mount
    checkInternetConnection();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default Connection;
