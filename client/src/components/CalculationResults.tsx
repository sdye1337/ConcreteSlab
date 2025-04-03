import { Button } from "@/components/ui/button";
import { Share2, Save } from "lucide-react";
import { InfoIcon } from "lucide-react";
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
        text: `My concrete slab calculation: ${dimensions.length}${unitType === "metric" ? "m" : "ft"} × ${dimensions.width}${unitType === "metric" ? "m" : "ft"} × ${dimensions.thickness}${unitType === "metric" ? "m" : "ft"} = ${volume}${unitType === "metric" ? "m³" : "yd³"}, cost: $${cost.toFixed(2)}`,
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
    <div className="bg-surface rounded-xl shadow-sm p-5 mb-6">
      <h2 className="text-base font-semibold flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Calculation Results
      </h2>
      
      <div className="space-y-4">
        {/* Volume */}
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Concrete Volume:</h3>
            <p className="text-xs text-gray-500 mt-0.5">Length × Width × Thickness</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{volume.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{volumeUnit}</p>
          </div>
        </div>
        
        {/* Cost */}
        <div className="flex justify-between items-center px-4 py-3 bg-amber-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Estimated Cost:</h3>
            <p className="text-xs text-gray-500 mt-0.5">Volume × Price per {unitType === "metric" ? "m³" : "yd³"}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent">${cost.toFixed(2)}</p>
            <p className="text-xs text-gray-500">based on ${price}/{unitType === "metric" ? "m³" : "yd³"}</p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information:</h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li className="flex items-start">
              <InfoIcon className="h-4 w-4 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0" />
              Add 5-10% extra for wastage and spills
            </li>
            <li className="flex items-start">
              <InfoIcon className="h-4 w-4 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0" />
              Consider adding rebar or mesh for structural integrity
            </li>
            <li className="flex items-start">
              <InfoIcon className="h-4 w-4 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0" />
              Pricing excludes labor and equipment costs
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-5 flex space-x-3">
        <Button 
          className="flex-1 bg-primary hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors flex items-center justify-center"
          onClick={handleSaveCalculation}
          disabled={saveCalculation.isPending}
        >
          <Save className="h-4 w-4 mr-1.5" />
          {saveCalculation.isPending ? "Saving..." : "Save Calculation"}
        </Button>
        <Button 
          variant="outline"
          className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
          onClick={handleShareCalculation}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalculationResults;
