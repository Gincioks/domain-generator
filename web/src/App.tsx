import React, { useState } from "react";
import GeneratingScreen from "./components/GeneratingScreen";
import OptionalSettings from "./components/OptionalSettings";
import BrandInfo from "./components/BrandInfo";
import RandomnessSelector from "./components/RandomnessSelector";
import NameStyleSelector from "./components/NameStyleSelector";
import Navbar from "./components/Navbar";
import ResultsPage from "./components/ResultsPage";
import { mockGeneratedResults } from "./lib/utils";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    "nameStyle" | "randomness" | "brandInfo" | "optionalSettings" | "generating" | "results"
  >("nameStyle");
  const [nameStyle, setNameStyle] = useState<string>("");
  const [randomness, setRandomness] = useState<"low" | "medium" | "high">("medium");
  const [brandInfo, setBrandInfo] = useState<string>("");
  const [checkDomains, setCheckDomains] = useState<boolean>(true);

  const nextStep = () => {
    switch (currentStep) {
      case "nameStyle":
        setCurrentStep("randomness");
        break;
      case "randomness":
        setCurrentStep("brandInfo");
        break;
      case "brandInfo":
        setCurrentStep("optionalSettings");
        break;
      case "optionalSettings":
        setCurrentStep("generating");
        break;
    }
  };

  const handleStepChange = (
    step: "nameStyle" | "randomness" | "brandInfo" | "optionalSettings"
  ) => {
    setCurrentStep(step);
  };

  const handleGenerationComplete = () => {
    setCurrentStep("results");
    // Here you would typically fetch or display the generated results
  };

  return (
    <div className="min-h-screen bg-indigo-400 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        {currentStep !== "generating" && currentStep !== "results" && (
          <Navbar currentStep={currentStep} onStepChange={handleStepChange} />
        )}
        {currentStep === "nameStyle" && (
          <NameStyleSelector
            selectedStyle={nameStyle}
            onSelectStyle={setNameStyle}
            onNext={nextStep}
          />
        )}
        {currentStep === "randomness" && (
          <RandomnessSelector
            selectedRandomness={randomness}
            onSelectRandomness={setRandomness}
            onNext={nextStep}
          />
        )}
        {currentStep === "brandInfo" && (
          <BrandInfo
            brandInfo={brandInfo}
            onUpdateBrandInfo={setBrandInfo}
            checkDomains={checkDomains}
            onUpdateCheckDomains={setCheckDomains}
            onNext={nextStep}
          />
        )}
        {currentStep === "optionalSettings" && (
          <OptionalSettings
            // checkDomains={checkDomains}
            // onUpdateCheckDomains={setCheckDomains}
            onNext={nextStep}
          />
        )}
        {currentStep === "generating" && (
          <GeneratingScreen onComplete={handleGenerationComplete} />
        )}
        {currentStep === "results" && (
          <ResultsPage results={mockGeneratedResults} />
        )}
      </div>
    </div>
  );
};

export default App;