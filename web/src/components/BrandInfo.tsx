import React from "react";

interface BrandInfoProps {
  brandInfo: string;
  onUpdateBrandInfo: (info: string) => void;
  checkDomains: boolean;
  onUpdateCheckDomains: (checked: boolean) => void;
  onNext: () => void;
}

const BrandInfo: React.FC<BrandInfoProps> = ({
  brandInfo,
  onUpdateBrandInfo,
  checkDomains,
  onUpdateCheckDomains,
  onNext,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Brand info</h2>
      <textarea
        className="w-full p-2 border rounded-lg"
        rows={4}
        value={brandInfo}
        onChange={(e) => onUpdateBrandInfo(e.target.value)}
        placeholder="Add any keywords that may be related to your idea or business."
      />
      <input
        className="w-full mt-4 p-2 border rounded-lg"
        type="text"
        placeholder="Business description (optional)"
      />
      <p className="text-sm text-gray-500 mt-1">
        A short one-sentence description of your business or product.
      </p>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="checkDomains"
          className="mr-2"
          checked={checkDomains}
          onChange={(e) => onUpdateCheckDomains(e.target.checked)}
        />
        <label htmlFor="checkDomains">Check domains</label>
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

export default BrandInfo;
