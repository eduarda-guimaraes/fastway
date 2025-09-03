// frontend/src/pages/Foods.jsx
import React, { useEffect, useState } from 'react';

const Foods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/foods')
      .then((response) => response.json())
      .then((data) => setFoods(data));
  }, []);

  return (
    <div>
      <h1>Alimentos</h1>
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            {food.name} - ${food.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Foods;