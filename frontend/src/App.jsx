// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Importando o Header
import Home from './pages/Home';         // Importando o componente Home
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import Foods from './pages/Foods';
import './index.css';  // Certifique-se de que esse caminho está correto

const App = () => {
  return (
    <Router>
      <Header /> {/* Adicionando o Header aqui */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Alterado para renderizar Home */}
          <Route path="/users" element={<Users />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/foods" element={<Foods />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
