// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container d-flex justify-content-between align-items-center">
        <div className="text-white fs-1 fw-bold">FastWay</div>
        <ul className="d-flex gap-3 text-white">
          <li><Link to="/" className="text-decoration-none">Home</Link></li>
          <li><Link to="/restaurants" className="text-decoration-none">Restaurantes</Link></li>
          <li><Link to="/foods" className="text-decoration-none">Comidas</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
