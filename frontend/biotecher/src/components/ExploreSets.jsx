import React from "react";
import axios from "axios";
import { Beaker, Dna, Microscope, Zap, FlaskConical, TestTube2, Activity, ShieldCheck } from "lucide-react";

// Expanded and categorized topics
const exploreTopics = [
  { topic: "PCR & Amplification", level: "Beginner", count: 20, icon: <Beaker className="text-blue-500" /> },
  { topic: "DNA Replication", level: "Intermediate", count: 25, icon: <Dna className="text-indigo-500" /> },
  { topic: "CRISPR-Cas9", level: "Advanced", count: 20, icon: <Zap className="text-yellow-500" /> },
  { topic: "Enzymology", level: "Beginner", count: 25, icon: <FlaskConical className="text-emerald-500" /> },
  { topic: "Gene Cloning", level: "Intermediate", count: 15, icon: <TestTube2 className="text-purple-500" /> },
  { topic: "Bioinformatics", level: "Advanced", count: 10, icon: <Microscope className="text-rose-500" /> },
  { topic: "Stem Cell Therapy", level: "Advanced", count: 30, icon: <Activity className="text-cyan-500" /> },
  { topic: "Bioethics & Safety", level: "Beginner", count: 15, icon: <ShieldCheck className="text-orange-500" /> },
];

const ExploreSets = ({ onStartQuiz }) => {

  const startQuiz = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/question",
        {
          topic: item.topic,
          level: item.level,
          num_questions: item.count,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onStartQuiz(res.data.questions, item.topic, item.level);
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">📚 Knowledge Hub</h2>
        <p className="text-gray-600">Master biotechnology through curated practice sets.</p>
      </div>

      {/* Grid Layout: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exploreTopics.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Background Accent Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />

            <div className="relative z-10">
              <div className="mb-4 p-3 bg-gray-50 inline-block rounded-2xl">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.topic}</h3>
              
              <div className="flex gap-3 mb-6">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  item.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {item.level}
                </span>
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {item.count} Questions
                </span>
              </div>
            </div>

            <button
              onClick={() => startQuiz(item)}
              className="relative z-10 w-full py-3 px-6 bg-gray-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transform group-hover:-translate-y-1 transition-all duration-200"
            >
              Start Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSets;