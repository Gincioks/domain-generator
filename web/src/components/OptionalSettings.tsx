import React from "react";

interface OptionalSettingsProps {
  checkDomains: boolean;
  onUpdateCheckDomains: (check: boolean) => void;
  onNext: () => void;
}

const OptionalSettings: React.FC<OptionalSettingsProps> = ({
  //   checkDomains,
  //   onUpdateCheckDomains,
  onNext,
}) => {
  const domainExtensions = [
    ".com",
    ".ai",
    ".org",
    ".co",
    ".io",
    ".ai",
    ".ly",
    ".ca",
    ".au",
    ".de",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Optional settings</h2>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded-lg"
          type="text"
          placeholder="Whitelist words"
        />
        <p className="text-sm text-gray-500 mt-1">
          Words, prefixes or suffixes that should be included (separate with
          commas)
        </p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Maximum length preference: None</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Check domains</h3>
        <div className="grid grid-cols-5 gap-2">
          {domainExtensions.map((ext) => (
            <button
              key={ext}
              className={`p-2 border rounded-lg ${
                ext === ".com" ? "bg-indigo-100 border-indigo-300" : ""
              }`}
            >
              {ext}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Note: checking many domains extensions may take some time
        </p>
      </div>
      <button
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        onClick={onNext}
      >
        Generate Names
      </button>
    </div>
  );
};

export default OptionalSettings;
