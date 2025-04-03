import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SlabVisualization from "./SlabVisualization";
import { ChangeEvent, useCallback } from "react";
import { RulerIcon, BoxIcon, LayersIcon, DollarSignIcon, HelpCircle } from "lucide-react";

// Helper component for tooltips
const HelpTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1.5">
    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 cursor-pointer text-gray-500 hover:bg-blue-100 hover:text-blue-600">
      <HelpCircle className="h-3.5 w-3.5" />
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 mt-1 z-10 origin-top hidden group-hover:block">
      <div className="bg-white shadow-lg rounded-md w-56 p-3 text-xs text-gray-700 border border-gray-200">
        {text}
      </div>
    </div>
  </div>
);

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center">
          <BoxIcon className="w-5 h-5 mr-2 text-primary" />
          Slab Dimensions
        </h2>
        
        {/* Help button for How To section */}
        <div className="group relative">
          <div className="flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-blue-100">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            How to use
          </div>
          <div className="absolute right-0 mt-1 z-10 origin-top-right hidden group-hover:block">
            <div className="bg-white shadow-lg rounded-md w-72 p-4 text-sm text-gray-700 border border-gray-200">
              <h3 className="font-semibold text-blue-700 mb-2">How to Use the Calculator</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Enter the <span className="font-medium">length</span>, <span className="font-medium">width</span>, and <span className="font-medium">thickness</span> of your concrete slab</li>
                <li>Enter the <span className="font-medium">price</span> of concrete per cubic meter/yard</li>
                <li>The calculator will automatically show you the volume and cost</li>
                <li>Switch between metric and imperial units as needed</li>
                <li>Use the "Save Calculation" button to save your results for later reference</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
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
            <div className="flex items-center">
              <Label htmlFor="length" className="text-sm font-medium text-gray-700">Length:</Label>
              <HelpTooltip text="The horizontal distance from one end of the slab to the other. For a rectangular slab, this is typically the longer dimension." />
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width:</Label>
              <HelpTooltip text="The horizontal distance across the slab perpendicular to the length. For a rectangular slab, this is typically the shorter dimension." />
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="thickness" className="text-sm font-medium text-gray-700">Thickness:</Label>
              <HelpTooltip text="The vertical height or depth of the slab. Standard slabs are typically 4-6 inches (0.1-0.15m) thick, but may vary based on application." />
            </div>
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
            <div className="flex items-center">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price:</Label>
              <HelpTooltip text={`The cost of concrete per cubic ${unitType === "metric" ? "meter" : "yard"}. This varies by location and concrete type. You may need to check with local suppliers for accurate pricing.`} />
            </div>
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
