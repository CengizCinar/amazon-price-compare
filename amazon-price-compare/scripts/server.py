from flask import Flask, request, jsonify
from flask_cors import CORS
from keepa2 import get_keepa_ean

app = Flask(__name__)
CORS(app)

@app.route('/get_ean', methods=['POST'])
def get_ean():
    try:
        data = request.json
        asin = data.get('asin')
        if not asin:
            return jsonify({'error': 'ASIN gerekli'}), 400
            
        ean = get_keepa_ean(asin)
        return jsonify({'ean': ean})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
