import joblib

# Load test genes
genes_test = joblib.load("genes_test.pkl")

# Print first gene
print("First test gene:")
print(genes_test[0])

# Print first 60 characters
print("\nShort preview:")
print(genes_test[0][:60])