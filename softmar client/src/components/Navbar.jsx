import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [prevOnlineStatus, setPrevOnlineStatus] = useState(navigator.onLine);
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [mapModalContent, setMapModalContent] = useState("");

  useEffect(() => {
    function handleOnlineStatus() {
      setOnline(true);
    }

    function handleOfflineStatus() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  useEffect(() => {
    // Check if isOnline status changes from the previous status
    if (isOnline !== prevOnlineStatus) {
      setPrevOnlineStatus(isOnline);

      // Reload the page
      window.location.reload();
    }
  }, [isOnline, prevOnlineStatus]);

  useEffect(() => {
    // Check if imoData is present in local storage
    const imoData = localStorage.getItem("imoData");
    if (!imoData) {
      // If imoData is not present, navigate to "/"
      navigate("/");
    }
  }, [navigate]);

  const openMapModal = () => {
    const recentCoordinates = JSON.parse(localStorage.getItem("recentCoordinates"));

    // Check if recentCoordinates is present in local storage
    if (recentCoordinates && recentCoordinates.latitude && recentCoordinates.longitude) {
      // Build the map link with recent coordinates
      const mapLink = `https://maps.google.com/maps?q=${recentCoordinates.latitude},${recentCoordinates.longitude}&output=embed&z=3`;

      // Set the map link in the iframe source
      setMapModalContent(mapLink);
    }

    setMapModalOpen(true);
  };

  const closeMapModal = () => {
    setMapModalOpen(false);
  };

  const handleNewVoyage = () => {
    // Delete imoData from local storage
    localStorage.removeItem("imoData");

    // Navigate to "/"
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto rounded-md mt-4 bg-[#172554] mb-5 py-3 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
      {/* Left side with status button */}
      <div className="flex bg-gray-100 font-semibold px-3 py-1 rounded-md items-center shadow-sm mb-2 md:mb-0">
        <button
          className={`rounded-full h-4 w-4 mr-2 ${
            isOnline ? "bg-green-600" : "bg-red-600"
          }`}
        ></button>
        <span className="">{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Center with navigation options */}
      <center>
        <div className="text-white  flex-grow justify-between text-center md:text-left">
          <Link to="/dashboard">
            <a href="" className="block md:inline mx-2 md:mx-3 my-1 md:my-0">
              Dashboard
            </a>
          </Link>
          <Link to="/report-form">
            <a href="" className="block md:inline mx-2 md:mx-3 my-1 md:my-0">
              Report
            </a>
          </Link>
          <a
            href="#"
            onClick={openMapModal}
            className="block md:inline mx-2 md:mx-3 my-1 md:my-0"
          >
            Map
          </a>
          <Link to="/">
            <a href="" className="block md:inline mx-2 md:mx-3 my-1 md:my-0">
              Logout
            </a>
          </Link>
        </div>
      </center>

      {/* Right side with reset option */}
      <div className="text-center text-white md:text-right">
        <button className="" onClick={handleNewVoyage}>
          Update Voyage
        </button>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-1 rounded-md w-[80%] h-[70%]">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="map"
              scrolling="no"
              src={mapModalContent}
            ></iframe>

            {/* Add your map content here */}
            <button
              className="mt-3 py-1 px-4 rounded-md bg-[#172554] text-white"
              onClick={closeMapModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
