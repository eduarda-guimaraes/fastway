import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-light-green py-3"> {/* Cor de fundo verde claro */}
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo à esquerda */}
        <div className="d-flex align-items-center">
          <img src="/" alt="FastWay Logo" width="40" height="40" className="me-2" />
          <div className="text-dark fs-4 fw-bold">FastWay</div>
        </div>
        
        {/* Menu de navegação à direita */}
        <ul className="d-flex gap-4 text-dark m-0">
          <li>
            <NavLink
              to="/"
              className="text-decoration-none text-dark fs-5"
              activeClassName="border-bottom border-dark" // Estilo quando ativo
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/restaurants"
              className="text-decoration-none text-dark fs-5"
              activeClassName="border-bottom border-dark"
            >
              Restaurantes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/foods"
              className="text-decoration-none text-dark fs-5"
              activeClassName="border-bottom border-dark"
            >
              Comidas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className="text-decoration-none text-dark fs-5"
              activeClassName="border-bottom border-dark"
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
