import { useState, useEffect, useCallback } from "react";
import UnitSelector from "@/components/UnitSelector";
import DimensionsInput from "@/components/DimensionsInput";
import CalculationResults from "@/components/CalculationResults";
import RecentCalculations from "@/components/RecentCalculations";
import { Building2, Calculator } from "lucide-react";
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
  const [slabType, setSlabType] = useState<string>("rectangular");
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
    // Calculate volume based on shape type
    let area = 0;
    
    if (slabType === "rectangular") {
      // For rectangular: length × width
      area = dimensions.length * dimensions.width;
    } else if (slabType === "circular") {
      // For circular: π × (diameter/2)²
      const radius = dimensions.length / 2; // length is used for diameter
      area = Math.PI * radius * radius;
    } else if (slabType === "custom") {
      // For custom: already have area directly (length * width but width is set to 1)
      area = dimensions.length * dimensions.width;
    }
    
    const newVolume = area * dimensions.thickness;
    setVolume(parseFloat(newVolume.toFixed(2)));
    
    // Calculate cost
    const newCost = newVolume * price;
    setCost(parseFloat(newCost.toFixed(2)));
  }, [dimensions, price, slabType]);

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
        thickness: parseFloat((dimensions.thickness * 3.28084).toFixed(3)),
      });
      // Convert price from per m³ to per yd³
      setPrice(parseFloat((price * 0.764555).toFixed(2)));
    } else {
      // Convert imperial to metric
      setDimensions({
        length: parseFloat((dimensions.length / 3.28084).toFixed(2)),
        width: parseFloat((dimensions.width / 3.28084).toFixed(2)),
        thickness: parseFloat((dimensions.thickness / 3.28084).toFixed(3)),
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
  
  const handleSlabTypeChange = (newType: string) => {
    setSlabType(newType);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-primary bg-opacity-10 p-1.5 rounded-md">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Concrete Slab Calculator</h1>
        </div>
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <UnitSelector 
            unitType={unitType} 
            onUnitChange={handleUnitChange} 
          />
          
          <DimensionsInput 
            dimensions={dimensions} 
            price={price}
            unitType={unitType}
            slabType={slabType}
            onDimensionChange={handleDimensionChange}
            onPriceChange={handlePriceChange}
            onSlabTypeChange={handleSlabTypeChange}
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
