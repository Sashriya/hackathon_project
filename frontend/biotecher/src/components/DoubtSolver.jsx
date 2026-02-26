import React, { useState } from "react";
import axios from "axios";
import { Sparkles, MessageSquare, Send, BookOpen, Search, Zap } from "lucide-react";

const DoubtSolver = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "How does Gel Electrophoresis work?",
    "Explain Recombinant DNA technology.",
    "Difference between Northern and Southern blotting.",
    "What are Monoclonal Antibodies?"
  ];

  const askQuestion = async (query = question) => {
    const finalQuery = typeof query === 'string' ? query : question;
    if (!finalQuery.trim()) return;
    
    setLoading(true);
    setAnswer(""); // Clear previous answer for new animation
    try {
      const res = await axios.post("http://localhost:8000/chat", { question: finalQuery });
      setAnswer(res.data?.answer || "No response received");
    } catch (error) {
      setAnswer("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[700px] flex flex-col md:flex-row gap-6 p-4">
      
      {/* LEFT COLUMN: Controls & Suggestions */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Doubt Solver</h2>
          </div>
          
          <p className="text-slate-500 text-sm mb-6">
            Type your biotech query below or pick a common topic to start.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Mechanism of CRISPR..."
                className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none min-h-[120px]"
              />
              <button
                onClick={() => askQuestion()}
                disabled={loading}
                className="absolute bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Search size={14} /> Quick Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuestion(s);
                      askQuestion(s);
                    }}
                    className="text-xs text-left px-3 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-transparent hover:border-indigo-200 transition-all text-slate-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Small "Did you know" card to fill space */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
           <Zap className="mb-2 opacity-80" size={20}/>
           <p className="text-xs opacity-80 font-medium">Biotech Tip:</p>
           <p className="text-sm font-semibold">Try asking for "Diagrammatic explanations" for better visual understanding!</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Output Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-600">
            <MessageSquare size={18} />
            <span className="font-semibold text-sm">AI Explanation Hub</span>
          </div>
          {loading && <div className="animate-pulse text-indigo-600 text-xs font-bold uppercase tracking-tighter">Analyzing DNA Sequences...</div>}
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {!answer && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <BookOpen size={48} strokeWidth={1}/>
              <p className="text-center italic">Waiting for your question to <br/>unravel the mysteries of biology...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtSolver;