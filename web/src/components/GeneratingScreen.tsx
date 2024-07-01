import React from "react";

interface GeneratingScreenProps {
  progress: number;
  status: string;
}

const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ progress, status }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Hostinger Domain Generator</h1>
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
    </div>
  );
};

export default GeneratingScreen;