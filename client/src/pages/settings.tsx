import { Settings } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [defaultUnitType, setDefaultUnitType] = useState<string>("metric");
  const [defaultPrecision, setDefaultPrecision] = useState<string>("2");
  const [saveCalculationsAutomatically, setSaveCalculationsAutomatically] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  const handleClearHistory = () => {
    setIsClearingHistory(true);
    // Simulate clearing history
    setTimeout(() => {
      setIsClearingHistory(false);
      toast({
        title: "History cleared",
        description: "Your calculation history has been cleared successfully.",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-surface shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-secondary">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Units & Preferences</CardTitle>
              <CardDescription>Customize how the calculator works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Default Unit Type */}
              <div className="space-y-2">
                <Label htmlFor="unit-type">Default Unit Type</Label>
                <Select value={defaultUnitType} onValueChange={setDefaultUnitType}>
                  <SelectTrigger id="unit-type">
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (m)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Decimal Precision */}
              <div className="space-y-2">
                <Label htmlFor="precision">Decimal Precision</Label>
                <Select value={defaultPrecision} onValueChange={setDefaultPrecision}>
                  <SelectTrigger id="precision">
                    <SelectValue placeholder="Select decimal precision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 decimal places</SelectItem>
                    <SelectItem value="1">1 decimal place</SelectItem>
                    <SelectItem value="2">2 decimal places</SelectItem>
                    <SelectItem value="3">3 decimal places</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Save Calculations Automatically</Label>
                  <p className="text-xs text-gray-500">Save each new calculation to history</p>
                </div>
                <Switch 
                  id="auto-save"
                  checked={saveCalculationsAutomatically}
                  onCheckedChange={setSaveCalculationsAutomatically}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your saved calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Clear All Calculations</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      This will permanently delete all your saved calculations. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full mt-3 border-yellow-300 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900"
                  onClick={handleClearHistory}
                  disabled={isClearingHistory}
                >
                  {isClearingHistory ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    'Clear All Calculations'
                  )}
                </Button>
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
