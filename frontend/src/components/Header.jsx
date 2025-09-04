// frontend/src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-success py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo à esquerda */}
        <div className="d-flex align-items-center">
          <img src="./logo1.png" alt="FastWay Logo" width="70" height="70" className="me-2" />
          <div className="text-white fs-4 fw-bold">FastWay</div>
        </div>
        
        {/* Menu de navegação à direita */}
        <ul className="d-flex gap-4 m-0 list-unstyled">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `fs-5 fw-normal text-decoration-none ${isActive ? 'text-warning' : 'text-white'}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                `fs-5 fw-normal text-decoration-none ${isActive ? 'text-warning' : 'text-white'}`
              }
            >
              Restaurantes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/foods"
              className={({ isActive }) =>
                `fs-5 fw-normal text-decoration-none ${isActive ? 'text-warning' : 'text-white'}`
              }
            >
              Comidas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `fs-5 fw-normal text-decoration-none ${isActive ? 'text-warning' : 'text-white'}`
              }
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
