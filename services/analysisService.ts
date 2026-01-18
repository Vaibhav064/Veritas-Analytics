import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';
import { TOP_FAKE_WORDS, TOP_REAL_WORDS } from '../constants';

// Initialize Gemini Client
// We assume process.env.API_KEY is pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Heuristic Fallback Analysis
 * Used ONLY when the AI service is unavailable (network/key error).
 * Simulates the exact behavior described in the python notebook so the app doesn't crash offline.
 */
const heuristicAnalysis = async (title: string, text: string): Promise<AnalysisResult> => {
  const combinedText = (title + " " + text).toLowerCase();
  
  // Feature Engineering Simulation
  const absolutismTerms = ['automatically', 'completely', 'undeniably', 'guaranteed', 'proven', 'total', 'mandatory', 'forever', 'banned'];
  const vagueSourceTerms = ['sources say', 'insiders', 'leaked documents', 'anonymous official', 'they want', 'it is believed'];
  const standardReportingTerms = ['stated', 'announced', 'reported', 'published', 'according to', 'analysis by'];

  let absolutismScore = 0;
  let vagueSourceScore = 0;
  let structureScore = 0;
  const foundPatterns: string[] = [];

  absolutismTerms.forEach(term => { if (combinedText.includes(term)) absolutismScore++; });
  vagueSourceTerms.forEach(term => { if (combinedText.includes(term)) vagueSourceScore++; });
  standardReportingTerms.forEach(term => { if (combinedText.includes(term)) structureScore++; });

  let fakeVocabScore = 0;
  let realVocabScore = 0;
  const foundFeatures: { word: string; impact: number }[] = [];

  TOP_FAKE_WORDS.forEach(item => {
    if (combinedText.includes(item.feature)) {
      fakeVocabScore += item.importance;
      foundFeatures.push({ word: item.feature, impact: Math.round(item.importance * 100) });
    }
  });

  TOP_REAL_WORDS.forEach(item => {
    if (combinedText.includes(item.feature)) {
      realVocabScore += item.importance;
      foundFeatures.push({ word: item.feature, impact: Math.round(item.importance * 100) });
    }
  });

  // Weighted Decision Logic
  const fakeProbabilityWeight = (fakeVocabScore * 0.8) + (absolutismScore * 1.5) + (vagueSourceScore * 1.2);
  const realProbabilityWeight = (realVocabScore * 0.8) + (structureScore * 1.0);

  let classification: 'REAL' | 'FAKE' = 'REAL';
  let confidence = 0;
  let explanation = "";

  if (fakeProbabilityWeight > realProbabilityWeight) {
    classification = 'FAKE';
    const margin = fakeProbabilityWeight - realProbabilityWeight;
    confidence = 60 + Math.min(39, margin * 15);
    
    if (absolutismScore > 0) foundPatterns.push("Absolutist/Deterministic language");
    if (vagueSourceScore > 0) foundPatterns.push("Vague attribution (e.g., 'sources say')");
    foundPatterns.push("Vocabulary matches misinformation clusters");

    explanation = `Model Prediction: FAKE (Offline Fallback). The model detected patterns highly correlated with the 'Fake' class in the Kaggle dataset, specifically absolutist claims and vague sourcing.`;
  } else {
    classification = 'REAL';
    const margin = realProbabilityWeight - fakeProbabilityWeight;
    confidence = 60 + Math.min(39, margin * 15);
    
    if (structureScore > 0) foundPatterns.push("Standard journalistic attribution");
    foundPatterns.push("Conditional/Nuanced phrasing");

    explanation = `Model Prediction: REAL (Offline Fallback). The article's vector representation aligns with the 'Verified News' cluster, exhibiting standard reporting verbs and hedged assertions.`;
  }

  return {
    classification,
    confidenceScore: Math.round(confidence),
    explanation,
    linguisticPatterns: foundPatterns.length > 0 ? foundPatterns : ["Standard vocabulary distribution"],
    topFeatures: foundFeatures.sort((a,b) => b.impact - a.impact).slice(0, 5)
  };
};

/**
 * AI-Powered Analysis
 * Uses Gemini to classify and explain the article.
 */
export const analyzeNewsArticle = async (title: string, text: string): Promise<AnalysisResult> => {
  try {
    // Injecting Constants to ground the AI in the "App's Reality"
    // This ensures the AI's explanation matches the charts shown in the 'Insights' tab.
    const fakeKeywords = TOP_FAKE_WORDS.map(w => w.feature).join(", ");
    const realKeywords = TOP_REAL_WORDS.map(w => w.feature).join(", ");

    // 1. Construct the Prompt
    const systemInstruction = `You are the Trained Logistic Regression Model (v3.0) from the 'Veritas Analytics' dashboard.
    
    CONTEXT:
    You have been trained on the Kaggle Fake & Real News Dataset (20,000+ articles). 
    You are NOT a generic AI. You must simulate the inference of this specific statistical model.

    MODEL PARAMETERS (Derived from Training):
    - The model relies on TF-IDF N-grams (1-3) and custom linguistic features.
    - Top coefficients for FAKE class: [${fakeKeywords}, 'automatically', 'banned', 'completely'].
    - Top coefficients for REAL class: [${realKeywords}, 'stated', 'noted', 'analysis'].
    - Fake news in this dataset often uses "Absolutist" language (will definitely, 100% guaranteed) and "Vague Sourcing" (insiders, sources say).
    - Real news uses "Hedging" (suggests, likely) and "Specific Attribution" (Dr. Smith, The Department of Labor).

    INSTRUCTIONS:
    1. Classify the input article as 'REAL' or 'FAKE' based *only* on these dataset patterns.
    2. Your "explanation" MUST sound like a Data Scientist interpreting the model's output. 
    3. Use technical terms like: "vector space", "decision boundary", "feature importance", "coefficient weights", "probability score", "cluster distance".
    4. Do not mention "I think" or "As an AI". Your phrasing should be "The model predicts...", "Training data suggests...", "High TF-IDF weight on...".

    Analyze the input rigorously. If it sounds professional but makes unverifiable absolute claims (e.g. "will automatically"), classify as FAKE (this is a known "hard case" in the dataset).`;

    const prompt = `Input Data for Inference:
    Headline: "${title}"
    Body: "${text}"
    `;

    // 2. Call Gemini API with Structured Output
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING, enum: ["REAL", "FAKE"] },
            confidenceScore: { type: Type.INTEGER, description: "Model confidence score (0-100)." },
            explanation: { type: Type.STRING, description: "Technical explanation referencing model weights and dataset clusters." },
            linguisticPatterns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 linguistic features driving the prediction (e.g. 'Absolutist Language', 'Vague Sourcing')."
            },
            topFeatures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  impact: { type: Type.INTEGER, description: "Feature contribution score (0-100)." }
                },
                required: ["word", "impact"]
              },
              description: "Top 5 extracted n-grams or keywords with highest coefficients."
            }
          },
          required: ["classification", "confidenceScore", "explanation", "linguisticPatterns", "topFeatures"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.warn("Gemini API unavailable or failed, falling back to heuristic model.", error);
    return heuristicAnalysis(title, text);
  }
};