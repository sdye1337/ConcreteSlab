import { useState, useEffect, useCallback } from "react";
import UnitSelector from "@/components/UnitSelector";
import DimensionsInput from "@/components/DimensionsInput";
import CalculationResults from "@/components/CalculationResults";
import RecentCalculations from "@/components/RecentCalculations";
import { Building2 } from "lucide-react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Calculation } from "@shared/schema";

const DEFAULT_METRIC = {
  length: 5,
  width: 5,
  thickness: 0.15,
  price: 120
};

const DEFAULT_IMPERIAL = {
  length: 16.4,
  width: 16.4,
  thickness: 0.492,
  price: 91.75
};

const HomePage = () => {
  const [unitType, setUnitType] = useState<string>("metric");
  const [dimensions, setDimensions] = useState({
    length: DEFAULT_METRIC.length,
    width: DEFAULT_METRIC.width,
    thickness: DEFAULT_METRIC.thickness,
  });
  const [price, setPrice] = useState(DEFAULT_METRIC.price);
  const [volume, setVolume] = useState(0);
  const [cost, setCost] = useState(0);

  const { data: calculations = [], isLoading } = useQuery<Calculation[]>({
    queryKey: ["/api/calculations"],
  });

  const calculateResults = useCallback(() => {
    // Calculate volume
    const newVolume = dimensions.length * dimensions.width * dimensions.thickness;
    setVolume(parseFloat(newVolume.toFixed(2)));
    
    // Calculate cost
    const newCost = newVolume * price;
    setCost(parseFloat(newCost.toFixed(2)));
  }, [dimensions, price]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const handleUnitChange = (newUnitType: string) => {
    if (newUnitType === unitType) return;
    
    if (newUnitType === "imperial") {
      // Convert metric to imperial
      setDimensions({
        length: parseFloat((dimensions.length * 3.28084).toFixed(2)),
        width: parseFloat((dimensions.width * 3.28084).toFixed(2)),
        thickness: parseFloat((dimensions.thickness * 3.28084).toFixed(2)),
      });
      // Convert price from per m³ to per yd³
      setPrice(parseFloat((price * 0.764555).toFixed(2)));
    } else {
      // Convert imperial to metric
      setDimensions({
        length: parseFloat((dimensions.length / 3.28084).toFixed(2)),
        width: parseFloat((dimensions.width / 3.28084).toFixed(2)),
        thickness: parseFloat((dimensions.thickness / 3.28084).toFixed(2)),
      });
      // Convert price from per yd³ to per m³
      setPrice(parseFloat((price / 0.764555).toFixed(2)));
    }
    
    setUnitType(newUnitType);
  };

  const handleDimensionChange = (name: string, value: number) => {
    setDimensions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  };

  const handleLoadCalculation = (calculation: Calculation) => {
    // Set the unit type first to ensure proper conversions
    setUnitType(calculation.unitType);

    // Set dimensions and price
    setDimensions({
      length: calculation.length,
      width: calculation.width,
      thickness: calculation.thickness
    });
    setPrice(calculation.price);
    
    // Calculate results
    setVolume(calculation.volume);
    setCost(calculation.cost);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-surface shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-secondary">Concrete Slab Calculator</h1>
        </div>
        <button className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
          <Plus className="h-5 w-5 text-secondary" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <UnitSelector 
            unitType={unitType} 
            onUnitChange={handleUnitChange} 
          />
          
          <DimensionsInput 
            dimensions={dimensions} 
            price={price}
            unitType={unitType}
            onDimensionChange={handleDimensionChange}
            onPriceChange={handlePriceChange}
          />
          
          <CalculationResults 
            volume={volume} 
            cost={cost} 
            price={price}
            dimensions={dimensions}
            unitType={unitType}
          />
          
          <RecentCalculations 
            calculations={calculations} 
            onLoadCalculation={handleLoadCalculation}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
