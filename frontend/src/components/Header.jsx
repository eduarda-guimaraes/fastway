import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-success py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="text-white fs-4 fw-bold">
          <img src="/logo.png" alt="FastWay Logo" width="40" height="40" className="me-2" />
          FastWay
        </div>
        <ul className="d-flex gap-3 text-white">
          <li>
            <NavLink 
              to="/" 
              className="text-decoration-none text-white fs-5"
              activeClassName="border-bottom border-white" // Estilo quando ativo
            >
              Home
            </NavLink>
          </li>  
          <li>
            <NavLink 
              to="/restaurants" 
              className="text-decoration-none text-white fs-5"
              activeClassName="border-bottom border-white" // Estilo quando ativo
            >
              Restaurantes
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/foods" 
              className="text-decoration-none text-white fs-5"
              activeClassName="border-bottom border-white" // Estilo quando ativo
            >
              Comidas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/users" 
              className="text-decoration-none text-white fs-5"
              activeClassName="border-bottom border-white" // Estilo quando ativo
            >
              Perfil
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
