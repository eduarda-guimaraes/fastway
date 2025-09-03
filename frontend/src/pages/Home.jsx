import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Estados para armazenar os dados das APIs
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const usersResponse = await fetch('http://localhost:5000/api/users'); // URL completa
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const restaurantsResponse = await fetch('http://localhost:5000/api/restaurants'); // URL completa
      const restaurantsData = await restaurantsResponse.json();
      setRestaurants(restaurantsData);

      const foodsResponse = await fetch('http://localhost:5000/api/foods'); // URL completa
      const foodsData = await foodsResponse.json();
      setFoods(foodsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // Chama a API assim que o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white min-vh-100">
      <div className="container py-5">
        {/* Seção de Promoção */}
        <div className="bg-light p-5 rounded mb-5 text-center">
          <h2 className="display-4 text-success mb-4">Promoção</h2>
          <h3 className="mb-3">Super Combo Burger + Batata + Refri</h3>
          <p className="h4 mb-4">R$19,90</p>
          <p className="lead">Aproveite essa oferta incrível em nossos restaurantes!</p>
        </div>

        {/* Seção de Pesquisa */}
        <div className="text-center mb-5">
          <input 
            type="text" 
            className="form-control form-control-lg rounded-pill w-50 mx-auto" 
            placeholder="O que você quer comer hoje?" 
          />
          <div className="mt-4">
            <button className="btn btn-success rounded-pill">Buscar</button>
          </div>
        </div>

        {/* Cards de Categorias */}
        <div className="text-center mb-5">
          <h3 className="mb-4">Categorias</h3>
          <div className="d-flex justify-content-center gap-4">
            <button className="btn btn-outline-success rounded-pill">Burgers</button>
            <button className="btn btn-outline-success rounded-pill">Pizzas</button>
            <button className="btn btn-outline-success rounded-pill">Japonês</button>
            <button className="btn btn-outline-success rounded-pill">Mexicano</button>
          </div>
        </div>

        {/* Restaurantes Populares */}
        <div className="text-center mb-5">
          <h3 className="mb-4">Restaurantes Populares</h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {/* Cards de Restaurantes */}
            {restaurants.length > 0 ? restaurants.map((restaurant, index) => (
              <div key={index} className="col">
                <div className="card shadow-sm">
                  <img src={restaurant.image || 'https://via.placeholder.com/150'} alt={restaurant.name} className="card-img-top" />
                  <div className="card-body text-center">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text">Entrega em {restaurant.deliveryTime}</p>
                  </div>
                </div>
              </div>
            )) : <p>Carregando restaurantes...</p>}
          </div>
        </div>

        {/* Seção de Alimentos */}
        <div className="text-center mb-5">
          <h3 className="mb-4">Alimentos</h3>
          <div className="d-flex justify-content-center gap-4">
            {foods.length > 0 ? foods.map((food, index) => (
              <div key={index} className="card" style={{ width: '18rem' }}>
                <img src={food.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={food.name} />
                <div className="card-body">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text">R$ {food.price}</p>
                </div>
              </div>
            )) : <p>Carregando alimentos...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
