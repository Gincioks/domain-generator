import React from "react";

const GeneratingScreen: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">namelix</h1>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: "98%" }}
          ></div>
        </div>
      </div>
      <p className="text-gray-600">Generating new words</p>
    </div>
  );
};

export default GeneratingScreen;
