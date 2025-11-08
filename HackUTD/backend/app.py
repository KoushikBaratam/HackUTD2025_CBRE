from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")  # allows requests from your React frontend

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask! This is Koushik!")

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.get_json()
    return jsonify(received=data)

if __name__ == '__main__':
    app.run(debug=True)
