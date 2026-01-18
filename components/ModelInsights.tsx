import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  CLASS_DISTRIBUTION, 
  TEXT_LENGTH_DISTRIBUTION, 
  TOP_FAKE_WORDS, 
  TOP_REAL_WORDS, 
  MODEL_PERFORMANCE, 
  CONFUSION_MATRIX 
} from '../constants';
import { Database, TrendingUp, Grid, AlignLeft, Target } from 'lucide-react';

const ModelInsights: React.FC = () => {
  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
          <p className="text-slate-200 text-sm font-bold mb-1">{label}</p>
          <p className="text-blue-400 text-xs">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Dataset Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Class Balance */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
               <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white">Class Distribution</h3>
               <p className="text-xs text-slate-400">Balance between Fake and Real samples</p>
            </div>
          </div>
          {/* Explicit height wrapper for Recharts */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CLASS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CLASS_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
             {CLASS_DISTRIBUTION.map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                 <span className="text-sm text-slate-300 font-medium">{item.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Text Length */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
               <AlignLeft className="w-5 h-5 text-blue-400" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white">Word Count Distribution</h3>
               <p className="text-xs text-slate-400">Frequency of article lengths</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEXT_LENGTH_DISTRIBUTION} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                   cursor={{ fill: '#334155', opacity: 0.2 }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Articles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Model Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Target className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Metrics</h3>
               <p className="text-xs text-slate-400">Evaluation Scores</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MODEL_PERFORMANCE}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} axisLine={false} />
                <Radar
                  name="Logistic Regression"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Feature Importance (Coefficients)</h3>
               <p className="text-xs text-slate-400">Top keywords driving the classification decision</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full grid grid-cols-2 gap-8">
            {/* Fake Words */}
            <div className="relative h-full w-full flex flex-col">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 text-center">Predictive of FAKE</h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={TOP_FAKE_WORDS}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="importance" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={16} background={{ fill: '#1e293b' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
             {/* Real Words */}
             <div className="relative h-full w-full flex flex-col">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 text-center">Predictive of REAL</h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={TOP_REAL_WORDS}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 11}} orientation="right" tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="importance" fill="#10b981" radius={[4, 0, 0, 4]} barSize={16} background={{ fill: '#1e293b' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Confusion Matrix */}
      <div className="glass-card rounded-2xl p-6">
         <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-orange-500/10 rounded-lg">
                <Grid className="w-5 h-5 text-orange-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white">Confusion Matrix</h3>
               <p className="text-xs text-slate-400">Predicted vs Actual Classifications</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-4">
               {/* Labels */}
               <div className="col-start-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Real</div>
               <div className="col-start-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Fake</div>
               
               {/* Row 1 */}
               <div className="flex items-center justify-end text-xs font-bold text-slate-500 uppercase tracking-wider -rotate-90 md:rotate-0">Actual Real</div>
               <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-lg text-center transition hover:bg-emerald-500/20">
                  <div className="text-2xl font-black text-emerald-400">{CONFUSION_MATRIX[0].predictedReal}</div>
                  <div className="text-[10px] text-emerald-300/50 font-bold uppercase mt-1">True Negative</div>
               </div>
               <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg text-center transition hover:bg-slate-800">
                  <div className="text-xl font-bold text-slate-400">{CONFUSION_MATRIX[0].predictedFake}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">False Positive</div>
               </div>

               {/* Row 2 */}
               <div className="flex items-center justify-end text-xs font-bold text-slate-500 uppercase tracking-wider -rotate-90 md:rotate-0">Actual Fake</div>
               <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg text-center transition hover:bg-slate-800">
                  <div className="text-xl font-bold text-slate-400">{CONFUSION_MATRIX[1].predictedReal}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">False Negative</div>
               </div>
               <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center transition hover:bg-red-500/20">
                  <div className="text-2xl font-black text-red-400">{CONFUSION_MATRIX[1].predictedFake}</div>
                  <div className="text-[10px] text-red-300/50 font-bold uppercase mt-1">True Positive</div>
               </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ModelInsights;