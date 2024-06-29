import React from "react";

const GeneratingScreen: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">namelix</h1>
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full animate-progress"
            style={{ width: "98%" }}
          ></div>
        </div>
      </div>
      <p className="text-gray-600 text-lg mb-4">Generating new words</p>
      <div className="flex justify-center space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 bg-indigo-600 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GeneratingScreen;