# Antibiotic Resistance Prediction using Machine Learning

## Overview

This project predicts whether a bacterial gene sequence indicates antibiotic resistance using k-mer feature extraction and a Random Forest classifier.

## Problem Statement

Given a gene sequence, predict whether it is resistant or not resistant to antibiotics.

## Methodology

* Converted gene sequences into 3-mer frequency vectors
* Trained a Random Forest classifier
* Achieved ~94% accuracy

## Dataset

Dataset sourced from Kaggle:
https://www.kaggle.com/datasets/drscarlat/dzd-data

## How to Run

1. Install requirements
2. Load dataset in same folder as other file
3. Run train.py
4. Run demo to get a test gene sequance
5. Run app.py to determine if the gene is antibiotic resistance or not 
