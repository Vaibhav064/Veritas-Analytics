import React from 'react';
import { Copy, Terminal, ExternalLink, BookOpen, Check } from 'lucide-react';

const PYTHON_CODE = `# PROFESSIONAL FAKE NEWS DETECTION PIPELINE (v3.0)
# =============================================================================
# Dataset: Fake and Real News Dataset (Kaggle)
# Objective: Train a robust classifier while removing dataset bias.
# Stack: sklearn (Logistic Regression), NLTK, Semantic Analysis (for explanation).

import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.calibration import CalibratedClassifierCV

# 1. DATA LOADING & CLEANING
# -----------------------------------------------------------------------------
# !pip install -q kaggle
# !kaggle datasets download -d clmentbisaillon/fake-and-real-news-dataset
# !unzip -q fake-and-real-news-dataset.zip

print("Loading datasets...")
try:
    df_fake = pd.read_csv('Fake.csv')
    df_real = pd.read_csv('True.csv')
    
    df_fake['label'] = 0
    df_real['label'] = 1
    
    # CRITICAL: Remove "Reuters" source leakage from Real news
    def clean_source_leakage(text):
        if '(Reuters)' in text[:50]:
            return text.split('-', 1)[-1].strip()
        return text

    df_real['text'] = df_real['text'].apply(clean_source_leakage)
    
    df = pd.concat([df_fake, df_real]).sample(frac=1, random_state=42).reset_index(drop=True)
    print(f"Data loaded. Shape: {df.shape}")

except FileNotFoundError:
    print("Dataset not found. Using synthetic fallback.")
    df = pd.DataFrame({'text': ["Government bans everything.", "Economy grows steady."], 'label': [0, 1]})

# 2. ADVANCED FEATURE ENGINEERING
# -----------------------------------------------------------------------------
class LinguisticFeatureExtractor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None): return self
    def transform(self, X):
        features = []
        for text in X:
            text = str(text).lower()
            absolutism = sum(1 for w in ['automatically', 'completely', 'undeniably', 'banned'] if w in text)
            sourcing = sum(1 for w in ['sources say', 'insiders', 'leaked'] if w in text)
            features.append([absolutism, sourcing])
        return np.array(features)

# 3. PIPELINE TRAINING
# -----------------------------------------------------------------------------
pipeline = Pipeline([
    ('features', FeatureUnion([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 3), max_features=20000, stop_words='english')),
        ('linguistics', LinguisticFeatureExtractor())
    ])),
    ('classifier', LogisticRegression(class_weight='balanced', C=0.5))
])

X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)
calibrated_model = CalibratedClassifierCV(pipeline, method='sigmoid', cv=3)
calibrated_model.fit(X_train, y_train)

# 4. EVALUATION
# -----------------------------------------------------------------------------
y_pred = calibrated_model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['FAKE', 'REAL']))

# 7. SEMANTIC INTEGRATION (EXPLANATION LAYER)
# -----------------------------------------------------------------------------
# Use Semantic Engine to explain the classical model's difficult predictions.

from google.genai import GoogleGenAI
# Ensure API_KEY is set in your Colab environment secrets
# client = GoogleGenAI(api_key="YOUR_API_KEY")

def explain_prediction(text, model_pred, model_conf):
    """
    Sends the article and the model's prediction to the analysis engine for reasoning.
    Does NOT use the engine for the initial classification, only for interpretation.
    """
    prompt = f"""
    Our Logistic Regression model predicted this article as {model_pred} 
    with {model_conf:.1%} confidence.
    
    Article Snippet: {text[:500]}...
    
    Explain WHY the model might have made this decision based on linguistic style.
    """
    # response = client.models.generate_content(model='gemini-3-flash-preview', contents=prompt)
    # return response.text
    return "Detailed analysis placeholder (requires API key)"

# Example Workflow
sample_text = X_test.iloc[0]
pred_prob = calibrated_model.predict_proba([sample_text])[0]
label = "REAL" if pred_prob[1] > 0.5 else "FAKE"
conf = max(pred_prob)

print(f"Model Prediction: {label} ({conf:.2%})")
print("Detailed Explanation:", explain_prediction(sample_text, label, conf))
`;

const ColabNotebook: React.FC = () => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(PYTHON_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Header Card */}
            <div className="glass-panel rounded-2xl p-8 border-l-4 border-l-orange-500 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="bg-orange-500/10 p-4 rounded-xl shrink-0">
                        <BookOpen className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                         <h2 className="text-2xl font-bold text-white mb-3">Google Colab Notebook (v3.0)</h2>
                         <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-2xl">
                            Access the complete Python source code for the <strong>Veritas Analytics</strong> pipeline. 
                            This script handles data ingestion from Kaggle, linguistic feature extraction, 
                            model calibration, and the integration of the semantic engine for post-hoc explainability.
                        </p>
                        <a 
                            href="https://colab.research.google.com/" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/20"
                        >
                            Open Google Colab <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Code Editor Window */}
            <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117] border border-slate-700/50">
                {/* Editor Tab Bar */}
                <div className="flex justify-between items-center px-4 py-3 bg-[#161b22] border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-500/80" />
                             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                             <div className="w-3 h-3 rounded-full bg-green-500/80" />
                         </div>
                         <div className="h-4 w-[1px] bg-slate-700 mx-2" />
                         <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>train_pipeline.py</span>
                         </div>
                    </div>
                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-700 hover:text-white rounded-md transition border border-slate-700/50"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy Code"}
                    </button>
                </div>
                
                {/* Code Content */}
                <div className="relative">
                    <pre className="p-6 text-sm font-mono text-slate-300 leading-relaxed overflow-auto max-h-[600px] selection:bg-blue-500/30">
                        <code className="language-python" style={{ fontFamily: '"Fira Code", monospace' }}>
                            {PYTHON_CODE}
                        </code>
                    </pre>
                </div>
            </div>
            
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-5 rounded-xl border-l-2 border-l-blue-500">
                    <strong className="text-white block mb-2 font-semibold">Hybrid Architecture</strong>
                    <p className="text-sm text-slate-400">Combines high-speed Logistic Regression for classification with semantic reasoning models.</p>
                </div>
                <div className="glass-card p-5 rounded-xl border-l-2 border-l-purple-500">
                    <strong className="text-white block mb-2 font-semibold">Bias Mitigation</strong>
                    <p className="text-sm text-slate-400">Includes preprocessing steps to remove "source leakage" (e.g. agency tags) to force linguistic learning.</p>
                </div>
                <div className="glass-card p-5 rounded-xl border-l-2 border-l-emerald-500">
                    <strong className="text-white block mb-2 font-semibold">Probability Calibration</strong>
                    <p className="text-sm text-slate-400">Uses Sigmoid calibration to ensure model confidence scores reflect true probability.</p>
                </div>
            </div>
        </div>
    );
};

export default ColabNotebook;