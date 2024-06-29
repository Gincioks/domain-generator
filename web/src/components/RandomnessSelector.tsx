import React from "react";

interface RandomnessSelectorProps {
  selectedRandomness: "low" | "medium" | "high";
  onSelectRandomness: (randomness: "low" | "medium" | "high") => void;
  onNext: () => void;
}

const RandomnessSelector: React.FC<RandomnessSelectorProps> = ({
  selectedRandomness,
  onSelectRandomness,
  onNext,
}) => {
  const options = [
    {
      id: "low",
      name: "Low",
      description: "Less random. The most direct name ideas",
    },
    {
      id: "medium",
      name: "Medium",
      description: "Balanced. More creative results",
    },
    {
      id: "high",
      name: "High",
      description: "Random ideas. More varied results",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select generation randomness</h2>
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            className={`w-full p-4 border rounded-lg text-left ${
              selectedRandomness === option.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() =>
              onSelectRandomness(option.id as "low" | "medium" | "high")
            }
          >
            <div className="font-semibold">{option.name}</div>
            <div className="text-sm text-gray-500">{option.description}</div>
          </button>
        ))}
      </div>
      <button
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};

export default RandomnessSelector;
