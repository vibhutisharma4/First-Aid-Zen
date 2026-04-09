import pandas as pd
import numpy as np
import pickle
import scipy.sparse as sp
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.impute import SimpleImputer

df = pd.read_csv("data_clean.csv")
print("Loaded shape:", df.shape)

TEXT_COL = "chief_complaint"
TARGET = "severity"
NUMERIC_COLS = ["Age", "pain_score", "Injury", "Mental",
                "SBP", "DBP", "HR", "RR", "BT", "Saturation"]
NUMERIC_COLS = [c for c in NUMERIC_COLS if c in df.columns]

# Handle missing numeric values
imputer = SimpleImputer(strategy="median")
X_numeric = imputer.fit_transform(df[NUMERIC_COLS])

# TF-IDF on chief complaint
df[TEXT_COL] = df[TEXT_COL].fillna("unknown")
tfidf = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
X_text = tfidf.fit_transform(df[TEXT_COL])

# Combine
X = sp.hstack([sp.csr_matrix(X_numeric), X_text])
y = df[TARGET].values

print(f"Feature matrix: {X.shape}")
print(f"Target distribution:\n{pd.Series(y).value_counts().sort_index()}")

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred,
      target_names=["KTAS 1","KTAS 2","KTAS 3","KTAS 4","KTAS 5"]))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save
artifacts = {
    "model": model,
    "imputer": imputer,
    "tfidf": tfidf,
    "numeric_cols": NUMERIC_COLS,
}
with open("model.pkl", "wb") as f:
    pickle.dump(artifacts, f)

print("\n✅ model.pkl saved")