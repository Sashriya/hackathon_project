import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/my-results",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 My Quiz History</h2>

      {results.length === 0 ? (
        <p>No quiz attempts yet.</p>
      ) : (
        <div className="space-y-6">
          {results.map((result, index) => {
            const percentage = Math.round(
              (result.score / result.total) * 100
            );

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">
                      🧬 {result.topic}
                    </h3>
                    <p>Level: {result.level}</p>
                    <p>
                      Score: {result.score} / {result.total} ({percentage}%)
                    </p>
                    <p>
                      Date: {new Date(result.date).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleExpand(index)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-xl"
                  >
                    {expandedIndex === index ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* Show Questions */}
                {expandedIndex === index && (
                  <div className="mt-6 space-y-6 border-t pt-6">
                    {result.questions.map((q, qIndex) => {
                      const selected = result.answers[qIndex];
                      const correct = q.answer;
                      const isCorrect = selected === correct;

                      return (
                        <div
                          key={qIndex}
                          className="bg-slate-50 p-4 rounded-xl"
                        >
                          <p className="font-semibold">
                            {qIndex + 1}. {q.question}
                          </p>

                          <div className="mt-3 space-y-1">
                            {q.options.map((opt, i) => {
                              const isSelected = opt === selected;
                              const isAnswer = opt === correct;

                              return (
                                <div
                                  key={i}
                                  className={`p-2 rounded ${
                                    isAnswer
                                      ? "bg-green-100"
                                      : isSelected && !isAnswer
                                      ? "bg-red-100"
                                      : ""
                                  }`}
                                >
                                  {opt}
                                  {isAnswer && " ✅"}
                                  {isSelected && !isAnswer && " ❌"}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;