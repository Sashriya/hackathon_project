import React, { useState } from "react";
import axios from "axios";
import { Compass, Target, GraduationCap, ArrowRight, Loader2, CheckCircle2, MapPin } from "lucide-react";

const RoadmapGenerator = () => {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/roadmap", { goal, level });
      setRoadmap(res.data?.roadmap || "No roadmap generated");
    } catch (error) {
      setRoadmap("Error generating roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <Compass className="w-6 h-6 animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-xs">Career Architect</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Biotech Roadmap</h2>
          <p className="text-slate-500">Define your destination; we'll map the biology and tech.</p>
        </div>
        
        <div className="hidden lg:block opacity-20">
           <Compass size={80} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Target size={16} className="text-blue-500"/> Your Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Clinical Research Associate"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <GraduationCap size={16} className="text-blue-500"/> Current Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateRoadmap}
              disabled={loading || !goal}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sequencing Path...</span>
                </>
              ) : (
                <>
                  <span>Generate Map</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-400">
                <CheckCircle2 size={16}/> Pro-Tip
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Be specific with your goal to get more specialized certifications and tool recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* ROADMAP DISPLAY WITH SCROLLER */}
        <div className="lg:col-span-2">
          {roadmap ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col h-[600px]">
              {/* Sticky Top Bar */}
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs font-mono text-slate-400 ml-2 uppercase tracking-tighter font-bold">Generated_Curriculum.md</span>
                </div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Read Only</div>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-200 transition-colors">
                <div className="prose prose-blue max-w-none text-slate-700 whitespace-pre-line leading-relaxed pb-10">
                  {roadmap}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <MapPin size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Ready to start your journey?</h3>
              <p className="text-slate-400 max-w-xs mx-auto mt-2">
                Enter your target role on the left to generate a detailed, AI-powered learning curriculum.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;