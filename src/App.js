import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './companents/login';
import Dashboard from './companents/dashboard';
import WorkDetail from './companents/workdetail';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/work/:id" element={<WorkDetail />} />
      </Routes>
    </Router>
  );
};

export default App;