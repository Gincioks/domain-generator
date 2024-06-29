import React from "react";

interface NameStyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  onNext: () => void;
}

const NameStyleSelector: React.FC<NameStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  onNext,
}) => {
  const styles = [
    { id: "auto", name: "Auto", description: "All styles", isNew: true },
    {
      id: "brandable",
      name: "Brandable names",
      description: "like Google and Rolex",
    },
    {
      id: "evocative",
      name: "Evocative",
      description: "like RedBull and Forever21",
    },
    {
      id: "compound",
      name: "Compound words",
      description: "like FedEx and Microsoft",
    },
    {
      id: "short",
      name: "Short phrase",
      description: "like Dollar shave club",
    },
    {
      id: "nonEnglish",
      name: "Non-English words",
      description: "like Toyota and Audi",
    },
    {
      id: "alternate",
      name: "Alternate spelling",
      description: "like Lyft and Fiverr",
    },
    { id: "real", name: "Real words", description: "like Apple and Amazon" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a name style</h2>
      <div className="grid grid-cols-2 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            className={`p-4 border rounded-lg text-left ${
              selectedStyle === style.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() => onSelectStyle(style.id)}
          >
            <div className="font-semibold flex items-center">
              {style.name}
              {style.isNew && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  new
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{style.description}</div>
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

export default NameStyleSelector;
