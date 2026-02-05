from sentence_transformers import SentenceTransformer
import pandas as pd
import joblib

print("Loading dataset...")

df = pd.read_csv("Aicte Intership Dataset.csv")
df = df.fillna('').astype(str)
df.columns = df.columns.str.strip().str.lower()

df["combined_text"] = (
    df["job title"] + " " +
    df["company name"] + " " +
    df["cities"] + " " +
    df["states"] + " " +
    df["stipend"] + " " +
    df["duration"]
)

print("Loading AI model...")

model = SentenceTransformer('all-MiniLM-L6-v2')

print("Creating embeddings (1–3 minutes)...")

embeddings = model.encode(
    df["combined_text"].tolist(),
    show_progress_bar=True
)

print("Saving files...")

joblib.dump(model, "semantic_model.pkl")
joblib.dump(embeddings, "internship_embeddings.pkl")

print("✅ DONE — MODEL READY")
