import pandas as pd
import numpy as np

df = pd.read_csv("data.csv", sep=";", encoding="latin-1")

print("Raw shape:", df.shape)

# Replace garbage values
df.replace("??", np.nan, inplace=True)
df.replace("#BO\xde!", np.nan, inplace=True)
df.replace("", np.nan, inplace=True)

# Strip whitespace
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Fix European decimal format
if "KTAS duration_min" in df.columns:
    df["KTAS duration_min"] = (
        df["KTAS duration_min"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )
    df["KTAS duration_min"] = pd.to_numeric(df["KTAS duration_min"], errors="coerce")

# Convert numeric columns
numeric_cols = ["Age", "SBP", "DBP", "HR", "RR", "BT", "Saturation",
                "NRS_pain", "Patients number per hour", "Length of stay_min"]

for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

# Drop rows where target is missing
df = df.dropna(subset=["KTAS_expert"])
df["KTAS_expert"] = df["KTAS_expert"].astype(int)

# Remove outliers
if "Length of stay_min" in df.columns:
    df = df[df["Length of stay_min"] < 100000]

# Keep relevant columns
keep_cols = ["Age", "Sex", "Injury", "Mental", "NRS_pain",
             "SBP", "DBP", "HR", "RR", "BT", "Saturation",
             "Chief_complain", "Arrival mode", "KTAS_expert"]

keep_cols = [c for c in keep_cols if c in df.columns]
df = df[keep_cols]

# Rename
df.rename(columns={
    "KTAS_expert": "severity",
    "Chief_complain": "chief_complaint",
    "Arrival mode": "arrival_mode",
    "NRS_pain": "pain_score"
}, inplace=True)

df["chief_complaint"] = df["chief_complaint"].str.lower().str.strip()

print("Cleaned shape:", df.shape)
print("Missing values:\n", df.isnull().sum())
print("Severity distribution:\n", df["severity"].value_counts().sort_index())

df.to_csv("data_clean.csv", index=False)
print("✅ Saved to data_clean.csv")