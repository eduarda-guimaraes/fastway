import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const INLINE_CSS_ID = 'foods-inline-styles';
const CSS_TEXT = `
  .food-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.08);
    background: #fff;
  }
  .food-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }

  .food-image {
    height: 150px;
    object-fit: cover;
    background: #f8f9fa;
  }

  .price-tag {
    background: #198754;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.8rem;
  }

  .category-badge {
    background: rgba(25, 135, 84, 0.08);
    color: #198754;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
    font-size: 0.7rem;
  }

  .add-to-cart-btn {
    transition: all 0.2s ease;
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
  }
  .add-to-cart-btn:hover {
    transform: scale(1.05);
    background: #0f6848;
  }

  .search-container {
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    z-index: 5;
    font-size: 0.9rem;
  }
`;

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);

  // Buscar dados da API
  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/foods');
      const data = await response.json();
      setFoods(data);
      setFilteredFoods(data);
      
      const uniqueCategories = ['Todos', ...new Set(data.map(food => food.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
    }
  };

  // Filtro
  useEffect(() => {
    let result = foods;
    
    if (searchTerm) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'Todos') {
      result = result.filter(food => food.category === selectedCategory);
    }
    
    setFilteredFoods(result);
  }, [searchTerm, selectedCategory, foods]);

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <style id={INLINE_CSS_ID}>{CSS_TEXT}</style>
      
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="h4 fw-bold text-dark mb-1">Cardápio</h1>
          <p className="text-muted small">Escolha suas comidas favoritas</p>
        </div>

        {/* Filtros e Busca */}
        <div className="row mb-4 g-2">
          <div className="col-md-8">
            <div className="search-container">
              <span className="search-icon">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-sm ps-4 rounded-pill"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-select-sm rounded-pill"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-egg-fried display-6 text-muted d-block mb-2"></i>
            <h6 className="text-muted">Nenhum alimento encontrado</h6>
            <p className="text-muted small">Tente ajustar sua busca ou filtros</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {filteredFoods.map((food, index) => (
              <div key={index} className="col">
                <div className="card food-card h-100">
                  <div className="position-relative">
                    <img 
                      src={food.image || 'https://via.placeholder.com/300x150?text=Comida'} 
                      alt={food.name} 
                      className="food-card-img-top food-image" 
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="price-tag">R$ {food.price}</span>
                    </div>
                    {food.category && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="category-badge">{food.category}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-semibold mb-2">{food.name}</h6>
                    {food.description && (
                      <p className="card-text text-muted small mb-2">{food.description}</p>
                    )}
                    
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      {food.restaurant && (
                        <small className="text-muted">{food.restaurant}</small>
                      )}
                      <button className="btn btn-success btn-sm add-to-cart-btn rounded-pill">
                        <i className="bi bi-cart-plus me-1"></i>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {foods.length === 0 && filteredFoods.length === 0 && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3 text-muted small">Carregando comidas...</p>
          </div>
        )}
      </div>
      
      <Footer /> 
    </div>
  );
};

export default Foods;
