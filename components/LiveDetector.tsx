import React, { useState } from 'react';
import { analyzeNewsArticle } from '../services/analysisService';
import { AnalysisResult, AnalysisStatus } from '../types';
import { AlertTriangle, CheckCircle2, Loader2, Play, RefreshCw, Quote, Fingerprint, Zap } from 'lucide-react';

const LiveDetector: React.FC = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!title.trim() && !text.trim()) return;
    
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const data = await analyzeNewsArticle(title, text);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setTitle('');
    setText('');
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
  };

  const fillExample = (type: 'fake' | 'real') => {
    if (type === 'fake') {
      setTitle("New UN Mandate Will Automatically Restrict Meat Consumption by 2027");
      setText("A new environmental framework ratified in Geneva will automatically enforce dietary quotas for member nations starting January 2027. The mandate requires all digital payment processors to track carbon expenditures and completely deny transactions for meat products once an individual's monthly limit is reached. Insiders confirm the technology is already integrated into banking apps.");
    } else {
      setTitle("WHO Report Monitors New Viral Strain, Though Transmission Risk Remains Low");
      setText("The World Health Organization (WHO) issued a preliminary report Tuesday regarding a novel viral strain detected in regional livestock. While researchers noted genetic similarities to previous pathogens, Dr. Elena Rossi stated that current data suggests human-to-human transmission is unlikely at this stage. The agency recommends continued surveillance but advises against travel restrictions.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Input Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel p-1 rounded-2xl">
          <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-800">
             
             {/* Header with Quick Actions */}
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 Input Source
               </h3>
               <div className="flex gap-2">
                 <button onClick={() => fillExample('fake')} className="text-[10px] font-bold uppercase tracking-wide text-red-400 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 px-3 py-1.5 rounded-md transition">
                   Load Fake
                 </button>
                 <button onClick={() => fillExample('real')} className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-900/50 px-3 py-1.5 rounded-md transition">
                   Load Real
                 </button>
               </div>
             </div>

             {/* Inputs */}
             <div className="space-y-4">
               <div className="group">
                 <label className="block text-xs font-semibold text-slate-500 mb-2 group-focus-within:text-blue-400 transition">HEADLINE</label>
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="Enter article title..."
                   className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                 />
               </div>
               <div className="group">
                 <label className="block text-xs font-semibold text-slate-500 mb-2 group-focus-within:text-blue-400 transition">FULL TEXT</label>
                 <textarea
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                   placeholder="Paste the content body here..."
                   rows={12}
                   className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all resize-none leading-relaxed"
                 ></textarea>
               </div>
             </div>
             
             {/* Action Button */}
             <div className="mt-6">
               <button
                 onClick={handleAnalyze}
                 disabled={status === AnalysisStatus.ANALYZING || (!title && !text)}
                 className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-3 transition-all duration-300
                   ${status === AnalysisStatus.ANALYZING 
                     ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                     : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5'}`}
               >
                 {status === AnalysisStatus.ANALYZING ? (
                   <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                 ) : (
                   <><Play className="w-5 h-5 fill-current" /> Run Analysis</>
                 )}
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Results Section */}
      <div className="lg:col-span-7">
        {status === AnalysisStatus.IDLE && (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center opacity-60">
             <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
               <Fingerprint className="w-10 h-10 text-slate-600" />
             </div>
             <h3 className="text-xl font-semibold text-slate-300 mb-2">Awaiting Input Data</h3>
             <p className="text-slate-500 max-w-sm">
               Enter text on the left to generate a credibility profile using our ML + NLP engine.
             </p>
          </div>
        )}

        {result && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
             
             {/* 1. Main Verdict Card */}
             <div className={`relative overflow-hidden rounded-2xl border p-8 shadow-2xl
               ${result.classification === 'FAKE' 
                 ? 'bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900 border-red-500/30' 
                 : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/30'}`}
             >
                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-30
                   ${result.classification === 'FAKE' ? 'bg-red-600' : 'bg-emerald-600'}`} />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border
                          ${result.classification === 'FAKE' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                          Classification
                        </span>
                        <span className="text-slate-500 text-xs font-mono">MODEL v3.0</span>
                      </div>
                      <h2 className={`text-5xl font-black tracking-tighter flex items-center gap-4
                        ${result.classification === 'FAKE' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                         {result.classification === 'FAKE' ? <AlertTriangle className="w-12 h-12" /> : <CheckCircle2 className="w-12 h-12" />}
                         {result.classification}
                      </h2>
                   </div>

                   {/* Circular Confidence Meter */}
                   <div className="flex items-center gap-4 bg-slate-950/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                      <div className="relative w-16 h-16">
                         <svg className="w-full h-full -rotate-90">
                           <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-800" />
                           <circle 
                              cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" 
                              strokeDasharray={175} strokeDashoffset={175 - (175 * result.confidenceScore) / 100}
                              className={`${result.classification === 'FAKE' ? 'text-red-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`} 
                           />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white">
                           {result.confidenceScore}%
                         </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold">Confidence</div>
                        <div className="text-[10px] text-slate-500">Probability Score</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* 2. Reasoning Card */}
             <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Quote className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Model Reasoning</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base border-l-2 border-slate-700 pl-4">
                  {result.explanation}
                </p>
             </div>

             {/* 3. Details Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patterns */}
                <div className="glass-card rounded-2xl p-6">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Linguistic Triggers</h4>
                   <ul className="space-y-3">
                     {result.linguisticPatterns.map((pattern, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                         {pattern}
                       </li>
                     ))}
                   </ul>
                </div>

                {/* Features */}
                <div className="glass-card rounded-2xl p-6">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                     <Zap className="w-3 h-3 text-yellow-500" /> Top Features (TF-IDF)
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {result.topFeatures.map((f, i) => (
                        <div key={i} className="flex items-center bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 overflow-hidden">
                           <span className="text-slate-200 text-sm font-medium mr-2">{f.word}</span>
                           <div className="h-4 w-[1px] bg-slate-700 mx-1" />
                           <span className={`text-xs font-bold ${f.impact > 70 ? 'text-blue-400' : 'text-slate-500'}`}>
                             {f.impact}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <button 
              onClick={reset}
              className="w-full py-4 mt-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center gap-2 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Analyze Another Article
            </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default LiveDetector;