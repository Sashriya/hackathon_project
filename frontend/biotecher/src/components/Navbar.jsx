import React from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "explore", label: "Explore Sets", icon: "📚" },
    { id: "doubt-solver", label: "Doubt Solver", icon: "🧬" },
    { id: "roadmap", label: "Career Roadmap", icon: "🗺️" },
    { id: "quiz", label: "Practice Quiz", icon: "📝" },
    { id: "dashboard", label: "Dashboard", icon: "📊" }, // ✅ Added
    { id: "profile", label: "Profile", icon: "👤" },
    
    
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white font-bold text-xl">
            B
          </div>
          <span className="font-bold text-slate-800 tracking-tight">
            Biotech<span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;