import { useCallback } from "react";
import { RulerIcon } from "lucide-react";

interface UnitSelectorProps {
  unitType: string;
  onUnitChange: (unitType: string) => void;
}

const UnitSelector = ({ unitType, onUnitChange }: UnitSelectorProps) => {
  const handleUnitChange = useCallback((newUnitType: string) => {
    if (newUnitType !== unitType) {
      onUnitChange(newUnitType);
    }
  }, [unitType, onUnitChange]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
        <RulerIcon className="h-4 w-4 mr-1.5 text-primary" />
        Measurement Units
      </label>
      <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-50">
        <button
          onClick={() => handleUnitChange("metric")}
          className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${
            unitType === "metric" 
              ? "bg-primary text-white shadow-sm" 
              : "bg-white text-gray-700 hover:bg-gray-100"
          } font-medium text-sm focus:outline-none transition-all duration-200`}
        >
          <RulerIcon className="h-4 w-4 mr-1.5" />
          Metric (m)
        </button>
        <button
          onClick={() => handleUnitChange("imperial")}
          className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${
            unitType === "imperial" 
              ? "bg-primary text-white shadow-sm" 
              : "bg-white text-gray-700 hover:bg-gray-100"
          } font-medium text-sm focus:outline-none transition-all duration-200 ml-1`}
        >
          <RulerIcon className="h-4 w-4 mr-1.5" />
          Imperial (ft)
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">
        {unitType === "metric" 
          ? "Using metric units: meters for dimensions, cubic meters for volume" 
          : "Using imperial units: feet for dimensions, cubic yards for volume"}
      </div>
    </div>
  );
};

export default UnitSelector;
