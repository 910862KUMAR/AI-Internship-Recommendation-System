from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import joblib
import pandas as pd
import os
from sklearn.metrics.pairwise import cosine_similarity


# ===================================
# CREATE FASTAPI
# ===================================
app = FastAPI(title="AI Internship Recommendation API")


# ===================================
# ENABLE CORS
# ===================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===================================
# FILE PATHS
# ===================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "semantic_model.pkl")
embeddings_path = os.path.join(BASE_DIR, "internship_embeddings.pkl")
dataset_path = os.path.join(BASE_DIR, "Aicte Intership Dataset.csv")


# ===================================
# LOAD AI MODEL
# ===================================
print("Loading Semantic AI Model...")

model = joblib.load(model_path)
internship_embeddings = joblib.load(embeddings_path)

print("AI Model Loaded")


# ===================================
# LOAD DATASET
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
# SKILL EXTRACTION
# ===================================
def extract_matched_skills(resume_text):

    SKILL_KEYWORDS = [
        "python","java","django","flask","react",
        "machine learning","data science","sql",
        "tensorflow","fastapi","api","backend"
    ]

    resume_text = resume_text.lower()
    matched = []

    for skill in SKILL_KEYWORDS:
        if skill in resume_text:
            matched.append(skill.title())

    return matched


# ===================================
# SKILL GAP ANALYSIS
# ===================================
def skill_gap(resume_skills, job_title):

    JOB_SKILLS = {
        "data": ["Python","Machine Learning","SQL","Tensorflow"],
        "backend": ["Java","API","FastAPI","SQL"],
        "frontend": ["React","JavaScript","HTML","CSS"]
    }

    job_title = job_title.lower()

    required = []

    for key in JOB_SKILLS:
        if key in job_title:
            required = JOB_SKILLS[key]

    missing = []

    for skill in required:
        if skill not in resume_skills:
            missing.append(skill)

    return missing


# ===================================
# LEARNING RECOMMENDATION
# ===================================
def learning_recommend(missing_skills):

    learning_map = {
        "Tensorflow":"Learn Deep Learning with TensorFlow",
        "Machine Learning":"Study Machine Learning Algorithms",
        "SQL":"Practice SQL for Data Analysis",
        "React":"Learn React Frontend Development"
    }

    suggestions = []

    for skill in missing_skills:
        if skill in learning_map:
            suggestions.append(learning_map[skill])

    return suggestions


# ===================================
# DOMAIN DETECTION
# ===================================
def detect_domain(job_title):

    job_title = job_title.lower()

    if "data" in job_title or "ml" in job_title:
        return "Data Science / AI"

    elif "backend" in job_title or "api" in job_title:
        return "Backend Development"

    elif "frontend" in job_title or "react" in job_title:
        return "Frontend Development"

    elif "android" in job_title:
        return "Mobile Development"

    else:
        return "General / Other"


# ===================================
# APPLY LINK GENERATOR
# ===================================
def generate_apply_link(company):

    company = company.lower()

    if "google" in company or "microsoft" in company:
        return "https://www.linkedin.com/jobs"

    elif "nagar" in company or "panchayat" in company:
        return "https://internship.aicte-india.org"

    else:
        return "https://internshala.com/internships"


# ===================================
# SEMANTIC RECOMMENDER
# ===================================
def semantic_recommend(resume_text, top_n=5):

    resume_embedding = model.encode([resume_text])

    similarities = cosine_similarity(
        resume_embedding,
        internship_embeddings
    )[0]

    top_indices = similarities.argsort()[-top_n:][::-1]

    results = df.iloc[top_indices].copy()

    results["Match Score (%)"] = (
        similarities[top_indices] * 100
    ).round(2)

    # Skill Extraction
    resume_skills = extract_matched_skills(resume_text)

    # Domain Detection
    results["domain"] = results["job title"].apply(detect_domain)

    # Internship Ranking
    results = results.sort_values(by="Match Score (%)", ascending=False)
    results["rank"] = range(1, len(results)+1)

    # Skill Gap + Learning
    gaps = []
    learning = []

    for job in results["job title"]:
        missing = skill_gap(resume_skills, job)
        gaps.append(missing)
        learning.append(learning_recommend(missing))

    results["skill_gap"] = gaps
    results["learning_recommendation"] = learning

    # Resume AI Score
    ai_score = round((len(resume_skills) / 12) * 100, 2)
    results["resume_ai_score"] = ai_score

    # Apply Link
    results["apply_link"] = results["company name"].apply(generate_apply_link)

    results["matched_skills"] = [resume_skills] * len(results)

    return results[[
        'rank',
        'job title',
        'company name',
        'cities',
        'states',
        'stipend',
        'duration',
        'domain',
        'matched_skills',
        'skill_gap',
        'learning_recommendation',
        'resume_ai_score',
        'apply_link',
        'Match Score (%)'
    ]]


# ===================================
# HEALTH CHECK
# ===================================
@app.get("/")
def home():
    return {"message": "AI Internship Backend Running"}


# ===================================
# RESUME UPLOAD API
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