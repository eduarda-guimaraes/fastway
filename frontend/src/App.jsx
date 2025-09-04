import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Foods from './pages/Foods';
import FoodDetails from './pages/FoodDetails';
import Order from './pages/Order';
import { OrderProvider } from './context/OrderContext';
import './index.css';

const App = () => {
  return (
    <Router>
      <OrderProvider>
        <Header />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/foods/:id" element={<FoodDetails />} />
            <Route path="/pedido" element={<Order />} />
          </Routes>
        </div>
      </OrderProvider>
    </Router>
  );
};

export default App;
