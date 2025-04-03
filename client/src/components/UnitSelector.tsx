import { useCallback } from "react";

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
      <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Units</label>
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => handleUnitChange("metric")}
          className={`flex-1 py-2 px-4 ${
            unitType === "metric" 
              ? "bg-primary text-white" 
              : "bg-white text-secondary"
          } font-medium text-sm focus:outline-none transition-colors`}
        >
          Metric (m)
        </button>
        <button
          onClick={() => handleUnitChange("imperial")}
          className={`flex-1 py-2 px-4 ${
            unitType === "imperial" 
              ? "bg-primary text-white" 
              : "bg-white text-secondary"
          } font-medium text-sm focus:outline-none transition-colors`}
        >
          Imperial (ft)
        </button>
      </div>
    </div>
  );
};

export default UnitSelector;
