
import joblib
import numpy as np

# Load saved model and kmer index
model = joblib.load("model.pkl")
kmer_index = joblib.load("kmer_index.pkl")

# Function to encode gene
def encode_gene(seq, k=3):
    
    features = np.zeros(len(kmer_index))
    
    for i in range(len(seq) - k + 1):
        kmer = seq[i:i+k]
        if kmer in kmer_index:
            features[kmer_index[kmer]] += 1
            
    return features


# Take input from user
gene = input("Enter gene sequence:\n")

# Encode gene
encoded = encode_gene(gene)

# Predict
prediction = model.predict([encoded])[0]

# Show result
print("\nPrediction Result:")

if prediction == 1:
    print("Resistant")
else:
    print("Not Resistant")