import { Button } from "@/components/ui/button";
import { Share2, Save, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertCalculation } from "@shared/schema";

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
}

const CalculationResults = ({ 
  volume, 
  cost, 
  price,
  dimensions,
  unitType
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
      unitType
    });
  };
  
  const handleShareCalculation = () => {
    if (navigator.share) {
      navigator.share({
        title: "Concrete Slab Calculation",
        text: `My concrete slab calculation: ${dimensions.length}${unitType === "metric" ? "m" : "ft"} × ${dimensions.width}${unitType === "metric" ? "m" : "ft"} × ${dimensions.thickness}${unitType === "metric" ? "m" : "ft"} = ${volume.toFixed(2)}${shortVolumeUnit}, cost: $${cost.toFixed(2)}`,
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
      <h2 className="text-base font-semibold flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary mr-2" />
        Calculation Results
      </h2>
      
      <div className="space-y-4">
        {/* Volume */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div>
            <h3 className="text-sm font-medium text-gray-800">Concrete Volume:</h3>
            <p className="text-xs text-gray-600 mt-0.5">Length × Width × Thickness</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{volume.toFixed(2)}</p>
            <p className="text-xs text-gray-600">{volumeUnit}</p>
          </div>
        </div>
        
        {/* Cost */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
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
