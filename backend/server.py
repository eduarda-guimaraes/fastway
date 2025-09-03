from flask import Flask, jsonify
from flask_cors import CORS  # Importe o CORS
import requests

app = Flask(__name__)
CORS(app)  # Ative o CORS para permitir requisições de diferentes origens

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
