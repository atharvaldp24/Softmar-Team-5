import React from 'react';
import { Link } from 'react-router-dom';
import Connection from './Connection';

const Home = () => {
  Connection();
  return (
    <>
      <center>

      <div className="flex flex-col items-center justify-center mt-[200px]">
        <h1 className="text-5xl mb-4 text-gray-800 font-bold">Softmar Noon-day Report Application</h1>
        <h2 className="text-lg text-gray-700 mb-4 max-w-3xl">Simplifying ship captains' reports anytime, anywhere. Offline capabilities, customizable templates, and secure cloud storage for seamless maritime communication and compliance.</h2>
        <Link to='/auth'>
        <button className="px-4 py-2 bg-[#172554] mt-10 text-white rounded">Get Started</button>
        </Link>
      </div>
      </center>
    </>
  );
};

export default Home;
