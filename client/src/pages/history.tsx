import { History, Clock, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCcw } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Calculation } from "@shared/schema";
import { useLocation } from "wouter";
import { formatNumber } from "@/lib/utils";

const HistoryPage = () => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const { data: calculations = [], isLoading } = useQuery<Calculation[]>({
    queryKey: ["/api/calculations"],
  });

  const deleteCalculation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/calculations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calculations"] });
      toast({
        title: "Calculation deleted",
        description: "The calculation has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete calculation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleLoadCalculation = (calculation: Calculation) => {
    // Store calculation in localStorage to load it on the home page
    localStorage.setItem("loadCalculation", JSON.stringify(calculation));
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-primary bg-opacity-10 p-1.5 rounded-md">
            <History className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Calculation History</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <h2 className="text-base font-semibold mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-primary" />
            All Saved Calculations
          </h2>

          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading calculations...</p>
            </div>
          ) : calculations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No saved calculations</h3>
              <p className="text-gray-500 text-sm mb-6">
                You haven't saved any calculations yet. Save calculations from the calculator to see them here.
              </p>
              <Button
                onClick={() => navigate("/")} 
                className="bg-primary hover:bg-blue-700"
              >
                Go to calculator
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {calculations.map((calculation) => (
                <div 
                  key={calculation.id} 
                  className="bg-white rounded-xl shadow-sm p-4 relative border border-gray-100"
                >
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    {format(new Date(calculation.date), "MMMM d, yyyy, h:mm a")}
                  </div>
                  <div className="flex">
                    {/* Mini visualization */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md border border-blue-200 flex items-center justify-center flex-shrink-0 mr-3 shadow-sm">
                      <div className="w-10 h-10 bg-blue-100 rounded-sm relative border border-blue-200">
                        <div className="absolute -bottom-1 -right-1 text-xs font-medium text-primary bg-white px-1 rounded-sm shadow-sm border border-blue-200">
                          {formatNumber(calculation.length, 1)}×{formatNumber(calculation.width, 1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {formatNumber(calculation.length, 2)}{calculation.unitType === "metric" ? "m" : "ft"} × {formatNumber(calculation.width, 2)}{calculation.unitType === "metric" ? "m" : "ft"} × {formatNumber(calculation.thickness, 2)}{calculation.unitType === "metric" ? "m" : "ft"}
                      </p>
                      <div className="flex text-xs text-gray-500 mt-1.5 space-x-3">
                        <span className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          Volume: <strong className="text-primary">
                            {formatNumber(calculation.volume, 2)} {calculation.unitType === "metric" ? "m³" : "yd³"}
                          </strong>
                        </span>
                        <span className="bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          Cost: <strong className="text-green-600">${formatNumber(calculation.cost, 2)}</strong>
                        </span>
                      </div>
                      <div className="flex mt-3 space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs flex items-center h-8 px-3 bg-white"
                          onClick={() => handleLoadCalculation(calculation)}
                        >
                          <RefreshCcw className="h-3 w-3 mr-1" />
                          Load
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex items-center h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 bg-white"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Calculation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this calculation? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteCalculation.mutate(calculation.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
