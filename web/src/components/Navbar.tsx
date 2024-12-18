import React from "react";

interface NavbarProps {
  currentStep:
  | "nameStyle"
  | "randomness"
  | "brandInfo"
  | "optionalSettings"
  | "generating";
  onStepChange: (
    step: "nameStyle" | "randomness" | "brandInfo"
  ) => void;
  onOptionalSettingsChange: (settings: boolean) => void;
  optionalSettings: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentStep, onStepChange, onOptionalSettingsChange, optionalSettings }) => {
  const steps = [
    { id: "nameStyle", label: "Name Style" },
    { id: "randomness", label: "Randomness" },
    { id: "brandInfo", label: "Brand Info" },
  ];

  return (
    <nav className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() =>
              onStepChange(step.id as "nameStyle" | "randomness" | "brandInfo")
            }
            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ease-in-out ${currentStep === step.id
              ? "bg-indigo-600 text-white font-semibold"
              : "text-gray-500 hover:bg-indigo-100"
              }`}
          >
            {step.label}
          </button>
        ))}
      </div>
      <button
        className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 ease-in-out"
        onClick={() => onOptionalSettingsChange(!optionalSettings)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Navbar;
