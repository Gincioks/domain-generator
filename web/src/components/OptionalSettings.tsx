import React, { useState, useCallback, useRef } from "react";

interface OptionalSettingsProps {
  checkDomains: boolean;
  onUpdateCheckDomains: (check: boolean) => void;
  onNext: () => void;
}

const OptionalSettings: React.FC<OptionalSettingsProps> = ({ onNext }) => {
  const [range, setRange] = useState<[number, number]>([0, 20]);
  const sliderRef = useRef<HTMLDivElement>(null);
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

  const handleMouseDown = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      const slider = sliderRef.current;
      if (!slider) return;

      const startX = e.clientX;
      const sliderRect = slider.getBoundingClientRect();
      const startValue = range[index];

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaValue = (deltaX / sliderRect.width) * 20;
        let newValue = Math.round(startValue + deltaValue);
        newValue = Math.max(0, Math.min(20, newValue));

        setRange((prevRange) => {
          const newRange = [...prevRange] as [number, number];
          if (index === 0) {
            newRange[0] = Math.min(newValue, newRange[1]);
          } else {
            newRange[1] = Math.max(newRange[0], newValue);
          }
          return newRange;
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [range]
  );

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
        <p className="font-semibold mb-2">
          Length preference: {range[0] === 0 ? "Any" : range[0]} - {range[1]}{" "}
          characters
        </p>
        <div className="relative h-2" ref={sliderRef}>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full"></div>
          <div
            className="absolute top-0 bottom-0 bg-indigo-500 rounded-full"
            style={{
              left: `${(range[0] / 20) * 100}%`,
              right: `${100 - (range[1] / 20) * 100}%`,
            }}
          ></div>
          <button
            className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full -ml-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
            style={{ left: `${(range[0] / 20) * 100}%` }}
            onMouseDown={handleMouseDown(0)}
          ></button>
          <button
            className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full -ml-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
            style={{ left: `${(range[1] / 20) * 100}%` }}
            onMouseDown={handleMouseDown(1)}
          ></button>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>Any</span>
          <span>20 characters</span>
        </div>
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
