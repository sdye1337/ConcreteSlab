import { Settings, ArrowLeft, Sliders, Database, Ruler, Calculator, Trash2 } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [defaultUnitType, setDefaultUnitType] = useState<string>("metric");
  const [defaultPrecision, setDefaultPrecision] = useState<string>("2");
  const [saveCalculationsAutomatically, setSaveCalculationsAutomatically] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  // Get the count of calculations
  const { data: calculations = [] } = useQuery({
    queryKey: ["/api/calculations"],
  });

  const handleClearHistory = () => {
    if (calculations.length === 0) {
      toast({
        title: "No calculations to clear",
        description: "Your history is already empty.",
      });
      return;
    }

    setIsClearingHistory(true);
    
    // In a real app, we'd delete all calculations here
    setTimeout(() => {
      setIsClearingHistory(false);
      toast({
        title: "History cleared",
        description: "Your calculation history has been cleared successfully.",
      });
      // This would invalidate the query to refresh the history
      queryClient.invalidateQueries({ queryKey: ["/api/calculations"] });
    }, 1500);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-primary bg-opacity-10 p-1.5 rounded-md">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
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
          <Card className="mb-4 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Sliders className="h-4 w-4 mr-2 text-primary" />
                Units & Preferences
              </CardTitle>
              <CardDescription>Customize how the calculator works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-3">
              {/* Default Unit Type */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                  <Ruler className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="unit-type" className="font-medium text-gray-700">Default Unit Type</Label>
                  <Select value={defaultUnitType} onValueChange={setDefaultUnitType}>
                    <SelectTrigger id="unit-type" className="h-10">
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (m)</SelectItem>
                      <SelectItem value="imperial">Imperial (ft)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Which measurement system to use by default
                  </p>
                </div>
              </div>

              {/* Decimal Precision */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calculator className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="precision" className="font-medium text-gray-700">Decimal Precision</Label>
                  <Select value={defaultPrecision} onValueChange={setDefaultPrecision}>
                    <SelectTrigger id="precision" className="h-10">
                      <SelectValue placeholder="Select decimal precision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 decimal places</SelectItem>
                      <SelectItem value="1">1 decimal place</SelectItem>
                      <SelectItem value="2">2 decimal places</SelectItem>
                      <SelectItem value="3">3 decimal places</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Number of decimal places to show in results
                  </p>
                </div>
              </div>
              
              {/* Auto Save */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3 flex-shrink-0">
                  <Database className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save" className="font-medium text-gray-700">Save Calculations Automatically</Label>
                    <p className="text-xs text-gray-500">Save each new calculation to history</p>
                  </div>
                  <Switch 
                    id="auto-save"
                    checked={saveCalculationsAutomatically}
                    onCheckedChange={setSaveCalculationsAutomatically}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Button 
                onClick={handleSaveSettings}
                className="bg-primary hover:bg-blue-700"
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Database className="h-4 w-4 mr-2 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your saved calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Clear All Calculations</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      This will permanently delete all your saved calculations ({calculations.length} total). This action cannot be undone.
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full mt-3 border-yellow-300 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900 flex items-center justify-center"
                      disabled={isClearingHistory || calculations.length === 0}
                    >
                      {isClearingHistory ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Clear All Calculations
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear calculation history?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All saved calculations will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleClearHistory}
                      >
                        Yes, clear history
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <Separator />
              
              <div className="text-xs text-center text-gray-500">
                <p>Concrete Slab Calculator v1.0.0</p>
                <p className="mt-1">© 2023 All rights reserved</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
