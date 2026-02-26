import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrainCircuit, Timer, Trophy, CheckCircle2, AlertCircle, RefreshCcw, ChevronRight, ClipboardCheck } from "lucide-react";

const QuizGenerator = ({
  presetQuestions = null,
  presetTopic = null,
  presetLevel = null,
}) => {
  const [topic, setTopic] = useState(presetTopic || "");
  const [quizLevel, setQuizLevel] = useState(presetLevel || "Beginner");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState(presetQuestions || []);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (presetQuestions) {
      setQuestions(presetQuestions);
      setTopic(presetTopic);
      setQuizLevel(presetLevel);
      setSelectedAnswers({});
      setScore(null);
      setSubmitted(false);
    }
  }, [presetQuestions, presetTopic, presetLevel]);

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScore(null);
    setSubmitted(false);
    setQuestions([]);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/question",
        {
          topic: topic,
          level: quizLevel,
          num_questions: parseInt(numQuestions),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions);
        setSelectedAnswers({});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (qIndex, option) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const submitQuiz = async () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) correct++;
    });

    setScore(correct);
    setSubmitted(true);
    // Logic for axios.post("http://localhost:8000/save-result", ...) goes here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* PROFESSIONAL HEADER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 bg-slate-900 text-white relative">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-500 rounded-lg">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Examination Portal</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Technical Assessment</h2>
              <p className="text-slate-400 mt-1">Validating expertise in {topic || "Biotechnology"}</p>
            </div>
            
            {questions.length > 0 && !submitted && (
              <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Progress</p>
                  <p className="text-xl font-mono font-bold text-indigo-400">
                    {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center">
                   <ClipboardCheck size={20} className="text-indigo-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* CONFIGURATION PANEL */}
          {!presetQuestions && questions.length === 0 && !loading && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Research Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Molecular Cloning"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Complexity</label>
                  <select
                    value={quizLevel}
                    onChange={(e) => setQuizLevel(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer appearance-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume</label>
                  <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={generateQuiz}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 group"
              >
                Generate Examination <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-20 space-y-4">
              <div className="relative">
                <RefreshCcw className="w-12 h-12 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-indigo-400/20 animate-pulse" />
              </div>
              <p className="text-slate-500 font-medium tracking-tight">Compiling curriculum data...</p>
            </div>
          )}

          {/* QUESTIONNAIRE */}
          {questions.length > 0 && (
            <div className="space-y-16 mt-4">
              {questions.map((q, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex-none w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-800 leading-tight">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                    {q.options.map((opt, i) => {
                      const isSelected = selectedAnswers[index] === opt;
                      const isCorrect = submitted && opt === q.answer;
                      const isWrong = submitted && isSelected && opt !== q.answer;

                      return (
                        <button
                          key={i}
                          disabled={submitted}
                          onClick={() => handleOptionClick(index, opt)}
                          className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
                            isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-800" :
                            isWrong ? "bg-rose-50 border-rose-500 text-rose-800" :
                            isSelected ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-md" :
                            "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium pr-4">{opt}</span>
                            {isCorrect && <CheckCircle2 className="text-emerald-500" size={20} />}
                            {isWrong && <AlertCircle className="text-rose-500" size={20} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted ? (
                <div className="pt-10 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                    className="px-10 py-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl font-bold flex items-center gap-2 transition-all"
                  >
                    Submit for Evaluation <Trophy size={18} />
                  </button>
                </div>
              ) : (
                <div className="mt-20 p-10 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col items-center text-center space-y-6 shadow-2xl shadow-indigo-200 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Trophy size={40} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black mb-2">Result: {Math.round((score/questions.length)*100)}%</h3>
                    <p className="text-indigo-100 font-medium">You identified {score} out of {questions.length} concepts correctly.</p>
                  </div>
                  <button 
                    onClick={() => { setQuestions([]); setSubmitted(false); }}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                  >
                    Take Another Test
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;