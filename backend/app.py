from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model + kmer index
model = joblib.load("model.pkl")
kmer_index = joblib.load("kmer_index.pkl")

# Same function as training
def get_kmers(seq, k=3):
    return [seq[i:i+k] for i in range(len(seq) - k + 1)]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    gene = data.get("gene")

    if not gene:
        return jsonify({"error": "No gene provided"}), 400

    features = np.zeros((1, len(kmer_index)))

    for kmer in get_kmers(gene):
        if kmer in kmer_index:
            features[0, kmer_index[kmer]] += 1

    prediction = model.predict(features)[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(features)[0]
        confidence = float(np.max(probs))

    return jsonify({
        "result": int(prediction),
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)