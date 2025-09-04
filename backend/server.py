from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

API_BASE = "https://apifakedelivery.vercel.app"
TIMEOUT = 10  


# -------- Helpers de consumo --------
def safe_get(url):
    try:
        r = requests.get(url, timeout=TIMEOUT)
        r.raise_for_status()
        return r.json(), None
    except requests.RequestException as e:
        return None, str(e)


def get_users():
    return safe_get(f"{API_BASE}/users")[0] or []


def get_restaurants():
    return safe_get(f"{API_BASE}/restaurants")[0] or []


def get_foods():
    return safe_get(f"{API_BASE}/foods")[0] or []


def find_by_id(items, item_id):
    try:
        return next((x for x in items if int(x.get("id")) == int(item_id)), None)
    except Exception:
        return None


# -------- Rotas de lista --------
@app.route('/api/users')
def users():
    data, err = safe_get(f"{API_BASE}/users")
    if err:
        return jsonify({"error": "failed_upstream", "detail": err}), 502
    return jsonify(data)


@app.route('/api/restaurants')
def restaurants():
    data, err = safe_get(f"{API_BASE}/restaurants")
    if err:
        return jsonify({"error": "failed_upstream", "detail": err}), 502
    return jsonify(data)


@app.route('/api/foods')
def foods():
    data, err = safe_get(f"{API_BASE}/foods")
    if err:
        return jsonify({"error": "failed_upstream", "detail": err}), 502
    return jsonify(data)


# -------- Rotas de detalhe --------
@app.route('/api/foods/<int:item_id>')
def food_detail(item_id):
    all_foods = get_foods()
    item = find_by_id(all_foods, item_id)
    if not item:
        return jsonify({"error": "not_found", "message": "Food not found"}), 404
    return jsonify(item)


@app.route('/api/restaurants/<int:item_id>')
def restaurant_detail(item_id):
    all_restaurants = get_restaurants()
    item = find_by_id(all_restaurants, item_id)
    if not item:
        return jsonify({"error": "not_found", "message": "Restaurant not found"}), 404
    return jsonify(item)


if __name__ == '__main__':
    app.run(debug=True)
