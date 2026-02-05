from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import joblib
import pandas as pd
import os
from sklearn.metrics.pairwise import cosine_similarity


# ===================================
# ✅ CREATE FASTAPI
# ===================================
app = FastAPI(title="AI Internship Recommendation API")


# ===================================
# ✅ ENABLE CORS
# ===================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===================================
# ✅ FILE PATHS
# ===================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "semantic_model.pkl")
embeddings_path = os.path.join(BASE_DIR, "internship_embeddings.pkl")
dataset_path = os.path.join(BASE_DIR, "Aicte Intership Dataset.csv")


# ===================================
# ✅ LOAD AI MODEL
# ===================================
print("Loading Semantic AI Model...")

model = joblib.load(model_path)
internship_embeddings = joblib.load(embeddings_path)

print("AI Model Loaded ✅")


# ===================================
# ✅ LOAD DATASET
# ===================================
df = pd.read_csv(dataset_path)
df.columns = df.columns.str.strip().str.lower()
df = df.fillna('').astype(str)

if 'combined_text' not in df.columns:
    df['combined_text'] = (
        df['job title'] + " " +
        df['company name'] + " " +
        df['cities'] + " " +
        df['states'] + " " +
        df['stipend'] + " " +
        df['duration']
    )


# ===================================
# 🔥 SEMANTIC RECOMMENDER
# ===================================
def semantic_recommend(resume_text, top_n=5):

    # Resume → embedding
    resume_embedding = model.encode([resume_text])

    # similarity
    similarities = cosine_similarity(
        resume_embedding,
        internship_embeddings
    )[0]

    # top matches
    top_indices = similarities.argsort()[-top_n:][::-1]

    results = df.iloc[top_indices].copy()

    results["Match Score (%)"] = (
        similarities[top_indices] * 100
    ).round(2)

    return results[[
        'job title',
        'company name',
        'cities',
        'states',
        'stipend',
        'duration',
        'Match Score (%)'
    ]]


# ===================================
# ✅ HEALTH CHECK
# ===================================
@app.get("/")
def home():
    return {"message": "🔥 Semantic AI Internship Backend Running"}


# ===================================
# 🔥 RESUME UPLOAD API
# ===================================
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF resumes allowed"}

    text = ""

    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted

    except Exception:
        return {"error": "Failed to read PDF"}

    if text.strip() == "":
        return {"error": "Could not extract text from resume"}

    recommendations = semantic_recommend(text)

    return recommendations.to_dict(orient="records")
