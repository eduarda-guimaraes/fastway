import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const restaurantsResponse = await fetch('http://localhost:5000/api/restaurants');
      const restaurantsData = await restaurantsResponse.json();
      setRestaurants(restaurantsData);

      const foodsResponse = await fetch('http://localhost:5000/api/foods');
      const foodsData = await foodsResponse.json();
      setFoods(foodsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white min-vh-100">
      <div className="container py-4">
        {/* Promoção */}
        <div className="promo-section text-center text-white rounded p-5 mb-5 position-relative">
          <h2 className="display-5 fw-bold mb-3">Promoção Especial</h2>
          <h4 className="fw-semibold">Super Combo Burger + Batata + Refri</h4>
          <p className="fs-3 text-warning fw-bold">R$ 19,90</p>
          <p className="lead">Aproveite essa oferta incrível em nossos restaurantes!</p>
        </div>

        {/* Busca */}
        <div className="text-center mb-5">
          <div className="search-container mx-auto">
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-lg rounded-pill ps-5"
              placeholder="O que você quer comer hoje?"
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="text-center mb-5">
          <h3 className="mb-4">Categorias</h3>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-success rounded-pill">
              🍔 Burgers
            </button>
            <button className="btn btn-outline-success rounded-pill">
              🍕 Pizzas
            </button>
            <button className="btn btn-outline-success rounded-pill">
              🍣 Japonês
            </button>
            <button className="btn btn-outline-success rounded-pill">
              🌮 Mexicano
            </button>
          </div>
        </div>

        {/* Restaurantes */}
        <div className="mb-5">
          <h3 className="mb-4 text-center">Restaurantes Populares</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Carregando restaurantes...</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
              {restaurants.map((restaurant, index) => (
                <div key={index} className="col">
                  <div className="card h-100 shadow-sm border-0 restaurant-card">
                    <img
                      src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurante'}
                      alt={restaurant.name}
                      className="card-img-top restaurant-img"
                    />
                    <div className="card-body text-center">
                      <h6 className="fw-semibold">{restaurant.name}</h6>
                      <span className="badge bg-success">
                        Entrega em {restaurant.deliveryTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alimentos */}
        <div className="mb-5">
          <h3 className="mb-4 text-center">Alimentos</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Carregando alimentos...</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {foods.map((food, index) => (
                <div key={index} className="col">
                  <div className="card h-100 shadow-sm border-0 food-card">
                    <div className="position-relative">
                      <img
                        src={food.image || 'https://via.placeholder.com/300x200?text=Comida'}
                        alt={food.name}
                        className="card-img-top food-img"
                      />
                      <span className="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1">
                        R$ {food.price}
                      </span>
                    </div>
                    <div className="card-body text-center">
                      <h6 className="fw-semibold">{food.name}</h6>
                      {food.description && (
                        <p className="text-muted small mb-0">{food.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* CSS extra */}
      <style>{`
        .promo-section {
          background: url('/promocao.jpg') center/cover no-repeat;
        }
        .promo-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
        }
        .promo-section * {
          position: relative;
          z-index: 1;
        }
        .restaurant-card, .food-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .restaurant-card:hover, .food-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }
        .restaurant-img, .food-img {
          height: 150px;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .search-container {
          position: relative;
          width: 50%;
        }
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default Home;
