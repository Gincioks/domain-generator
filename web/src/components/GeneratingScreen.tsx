import React, { useState, useEffect } from "react";

interface GeneratingScreenProps {
  onComplete: () => void;
}

const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const simulateLoading = async () => {
      const stages = [
        { progress: 20, status: "Analyzing input..." },
        { progress: 40, status: "Generating name ideas..." },
        { progress: 60, status: "Checking domain availability..." },
        { progress: 80, status: "Finalizing results..." },
        { progress: 100, status: "Complete!" },
      ];

      for (const stage of stages) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
        setProgress(stage.progress);
        setStatus(stage.status);
      }
    };

    simulateLoading();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">namelix</h1>
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <p className="text-gray-600 text-lg mb-4">{status}</p>
      {progress < 100 && (
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-indigo-600 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      )}
      {progress === 100 && (
        <button
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={onComplete}
        >
          View Results
        </button>
      )}
    </div>
  );
};

export default GeneratingScreen;