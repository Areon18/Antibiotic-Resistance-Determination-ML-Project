# 🧬 ResistPredict  
### Predict Antibiotic Resistance from Gene Sequences

> 🚀 A machine learning-powered web app that predicts antibiotic resistance using DNA sequence analysis.

---

## 🌐 Live Demo
- 🔗 Frontend: https://your-frontend-url.vercel.app  
- 🔗 Backend API: https://your-backend-url.onrender.com  

---

## 🧠 Overview

ResistPredict is an end-to-end machine learning application that analyzes gene sequences (ATGC format) and predicts whether they exhibit antibiotic resistance.

It combines:
- 🧪 Bioinformatics (k-mer feature extraction)
- 🤖 Machine Learning (Random Forest)
- 🌐 Full-stack deployment (Flask + React)

---

## ⚙️ How It Works

### 1. Input
User provides a DNA sequence:ATGCGTACGATCGATCG...


---

### 2. Feature Extraction (k-mers)

The sequence is broken into overlapping substrings.

Example (k=3):ATG, TGC, GCG, CGT...


These are converted into a numerical feature vector.

---

### 3. Model Prediction

- Model: **Random Forest Classifier**
- Output:
  - `1` → Resistant  
  - `0` → Not Resistant  

---

### 4. Confidence Score

If available, the model returns probability:Confidence = max(probabilities)


---

## 🧱 Tech Stack

### 🔹 Machine Learning
- Python  
- NumPy  
- scikit-learn  

### 🔹 Backend
- Flask  
- Flask-CORS  
- Gunicorn  

### 🔹 Frontend
- React + Vite  
- TypeScript  

### 🔹 Deployment
- Backend → Render  
- Frontend → Vercel  

---

## 📁 Project Structure

project/
├── backend/
│ ├── app.py
│ ├── model.pkl
│ ├── kmer_index.pkl
│ └── requirements.txt
│
├── frontend-clean/
│ ├── src/
│ ├── package.json
│ └── vite.config.ts


---

## 🚀 Run Locally

### Backend

```bash
cd backend
py app.py

Frontend

cd frontend-clean
npm install
npm run dev

🔗 API Endpoint
POST /predict
Request:
{
  "gene": "ATGCGTACGATCG..."
}

Response:
{
  "result": 1,
  "confidence": 0.94
}


🎯 Features
✅ Real-time prediction
✅ Confidence scoring
✅ Input validation
✅ Mobile responsive UI
✅ Fully deployed