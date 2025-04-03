import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { type Calculation } from "@shared/schema";
import { Link } from "wouter";
import { RefreshCcw } from "lucide-react";

interface RecentCalculationsProps {
  calculations: Calculation[];
  onLoadCalculation: (calculation: Calculation) => void;
  isLoading: boolean;
}

const RecentCalculations = ({ 
  calculations, 
  onLoadCalculation,
  isLoading
}: RecentCalculationsProps) => {
  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-base font-semibold flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Calculations
        </h2>
        <div className="bg-surface rounded-xl shadow-sm p-4 mb-3 relative animate-pulse">
          <div className="h-16 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  if (calculations.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-base font-semibold flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Calculations
        </h2>
        <div className="bg-surface rounded-xl shadow-sm p-6 mb-3 text-center">
          <p className="text-gray-500 text-sm">No saved calculations yet.</p>
          <p className="text-gray-500 text-xs mt-1">
            Your saved calculations will appear here.
          </p>
        </div>
      </div>
    );
  }

  const recentCalculations = calculations.slice(0, 3);

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Calculations
      </h2>
      
      {recentCalculations.map((calculation) => (
        <div 
          key={calculation.id} 
          className="bg-surface rounded-xl shadow-sm p-4 mb-3 relative"
        >
          <div className="absolute top-3 right-3 text-xs text-gray-500">
            {format(new Date(calculation.date), "MMMM d, yyyy")}
          </div>
          <div className="flex">
            {/* Mini visualization */}
            <div className="w-16 h-16 bg-blue-50 rounded-md border border-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
              <div className="w-10 h-10 bg-blue-100 rounded-sm relative">
                <div className="absolute -bottom-1 -right-1 text-xs font-medium text-primary">
                  {calculation.length}×{calculation.width}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                {calculation.length}{calculation.unitType === "metric" ? "m" : "ft"} × {calculation.width}{calculation.unitType === "metric" ? "m" : "ft"} × {calculation.thickness}{calculation.unitType === "metric" ? "m" : "ft"}
              </p>
              <div className="flex text-xs text-gray-500 mt-1 space-x-3">
                <span>
                  Volume: <strong className="text-primary">
                    {calculation.volume.toFixed(2)} {calculation.unitType === "metric" ? "m³" : "yd³"}
                  </strong>
                </span>
                <span>
                  Cost: <strong className="text-accent">${calculation.cost.toFixed(2)}</strong>
                </span>
              </div>
              <div className="flex mt-2">
                <button 
                  className="text-xs text-primary flex items-center"
                  onClick={() => onLoadCalculation(calculation)}
                >
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {calculations.length > 3 && (
        <Link href="/history">
          <a className="text-sm text-primary font-medium flex items-center mx-auto mt-3">
            View all saved calculations
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default RecentCalculations;
