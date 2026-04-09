from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import scipy.sparse as sp

app = Flask(__name__)
CORS(app)

with open("model.pkl", "rb") as f:
    artifacts = pickle.load(f)

model = artifacts["model"]
imputer = artifacts["imputer"]
tfidf = artifacts["tfidf"]
NUMERIC_COLS = artifacts["numeric_cols"]

KTAS_INFO = {
    1: {
        "label": "Critical",
        "color": "red",
        "message": "This is a life-threatening emergency.",
        "action": "Call 112 immediately. Do not wait."
    },
    2: {
        "label": "Emergent",
        "color": "orange",
        "message": "This is an urgent condition requiring immediate attention.",
        "action": "Go to the emergency room immediately."
    },
    3: {
        "label": "Urgent",
        "color": "yellow",
        "message": "This condition needs prompt medical care.",
        "action": "Visit an emergency room or urgent care as soon as possible."
    },
    4: {
        "label": "Less Urgent",
        "color": "blue",
        "message": "This condition is not immediately life-threatening.",
        "action": "Visit a clinic or doctor within a few hours."
    },
    5: {
        "label": "Minor",
        "color": "green",
        "message": "This appears to be a minor condition.",
        "action": "Basic first aid may be sufficient. See a doctor if it worsens."
    }
}

def build_features(data):
    numeric_values = []
    for col in NUMERIC_COLS:
        val = data.get(col, None)
        try:
            numeric_values.append(float(val))
        except (TypeError, ValueError):
            numeric_values.append(np.nan)

    X_numeric = imputer.transform([numeric_values])
    X_text = tfidf.transform([data.get("chief_complaint", "unknown").lower().strip()])
    return sp.hstack([sp.csr_matrix(X_numeric), X_text])


def run_prediction(data):
    X = build_features(data)
    prediction = int(model.predict(X)[0])
    confidence = float(round(max(model.predict_proba(X)[0]) * 100, 1))
    ktas = KTAS_INFO.get(prediction, KTAS_INFO[3])

    return {
        "ktas_level": prediction,
        "label": ktas["label"],
        "color": ktas["color"],
        "message": ktas["message"],
        "action": ktas["action"],
        "confidence": confidence,
        "disclaimer": "This is not a substitute for professional medical advice.",
    }


@app.route("/", methods=["GET"])
def index():
    return jsonify(
        {
            "message": "First Aid Zen backend is running.",
            "endpoints": {
                "health": "/health",
                "predict": "/predict (POST)",
                "api_health": "/api/health",
                "api_predict": "/api/predict (POST)",
            },
        }
    )

@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        X = build_features(data)
        prediction = int(model.predict(X)[0])
        confidence = float(round(max(model.predict_proba(X)[0]) * 100, 1))
        ktas = KTAS_INFO.get(prediction, KTAS_INFO[3])

        return jsonify({
            "ktas_level": prediction,
            "label": ktas["label"],
            "color": ktas["color"],
            "message": ktas["message"],
            "action": ktas["action"],
            "confidence": confidence,
            "disclaimer": "This is not a substitute for professional medical advice."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)