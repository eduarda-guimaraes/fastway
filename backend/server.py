# backend/server.py
from flask import Flask, jsonify
import requests

app = Flask(__name__)

# Função para consumir a API de usuários
def get_users():
    url = 'https://apifakedelivery.vercel.app/users'
    response = requests.get(url)
    return response.json()

# Função para consumir a API de restaurantes
def get_restaurants():
    url = 'https://apifakedelivery.vercel.app/restaurants'
    response = requests.get(url)
    return response.json()

# Função para consumir a API de alimentos
def get_foods():
    url = 'https://apifakedelivery.vercel.app/foods'
    response = requests.get(url)
    return response.json()

@app.route('/api/users')
def users():
    users_data = get_users()
    return jsonify(users_data)

@app.route('/api/restaurants')
def restaurants():
    restaurants_data = get_restaurants()
    return jsonify(restaurants_data)

@app.route('/api/foods')
def foods():
    foods_data = get_foods()
    return jsonify(foods_data)

if __name__ == '__main__':
    app.run(debug=True)
