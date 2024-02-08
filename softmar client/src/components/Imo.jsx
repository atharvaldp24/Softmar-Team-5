import React, { useState, useEffect } from "react";
import Connection from "./Connection";
import { useNavigate } from "react-router-dom";
import  img_ship  from "./imo_img.jpg";

function isIMONumber(number) {
  // Check if the input is a string
  if (typeof number !== "string") {
    return false;
  }

  // Check if the string starts with "IMO" and is followed by a 7-digit number
  const imoRegex = /^IMO\d{7}$/;
  if (!imoRegex.test(number)) {
    return false;
  }

  // Extract the 6-digit sequential unique number
  const sequentialNumber = number.slice(3, 9);

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    sum += parseInt(sequentialNumber[i], 10) * (7 - i);
  }

  // Calculate the check digit based on the rules
  const checkDigit = sum % 10;

  // Check if the calculated check digit matches the actual check digit
  return checkDigit === parseInt(number[9], 10);
}

const IMO = () => {
  const navigate = useNavigate();
  Connection();

  // State to store form data
  const [formData, setFormData] = useState({
    voyageNumber: "",
    vesselNumber: "",
    IMO: "",
  });

  useEffect(() => {
    // Check if imoData is present in local storage
    const imoData = localStorage.getItem("imoData");
    if (imoData) {
      // If imoData is present, navigate to "/dashboard"
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isIMONumber(formData.IMO)) {
      alert("Enter a valid IMO number");
      return;
    }

    // Save data to local storage if IMO number is valid
    const imoData = {
      voyageNumber: formData.voyageNumber,
      vesselNumber: formData.vesselNumber,
      IMO: formData.IMO,
    };

    // Save the IMO data to local storage
    localStorage.setItem("imoData", JSON.stringify(imoData));
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 bg-gray-50 p-8 rounded shadow-md w-[70%] max-w-screen-xl">
          {/* Left side - Form */}
          <div>
            <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
              IMO Information
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="voyageNumber"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Enter the Voyage Number
                </label>
                <input
                  type="text"
                  id="voyageNumber"
                  name="voyageNumber"
                  value={formData.voyageNumber}
                  onChange={handleChange}
                  required
                  placeholder="E.g., ABC123"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vesselNumber"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Enter the Vessel Number
                </label>
                <input
                  type="text"
                  id="vesselNumber"
                  name="vesselNumber"
                  value={formData.vesselNumber}
                  onChange={handleChange}
                  required
                  placeholder="E.g., XYZ456"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="IMO"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Enter a Valid IMO Number
                </label>
                <input
                  type="text"
                  id="IMO"
                  name="IMO"
                  value={formData.IMO}
                  onChange={handleChange}
                  required
                  placeholder="E.g., IMO1234567"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            <p className="mt-3 text-sm text-red-500 mb-2">
              *Fill these details at PORT with a proper internet connection.
              These details will be asked only once or until you reset.
            </p>
              <button
                type="submit"
                className="w-full bg-[#172554] text-white py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Right side - Image */}
          <center>
            <div className="">
              <img
                src={img_ship}
                alt="Ship"
                className="object-cover w-[300px] h-[280px] rounded-md mt-12 ml-8 shadow-md"
              />
            </div>
          </center>
        </div>
      </div>
    </>
  );
};

export default IMO;
