import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import Navbar from "./Navbar";
import Connection from "./Connection";

const Dashboard = () => {
  Connection();
  const [serverData, setServerData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [syncedData, setSyncedData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fetchFromServer, setFetchFromServer] = useState(false);

  useEffect(() => {
    // Function to check local storage and fetch data
    const fetchLocalData = () => {
      const localStorageKeys = Object.keys(localStorage);
      const numericKeys = localStorageKeys.filter(
        (key) => !isNaN(parseInt(key, 10))
      );

      const localStorageData = numericKeys.map((key) => {
        const reportData = JSON.parse(localStorage.getItem(key));
        return { key, ...reportData };
      });

      setLocalData(localStorageData);

      // Fetch synced data from local storage
      const syncedData = JSON.parse(localStorage.getItem("synced")) || [];
      setSyncedData(syncedData);
    };

    // Fetch data from the server only if the checkbox is checked
    const fetchData = async () => {
      if (fetchFromServer) {
        try {
          const response = await fetch("http://localhost:5000/fetch/report");
          if (response.ok) {
            const data = await response.json();
            setServerData(data);
            console.log("Server Data fetched successfully: ", data);
          } else {
            console.error("Failed to fetch data from the server");
          }
        } catch (error) {
          console.error("Error fetching data from the server:", error);
        }
      }
    };

    fetchLocalData();
    fetchData();
    
  }, [fetchFromServer]);

  const openModal = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const deleteReport = (reportKey) => {
    // Delete the report from local storage
    localStorage.removeItem(reportKey);

    // Update the local data state without the deleted report
    setLocalData((prevLocalData) =>
      prevLocalData.filter((report) => report.key !== reportKey)
    );
  };

  return (
    <>
      <Navbar />
      <div className="justify-center items-center flex">
        <div className="max-w-6xl flex gap-x-10 mt-3">
          <div className="w-[400px] ">
            <h2 className="text-yellow-500 font-semibold">Synced</h2>

            {syncedData.map((syncedItem) => {
              // Extract the numeric key (assuming there's only one key in each object)
              const numericKey = Object.keys(syncedItem)[0];
              const report = syncedItem[numericKey];

              return (
                <div
                  key={numericKey}
                  className="block py-1 px-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 mt-5"
                >
                  <h5 className="mb-2 text-md font-semibold tracking-tight text-gray-800">
                    <span>Report No: {numericKey}</span>{" "}
                    <span className="ml-20">{report.reportDateTime}</span>
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    <span>Lat: {report.latitude} </span>{" "}
                    <span className="ml-3"> Long: {report.longitude} </span>{" "}
                    <span className="ml-3"> Nextport: {report.nextPort}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {report.stoppageNotes}
                  </p>

                  <button
                    className="text-blue-800 py-2 underline"
                    onClick={() => openModal(report)}
                  >
                    More Info
                  </button>
                </div>
              );
            })}
          </div>

          <div className="w-[400px]">
            <div>
              <h2 className="text-red-700 font-semibold">Not Synced</h2>

              {localData.map((report) => (
                <div
                  key={report.key}
                  className="block py-1 px-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 mt-5"
                >
                  <h5 className="mb-2 text-md font-semibold tracking-tight text-gray-800">
                    <span>Report No: {report.key}</span>{" "}
                    <span className="ml-20">{report.reportDateTime}</span>
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    <span>Lat: {report.latitude} </span>{" "}
                    <span className="ml-3"> Long: {report.longitude} </span>{" "}
                    <span className="ml-3"> Nextport: {report.nextPort}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {report.stoppageNotes}
                  </p>

                  <div className="flex gap-x-[250px]">


                  <button
                    className="text-blue-800 py-2 underline"
                    onClick={() => openModal(report)}
                    >
                    More Info
                  </button> 
                  <span onClick={() => deleteReport(report.key)} className="mt-3 text-xl text-blue-700"><MdDelete /></span>
                    </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[4000x]">
            <h2 className="text-green-600 font-semibold">
              On Server
              <input
                type="checkbox"
                checked={fetchFromServer}
                onChange={() => setFetchFromServer(!fetchFromServer)}
                className="ml-2"
              />
            </h2>

            {serverData.map((report) => (
              <div
                key={report.reportNumber}
                className="block max-w-sm py-1 px-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 mt-5"
              >
                <h5 className="mb-2 text-md font-semibold tracking-tight text-gray-800">
                  <span>Report No: {report.reportNumber}</span>{" "}
                  <span className="ml-20">{report.reportDateTime}</span>
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  <span>Lat: {report.latitude} </span>{" "}
                  <span className="ml-3"> Long: {report.longitude} </span>{" "}
                  <span className="ml-3"> Nextport: {report.nextPort}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {report.stoppageNotes}
                </p>

                <button
                  className="text-blue-800 py-2 underline"
                  onClick={() => openModal(report)}
                >
                  More Info
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* Modal content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Report Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {/* Display detailed information from selectedReport */}
                        Report No: {selectedReport.reportNumber}
                        <br />
                        Report Date and Time: {selectedReport.reportDateTime}
                        <br />
                        Latitude: {selectedReport.latitude}
                        <br />
                        Longitude: {selectedReport.longitude}
                        <br />
                        Avg Speed: {selectedReport.avgSpeed}
                        <br />
                        Distance: {selectedReport.distance}
                        <br />
                        Stoppage Hours: {selectedReport.stoppageHours}
                        <br />
                        Stoppage Notes: {selectedReport.stoppageNotes}
                        <br />
                        Distance to go: {selectedReport.distanceToGo}
                        <br />
                        Next Port: {selectedReport.nextPort}
                        <br />
                        Next Port ETA: {selectedReport.nextPortETA}
                        <br />
                        {/* Add more fields as needed */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
