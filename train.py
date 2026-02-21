import numpy as np
import joblib
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
data = np.load("dataset.npy", allow_pickle=True)
data = data.item()

genes = data['genes']
labels = data['resistant'].astype(int)

print("Dataset loaded")
print("Total samples:", len(genes))


# Function to extract kmers
def get_kmers(seq, k=3):
    return [seq[i:i+k] for i in range(len(seq) - k + 1)]


# Build vocabulary
vocab = Counter()
for g in genes:
    vocab.update(get_kmers(g))

kmers_list = [k for k, _ in vocab.most_common()]
kmer_index = {k: i for i, k in enumerate(kmers_list)}

print("Total features:", len(kmers_list))


# Encode sequences
X = np.zeros((len(genes), len(kmers_list)))

for i, g in enumerate(genes):
    for k in get_kmers(g):
        if k in kmer_index:
            X[i, kmer_index[k]] += 1


# Split data
X_train, X_test, y_train, y_test, genes_train, genes_test = train_test_split(
    X, labels, genes,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("Model trained")


# Test accuracy
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)

print("Accuracy:", acc)


# Save model and encoding
joblib.dump(model, "model.pkl")
joblib.dump(kmer_index, "kmer_index.pkl")
joblib.dump(genes_test, "genes_test.pkl")
joblib.dump(y_test, "y_test.pkl")

print("Everything saved")
