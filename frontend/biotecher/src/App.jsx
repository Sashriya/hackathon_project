import React, { useState } from "react";
import Navbar from "./components/Navbar";
import DoubtSolver from "./components/DoubtSolver";
import RoadmapGenerator from "./components/RoadmapGenerator";
import QuizGenerator from "./components/QuizGenerator";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ExploreSets from "./components/ExploreSets";
import ContactUs from "./components/ContactUs";
function App() {
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [presetQuiz, setPresetQuiz] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return (
          <ExploreSets
            onStartQuiz={(questions, topic, level) => {
              setActiveTab("quiz");
              setPresetQuiz({
                questions,
                topic,
                level,
              });
            }}
          />
        );
      case "doubt-solver":
        return <DoubtSolver />;
      case "roadmap":
        return <RoadmapGenerator />;
      case "quiz":
        return (
          <QuizGenerator
            presetQuestions={presetQuiz?.questions}
            presetTopic={presetQuiz?.topic}
            presetLevel={presetQuiz?.level}
          />
        );
      case "dashboard":
        return <Dashboard />;
      case "contact":
        return <ContactUs />;
      case "profile":
        return <Profile onLogout={logout} />;

      default:
        return <ExploreSets />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Logout Button */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-400 text-sm">
        © Developed by Shakthivishwa and Sashriya
      </footer>
    </div>
  );
}

export default App;