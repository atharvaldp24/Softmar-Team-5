import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPerson, BsLock, BsHeart } from 'react-icons/bs'; // Import icons
import Connection from './Connection';

const Auth = () => {
  Connection();
  const navigate = useNavigate();

  // Helper function to calculate the sum of ASCII values
  const calculateAsciiSum = (text) => {
    return text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  };

  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    personalQuestion: '',
  });

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

    // Calculate the sum of ASCII values for correct username, password, and pet name
    const correctUsernameSum = calculateAsciiSum('captain');
    const correctPasswordSum = calculateAsciiSum('captain123');
    const correctPetNameSum = calculateAsciiSum('luna');

    // Calculate the sum of ASCII values for user input
    const userInputUsernameSum = calculateAsciiSum(formData.username);
    const userInputPasswordSum = calculateAsciiSum(formData.password);
    const userInputPetNameSum = calculateAsciiSum(formData.personalQuestion);

    // Check if the entered values match the specified conditions
    if (
      userInputUsernameSum === correctUsernameSum &&
      userInputPasswordSum === correctPasswordSum &&
      userInputPetNameSum === correctPetNameSum
    ) {
      // Navigate to /imo route
      navigate('/imo');
    } else {
      // Display an error message or handle authentication failure
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">Captain Validation</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              <BsPerson className="inline-block mr-2" /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Eg: d17012002"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              <BsLock className="inline-block mr-2" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="personalQuestion" className="block text-sm font-medium text-gray-600 mb-1">
              <BsHeart className="inline-block mr-2" /> What is your first pet name?
            </label>
            <input
              type="password"
              id="personalQuestion"
              name="personalQuestion"
              value={formData.personalQuestion}
              onChange={handleChange}
              required
              placeholder="Enter your pet name"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#172554] text-white py-2 rounded-md hover:bg-blue-900 focus:outline-none focus:ring focus:border-blue-300"
          >
            Match Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
