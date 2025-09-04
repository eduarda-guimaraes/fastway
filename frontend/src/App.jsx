// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import Foods from './pages/Foods';
import FoodDetails from './pages/FoodDetails';
import RestaurantDetails from './pages/RestaurantDetails';
import UserDetails from './pages/UserDetails';
import './index.css';

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/foods/:id" element={<FoodDetails />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
