// frontend/src/pages/Restaurants.jsx
import React, { useEffect, useState } from 'react';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then((response) => response.json())
      .then((data) => setRestaurants(data));
  }, []);

  return (
    <div>
      <h1>Restaurantes</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            {restaurant.name} - {restaurant.cuisine}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;