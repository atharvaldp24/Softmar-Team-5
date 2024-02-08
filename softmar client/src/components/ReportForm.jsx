import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Connection from "./Connection";
import Select from "react-select";
import nextPortOptions from "./ports";

const ReportForm = () => {
  Connection();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reportDateTime: "",
    latitude: "",
    longitude: "",
    avgSpeed: "",
    distance: "",
    stoppageHours: "",
    stoppageNotes: "",
    distanceToGo: "",
    nextPort: "",
    nextPortETA: "",
    reportNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedNextPort, setSelectedNextPort] = useState(null);

  useEffect(() => {
    // Fetch "lastReport" value from local storage and add one to it
    const lastReport = localStorage.getItem("lastReport");
    const nextReportNumber = lastReport ? parseInt(lastReport, 10) + 1 : 1;

    setFormData((prevFormData) => ({
      ...prevFormData,
      reportNumber: nextReportNumber.toString(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Save the most recent longitude and latitude in local storage
    if (name === "longitude" || name === "latitude") {
      const recentCoordinates = {
        longitude: name === "longitude" ? value : formData.longitude,
        latitude: name === "latitude" ? value : formData.latitude,
      };

      localStorage.setItem(
        "recentCoordinates",
        JSON.stringify(recentCoordinates)
      );
    }
  };

  const handleNextPortChange = (selectedOption) => {
    setSelectedNextPort(selectedOption);
    setFormData({
      ...formData,
      nextPort: selectedOption ? selectedOption.value : "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "reportNumber") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    // Validate distance, distanceToGo, reportNumber, and stoppageHours as positive integers
    const positiveIntegerFields = [
      "distance",
      "distanceToGo",
      "reportNumber",
      "stoppageHours",
    ];
    positiveIntegerFields.forEach((fieldName) => {
      const fieldValue = formData[fieldName];
      if (
        fieldValue !== "" &&
        (!Number.isInteger(Number(fieldValue)) || Number(fieldValue) < 0)
      ) {
        newErrors[fieldName] = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be a positive integer`;
      }
    });

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();

    // If form is valid, store data in local storage
    if (Object.keys(errors).length === 0) {
      const reportNumber = formData.reportNumber;
      const reportData = { ...formData };

      // Store reportNumber and reportData in local storage
      localStorage.setItem(reportNumber, JSON.stringify(reportData));
      localStorage.setItem("lastReport", reportNumber);

      // Log the form data to the console
      console.log("Form submitted and data stored in local storage:", formData);

      // Clear the form
      setFormData({
        reportDateTime: "",
        latitude: "",
        longitude: "",
        avgSpeed: "",
        distance: "",
        stoppageHours: "",
        stoppageNotes: "",
        distanceToGo: "",
        nextPort: "",
        nextPortETA: "",
        reportNumber: "",
      });

      // Show success message
      alert("Report pushed to the queue successfully");
      navigate("/dashboard");
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US");

  return (
    <>
      <Navbar />
      <center>
        <div className="max-w-5xl mt-12 flex bg-white rounded-md shadow-md py-3 px-6 gap-x-12">
          <div className="font-semibold">Voyage Number: 7654</div>
          <div className="font-semibold">IMO Number: 3477856</div>
          <div className="font-semibold">Vessel Number: 3477856</div>
          <div className="font-semibold">Current Date: {currentDate}</div>
        </div>
      </center>
      <div className="container mx-auto mt-5 mb-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white p-6 rounded-md shadow-md"
        >
          <h2 className="text-2xl text-gray-800 font-bold">
            Noon Day Report Form
          </h2>
          <p className="mb-16 mt-5 text-gray-600 font-semibold">
          The Noon Day Report, submitted daily around noon during a maritime voyage, provides key data such as the ship's position, speed, and voyage details. It facilitates communication, voyage planning, and ensures safe and efficient maritime operations.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((fieldName) => (
              <div key={fieldName} className="mb-4 px-2">
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-600"
                >
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </label>
                {fieldName === "reportNumber" ? (
                  <input
                    type="text"
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    readOnly={true}
                    className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500 ${
                      errors[fieldName] ? "border-red-500" : ""
                    }`}
                  />
                ) : fieldName === "nextPort" ? (
                  <Select
                    id={fieldName}
                    name={fieldName}
                    value={selectedNextPort}
                    onChange={handleNextPortChange}
                    options={nextPortOptions}
                    placeholder={`Select ${fieldName}`}
                    className={`mt-1 w-full focus:outline-none ${
                      errors[fieldName] ? "border-red-500" : ""
                    }`}
                  />
                ) : (
                  <input
                    type="text"
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    placeholder={`Enter ${fieldName}`}
                    className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500 ${
                      errors[fieldName] ? "border-red-500" : ""
                    }`}
                  />
                )}
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[fieldName]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#172554] mt-10 text-white rounded"
          >
            Push Report in Queue
          </button>
        </form>
      </div>
    </>
  );
};

export default ReportForm;
