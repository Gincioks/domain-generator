import React, { useRef, useState } from "react";
import GeneratingScreen from "./components/GeneratingScreen";
import OptionalSettings from "./components/OptionalSettings";
import BrandInfo from "./components/BrandInfo";
import RandomnessSelector from "./components/RandomnessSelector";
import NameStyleSelector from "./components/NameStyleSelector";
import Navbar from "./components/Navbar";
import ResultsPage from "./components/ResultsPage";
import { GenerateDomainsRequest, GeneratedResult } from "./lib/utils";
import axios, { AxiosProgressEvent } from "axios";
import { StreamData } from "./lib/utils";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    "nameStyle" | "randomness" | "brandInfo" | "generating" | "results"
  >("nameStyle");
  const [nameStyle, setNameStyle] = useState<string>("auto");
  const [randomness, setRandomness] = useState<"low" | "medium" | "high">("medium");
  const [brandInfo, setBrandInfo] = useState<string>("");
  const [brandDescription, setBrandDescription] =
    useState<string>("Nexor is a cutting-edge AI chatbot that delivers tailored recommendations to boost your productivity and streamline operations. Utilizing advanced natural language processing, Nexor understands your queries and provides precise, relevant responses. Perfect for enhancing efficiency in various professional environments.");
  const [checkDomains, setCheckDomains] = useState<boolean>(true);
  const [optionalSettings, setOptionalSettings] = useState<boolean>(false);
  const [range, setRange] = useState<[number, number]>([0, 20]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([".com"]);
  const [whitelist, setWhitelist] = useState<string>("");
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatus, setGenerationStatus] = useState<string>("Initializing...");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [accumulatedData, setAccumulatedData] = useState<string>("");
  const [reviewedDomains, setReviewedDomains] = useState<string[]>([]);

  const nextStep = () => {
    switch (currentStep) {
      case "nameStyle":
        setCurrentStep("randomness");
        break;
      case "randomness":
        setCurrentStep("brandInfo");
        break;
      case "brandInfo":
        setCurrentStep("generating");
        generateDomains();
        break;
    }
  };

  const handleStepChange = (
    step: "nameStyle" | "randomness" | "brandInfo"
  ) => {
    setCurrentStep(step);
    if (optionalSettings) setOptionalSettings(false);
  };

  const updateStatus = (percent: number) => {
    if (percent < 25) {
      setGenerationStatus("Analyzing input...");
    } else if (percent < 50) {
      setGenerationStatus("Generating name ideas...");
    } else if (percent < 75) {
      setGenerationStatus("Checking domain availability...");
    } else if (percent < 100) {
      setGenerationStatus("Finalizing results...");
    } else {
      setGenerationStatus("Complete!");
    }
    setGenerationProgress(percent);
  };

  const generateDomains = async () => {
    const formattedTlds = selectedDomains.map(tld => tld.startsWith(".") ? tld.slice(1) : tld);
    try {
      const requestBody: GenerateDomainsRequest = {
        keywords: brandInfo.split(" "),
        description: brandDescription,
        style: nameStyle,
        randomness: randomness,
        checkDomains: checkDomains,
        number_of_domains: 10,
        reviewed_domains: reviewedDomains,
        min_domain_length: range[0] > 0 ? range[0] : 1,
        max_domain_length: range[1] > 0 ? range[1] : 20,
        included_words: whitelist ? whitelist.split(",").map(word => word.trim()) : [],
        tlds: formattedTlds.length > 0 ? formattedTlds : []
      };

      const response = await axios.post<string>(
        `${import.meta.env.VITE_API_URL}/generate-by-description`,
        requestBody,
        {
          responseType: 'text',
          onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
            const xhr = progressEvent.event.target as XMLHttpRequest;
            const newData = xhr.responseText.slice(accumulatedData.length);
            setAccumulatedData(prev => prev + newData);

            const lines = newData.split('\n').filter(Boolean);
            lines.forEach((line: string) => {
              try {
                const data = JSON.parse(line) as StreamData;
                if ('progress' in data) {
                  updateStatus(data.progress);
                }
                if ('domains' in data) {
                  setGeneratedResults(data.domains);
                  setCurrentStep("results");
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            });
          }
        }
      );

      // Final processing of the complete response
      const lines = response.data.split('\n').filter(Boolean);
      const lastLine = lines[lines.length - 1];
      const finalData = JSON.parse(lastLine) as StreamData;
      if ('domains' in finalData) {
        setGeneratedResults(finalData.domains);
        setCurrentStep("results");
      }
    } catch (error) {
      console.error("Error generating domains:", error);
      setGenerationStatus("Error occurred. Please try again.");
    } finally {
      setAccumulatedData(""); // Reset accumulated data for next request
    }
  };

  const handleRegenerate = () => {
    setCurrentStep("generating");
    setGenerationProgress(0);
    setGenerationStatus("Initializing...");
    setReviewedDomains([...reviewedDomains, ...generatedResults.map(result => result.domain_name)]);
    generateDomains();
  };

  return (
    <div className="min-h-screen bg-indigo-400 flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-lg p-8 w-full ${currentStep === "generating" ? "animate-fadeIn" : ""} ${currentStep === "results" ? "animate-fadeOut max-w-8xl" : " max-w-2xl"}`}>
        {currentStep !== "generating" && currentStep !== "results" && (
          <Navbar
            currentStep={currentStep}
            onStepChange={handleStepChange}
            optionalSettings={optionalSettings}
            onOptionalSettingsChange={setOptionalSettings}
          />
        )}
        {!optionalSettings && currentStep === "nameStyle" && (
          <NameStyleSelector
            selectedStyle={nameStyle}
            onSelectStyle={setNameStyle}
            onNext={nextStep}
          />
        )}
        {!optionalSettings && currentStep === "randomness" && (
          <RandomnessSelector
            selectedRandomness={randomness}
            onSelectRandomness={setRandomness}
            onNext={nextStep}
          />
        )}
        {!optionalSettings && currentStep === "brandInfo" && (
          <BrandInfo
            brandInfo={brandInfo}
            brandDescription={brandDescription}
            onUpdateBrandInfo={setBrandInfo}
            onUpdateBrandDescription={setBrandDescription}
            checkDomains={checkDomains}
            onUpdateCheckDomains={setCheckDomains}
            onNext={nextStep}
          />
        )}
        {optionalSettings && (
          <OptionalSettings
            range={range}
            setRange={setRange}
            selectedDomains={selectedDomains}
            setSelectedDomains={setSelectedDomains}
            whitelist={whitelist}
            setWhitelist={setWhitelist}
            sliderRef={sliderRef}
          />
        )}
        {currentStep === "generating" && (
          <GeneratingScreen
            progress={generationProgress}
            status={generationStatus}
          />
        )}
        {currentStep === "results" && (
          <ResultsPage results={generatedResults} onRegenerate={handleRegenerate} />
        )}
      </div>
    </div>
  );
};

export default App;