// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import ReportForm from './components/ReportForm';
import IMO from './components/Imo';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imo" element={<IMO />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/report-form" element={<ReportForm />} />
      </Routes>
    </Router>
  );
}