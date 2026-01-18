import React, { useState } from 'react';
import LiveDetector from './components/LiveDetector';
import ModelInsights from './components/ModelInsights';
import ColabNotebook from './components/ColabNotebook';
import { ShieldCheck, BarChart2, Activity, Code2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'insights' | 'colab'>('live');

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 bg-[#020617]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <div className="flex items-center gap-4 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-slate-900 border border-slate-700 p-2.5 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition">
                  Veritas Analytics
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition">
                  Digital Forensics v3.0
                </span>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="hidden sm:flex p-1 bg-slate-900/50 border border-white/5 rounded-xl backdrop-blur-sm">
              {[
                { id: 'live', label: 'Live Detector', icon: Activity },
                { id: 'insights', label: 'Dataset Insights', icon: BarChart2 },
                { id: 'colab', label: 'Training Pipeline', icon: Code2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-slate-800 rounded-lg shadow-sm border border-white/5 -z-10 animate-in fade-in zoom-in-95 duration-200" />
                  )}
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Section Header */}
          <div className="mb-10 text-center sm:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3 h-3" />
                Powered by Kaggle Dataset & NLP Engine
             </div>
             <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                {activeTab === 'live' && "Real-Time Credibility Analysis"}
                {activeTab === 'insights' && "Model Performance & EDA"}
                {activeTab === 'colab' && "Training Pipeline Source"}
             </h2>
             <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                {activeTab === 'live' && "Input any news article below. Our hybrid engine combines statistical NLP with advanced semantic analysis to detect misinformation patterns."}
                {activeTab === 'insights' && "Visualize the training distribution, confusion matrices, and feature importance of our Logistic Regression model."}
                {activeTab === 'colab' && "Review the Python source code used to train, calibrate, and validate the model on the Kaggle dataset."}
             </p>
          </div>

          {/* Dynamic Content */}
          <div className="relative">
             {activeTab === 'live' && <LiveDetector />}
             {activeTab === 'insights' && <ModelInsights />}
             {activeTab === 'colab' && <ColabNotebook />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-10 bg-[#020617]/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
             <ShieldCheck className="w-5 h-5" />
             <span className="font-bold tracking-tight">Veritas Analytics</span>
           </div>
           <p className="text-slate-500 text-sm">
             Designed for Kaggle Fake News Detection Project. 
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;