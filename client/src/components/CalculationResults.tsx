import { Button } from "@/components/ui/button";
import { Share2, Save, Calculator, Info, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertCalculation } from "@shared/schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CalculationResultsProps {
  volume: number;
  cost: number;
  price: number;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  unitType: string;
  slabType?: string;
}

const CalculationResults = ({ 
  volume, 
  cost, 
  price,
  dimensions,
  unitType,
  slabType = "rectangular"
}: CalculationResultsProps) => {
  const { toast } = useToast();
  const volumeUnit = unitType === "metric" ? "cubic meters (m³)" : "cubic yards (yd³)";
  const shortVolumeUnit = unitType === "metric" ? "m³" : "yd³";
  
  const saveCalculation = useMutation({
    mutationFn: async (calculation: InsertCalculation) => {
      const response = await apiRequest("POST", "/api/calculations", calculation);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calculations"] });
      toast({
        title: "Calculation saved",
        description: "Your calculation has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save calculation: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleSaveCalculation = () => {
    saveCalculation.mutate({
      length: dimensions.length,
      width: dimensions.width,
      thickness: dimensions.thickness,
      volume,
      cost,
      price,
      unitType,
      slabType
    });
  };
  
  const handleShareCalculation = () => {
    let shareText = "";
    
    if (slabType === "rectangular") {
      shareText = `My ${slabType} concrete slab calculation: ${dimensions.length}${unitType === "metric" ? "m" : "ft"} × ${dimensions.width}${unitType === "metric" ? "m" : "ft"} × ${dimensions.thickness}${unitType === "metric" ? "m" : "ft"} = ${volume.toFixed(2)}${shortVolumeUnit}, cost: $${cost.toFixed(2)}`;
    } else if (slabType === "circular") {
      shareText = `My ${slabType} concrete slab calculation: diameter ${dimensions.length}${unitType === "metric" ? "m" : "ft"} × thickness ${dimensions.thickness}${unitType === "metric" ? "m" : "ft"} = ${volume.toFixed(2)}${shortVolumeUnit}, cost: $${cost.toFixed(2)}`;
    } else if (slabType === "custom") {
      shareText = `My ${slabType} concrete slab calculation: area ${(dimensions.length * dimensions.width).toFixed(2)}${unitType === "metric" ? "m²" : "ft²"} × thickness ${dimensions.thickness}${unitType === "metric" ? "m" : "ft"} = ${volume.toFixed(2)}${shortVolumeUnit}, cost: $${cost.toFixed(2)}`;
    }
    
    if (navigator.share) {
      navigator.share({
        title: "Concrete Slab Calculation",
        text: shareText,
      }).catch((error) => {
        toast({
          title: "Sharing failed",
          description: `${error.message}`,
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API.",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center">
          <Calculator className="h-5 w-5 text-primary mr-2" />
          Calculation Results
        </h2>
        
        {/* How we calculate button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2.5 py-1.5 text-xs border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100">
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              How we calculate
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-primary">Calculation Methods</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-blue-50 rounded border border-blue-100">
                  <p className="font-medium text-blue-700">Volume Calculation</p>
                  <div className="mt-1 text-gray-700">
                    <p>Volume is calculated using the formula:</p>
                    {slabType === "rectangular" && (
                      <div className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                        Volume = Length × Width × Thickness
                      </div>
                    )}
                    {slabType === "circular" && (
                      <div className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                        Volume = π × (Diameter/2)² × Thickness
                      </div>
                    )}
                    {slabType === "custom" && (
                      <div className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                        Volume = Area × Thickness
                      </div>
                    )}
                    <div className="mt-2">
                      <p>For your slab:</p>
                      {slabType === "rectangular" && (
                        <p className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                          {dimensions.length} × {dimensions.width} × {dimensions.thickness} = {volume.toFixed(2)} {shortVolumeUnit}
                        </p>
                      )}
                      {slabType === "circular" && (
                        <p className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                          π × ({dimensions.length}/2)² × {dimensions.thickness} = {volume.toFixed(2)} {shortVolumeUnit}
                        </p>
                      )}
                      {slabType === "custom" && (
                        <p className="font-mono bg-white/70 p-2 rounded mt-1 text-blue-800 border border-blue-200">
                          {(dimensions.length * dimensions.width).toFixed(2)} {unitType === "metric" ? "m²" : "ft²"} × {dimensions.thickness} = {volume.toFixed(2)} {shortVolumeUnit}
                        </p>
                      )}
                    </div>
                    {unitType === "imperial" && (
                      <p className="text-xs mt-2 italic">Note: For imperial measurements, we convert from cubic feet to cubic yards for standard industry pricing (27 cubic feet = 1 cubic yard).</p>
                    )}
                  </div>
                </div>
                
                <div className="p-2.5 bg-green-50 rounded border border-green-100">
                  <p className="font-medium text-green-700">Cost Calculation</p>
                  <div className="mt-1 text-gray-700">
                    <p>Cost is calculated using the formula:</p>
                    <div className="font-mono bg-white/70 p-2 rounded mt-1 text-green-800 border border-green-200">
                      Cost = Volume × Price per unit volume
                    </div>
                    <div className="mt-2">
                      <p>For your slab:</p>
                      <p className="font-mono bg-white/70 p-2 rounded mt-1 text-green-800 border border-green-200">
                        {volume.toFixed(2)} {shortVolumeUnit} × ${price} = ${cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-4">
        {/* Volume */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 relative">
          <div className="absolute -top-2.5 -right-2.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 p-0 shadow-sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="w-72 p-3 text-xs">
                <div className="space-y-2">
                  <h4 className="font-medium">Concrete Volume Calculation</h4>
                  <p>This is the total amount of concrete needed for your slab.</p>
                  <div className="bg-blue-50 p-2 rounded border border-blue-100 mt-2">
                    <p className="font-medium">Your calculation:</p>
                    {slabType === "rectangular" && (
                      <p className="mt-1">
                        {dimensions.length} {unitType === "metric" ? "m" : "ft"} × {dimensions.width} {unitType === "metric" ? "m" : "ft"} × {dimensions.thickness} {unitType === "metric" ? "m" : "ft"} = {volume.toFixed(2)} {shortVolumeUnit}
                      </p>
                    )}
                    {slabType === "circular" && (
                      <p className="mt-1">
                        π × ({dimensions.length}/2)² × {dimensions.thickness} {unitType === "metric" ? "m" : "ft"} = {volume.toFixed(2)} {shortVolumeUnit}
                      </p>
                    )}
                    {slabType === "custom" && (
                      <p className="mt-1">
                        {(dimensions.length * dimensions.width).toFixed(2)} {unitType === "metric" ? "m²" : "ft²"} × {dimensions.thickness} {unitType === "metric" ? "m" : "ft"} = {volume.toFixed(2)} {shortVolumeUnit}
                      </p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-800">Concrete Volume:</h3>
            {slabType === "rectangular" && (
              <p className="text-xs text-gray-600 mt-0.5">Length × Width × Thickness</p>
            )}
            {slabType === "circular" && (
              <p className="text-xs text-gray-600 mt-0.5">π × (Diameter/2)² × Thickness</p>
            )}
            {slabType === "custom" && (
              <p className="text-xs text-gray-600 mt-0.5">Area × Thickness</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{volume.toFixed(2)}</p>
            <p className="text-xs text-gray-600">{volumeUnit}</p>
          </div>
        </div>
        
        {/* Cost */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 relative">
          <div className="absolute -top-2.5 -right-2.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-green-100 border-green-300 text-green-700 hover:bg-green-200 p-0 shadow-sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="w-72 p-3 text-xs">
                <div className="space-y-2">
                  <h4 className="font-medium">Cost Calculation</h4>
                  <p>This is the estimated cost of concrete for your slab based on your specified price.</p>
                  <div className="bg-green-50 p-2 rounded border border-green-100 mt-2">
                    <p className="font-medium">Your calculation:</p>
                    <p className="mt-1">
                      {volume.toFixed(2)} {shortVolumeUnit} × ${price}/{shortVolumeUnit} = ${cost.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-2 italic text-gray-500">Note: Actual costs may vary based on location, concrete type, and supplier.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-800">Estimated Cost:</h3>
            <p className="text-xs text-gray-600 mt-0.5">Volume × Price per {shortVolumeUnit}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-green-600">${cost.toFixed(2)}</p>
            <p className="text-xs text-gray-600">based on ${price}/{shortVolumeUnit}</p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
            <Info className="h-4 w-4 text-gray-500 mr-1.5" />
            Additional Information:
          </h3>
          <ul className="text-xs text-gray-600 space-y-2 pl-6 list-disc">
            <li>
              Add 5-10% extra for wastage and spills
            </li>
            <li>
              Consider adding rebar or mesh for structural integrity
            </li>
            <li>
              Pricing excludes labor and equipment costs
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-5 grid grid-cols-4 gap-3">
        <Button 
          className="col-span-3 bg-primary hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors flex items-center justify-center h-11"
          onClick={handleSaveCalculation}
          disabled={saveCalculation.isPending}
        >
          <Save className="h-4 w-4 mr-1.5" />
          {saveCalculation.isPending ? "Saving..." : "Save Calculation"}
        </Button>
        <Button 
          variant="outline"
          className="col-span-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors h-11"
          onClick={handleShareCalculation}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalculationResults;
