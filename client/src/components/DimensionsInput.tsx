import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SlabVisualization from "./SlabVisualization";
import { ChangeEvent, useCallback } from "react";
import { RulerIcon, BoxIcon, LayersIcon, DollarSignIcon } from "lucide-react";

interface DimensionsInputProps {
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  price: number;
  unitType: string;
  onDimensionChange: (name: string, value: number) => void;
  onPriceChange: (price: number) => void;
}

const DimensionsInput = ({ 
  dimensions, 
  price, 
  unitType, 
  onDimensionChange,
  onPriceChange
}: DimensionsInputProps) => {
  const unitDisplay = unitType === "metric" ? "m" : "ft";
  const priceUnit = unitType === "metric" ? "m³" : "yd³";
  
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>, name: string) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      if (name === "price") {
        onPriceChange(value);
      } else {
        onDimensionChange(name, value);
      }
    }
  }, [onDimensionChange, onPriceChange]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h2 className="text-base font-semibold mb-4 flex items-center">
        <BoxIcon className="w-5 h-5 mr-2 text-primary" />
        Slab Dimensions
      </h2>
      
      <SlabVisualization 
        length={dimensions.length} 
        width={dimensions.width} 
        thickness={dimensions.thickness}
        unitType={unitType}
      />

      <div className="space-y-5">
        {/* Length */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
            <RulerIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-2 items-center">
            <Label htmlFor="length" className="text-sm font-medium text-gray-700">Length:</Label>
            <div className="col-span-3 relative">
              <Input
                id="length"
                type="number"
                placeholder="0.00"
                value={dimensions.length}
                min={0.1}
                step={0.1}
                onChange={(e) => handleInputChange(e, "length")}
                className="pr-10 h-10 font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">{unitDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Width */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
            <RulerIcon className="h-4 w-4 text-primary rotate-90" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-2 items-center">
            <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width:</Label>
            <div className="col-span-3 relative">
              <Input
                id="width"
                type="number"
                placeholder="0.00"
                value={dimensions.width}
                min={0.1}
                step={0.1}
                onChange={(e) => handleInputChange(e, "width")}
                className="pr-10 h-10 font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">{unitDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thickness */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
            <LayersIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-2 items-center">
            <Label htmlFor="thickness" className="text-sm font-medium text-gray-700">Thickness:</Label>
            <div className="col-span-3 relative">
              <Input
                id="thickness"
                type="number"
                placeholder="0.00"
                value={dimensions.thickness}
                min={0.05}
                step={0.05}
                onChange={(e) => handleInputChange(e, "thickness")}
                className="pr-10 h-10 font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">{unitDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Concrete Price */}
        <div className="flex items-center mt-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3 flex-shrink-0">
            <DollarSignIcon className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-2 items-center">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price:</Label>
            <div className="col-span-3 relative">
              <Input
                id="price"
                type="number" 
                placeholder="0.00" 
                value={price}
                min={1}
                step={1}
                onChange={(e) => handleInputChange(e, "price")}
                className="pl-8 pr-16 h-10 font-medium"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">$</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">per {priceUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionsInput;
