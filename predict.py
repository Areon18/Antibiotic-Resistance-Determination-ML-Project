import joblib

model = joblib.load("model.pkl")

print("Model loaded successfully")

import numpy as np
sample = np.random.randint(0, 4, (1, 64))

prediction = model.predict(sample)

print("Prediction:", prediction)
