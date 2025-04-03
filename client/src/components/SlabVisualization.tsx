interface SlabVisualizationProps {
  length: number;
  width: number;
  thickness: number;
  unitType: string;
  slabType?: string;
}

const SlabVisualization = ({ 
  length, 
  width, 
  thickness,
  unitType,
  slabType = "rectangular"
}: SlabVisualizationProps) => {
  const displayUnit = unitType === "metric" ? "m" : "ft";
  const areaUnit = unitType === "metric" ? "m²" : "ft²";
  
  return (
    <div className="relative w-full mb-8 pt-6">
      {/* Help icon and message */}
      <div className="absolute -top-0 right-0 group">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 cursor-pointer text-gray-500 hover:bg-blue-100 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="absolute right-0 mt-1 z-20 origin-top-right hidden group-hover:block">
          <div className="bg-white shadow-lg rounded-md w-64 p-3 text-xs text-gray-700 border border-gray-200">
            <p className="font-medium mb-1">Concrete Slab Dimensions</p>
            <p>This is a visual representation of your concrete slab with dimensions:</p>
            <ul className="mt-1 pl-4 list-disc space-y-1">
              <li><span className="font-medium">Length:</span> How long the slab is</li>
              <li><span className="font-medium">Width:</span> How wide the slab is</li>
              <li><span className="font-medium">Thickness:</span> How deep/thick the slab is</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-700 mb-3 ml-1">Visual Representation:</h3>
      
      {/* Slab diagram */}
      <div className="flex items-center justify-center">
        <div className="relative aspect-square max-w-[280px] h-auto border border-gray-300 bg-gray-50 rounded-lg p-4">
          {/* Concrete slab visualization */}
          <div className="bg-gray-100 border border-blue-300 rounded-md shadow-md relative aspect-square w-full h-auto flex flex-col justify-between">
            {/* Top surface */}
            <div className="flex-1 p-2 bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Grid pattern */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{ 
                  backgroundImage: "linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              ></div>
              
              {/* Rectangular Slab */}
              {slabType === "rectangular" && (
                <>
                  {/* Center text */}
                  <div className="relative h-full flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold text-blue-800">{length} × {width}</span>
                    <span className="text-xs text-blue-600">{displayUnit}</span>
                  </div>
                  
                  {/* Length arrow and label */}
                  <div className="absolute -top-7 left-0 w-full flex flex-col items-center">
                    <div className="flex items-center w-full px-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="h-0.5 bg-gray-400 flex-1"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-0.5">Length: {length} {displayUnit}</span>
                  </div>
                  
                  {/* Width arrow and label */}
                  <div className="absolute -left-7 top-0 h-full flex flex-col items-center justify-center transform -rotate-90 origin-left">
                    <div className="flex items-center w-full px-2 transform rotate-180">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="h-0.5 bg-gray-400 flex-1"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-0.5 transform rotate-180">Width: {width} {displayUnit}</span>
                  </div>
                </>
              )}
              
              {/* Circular Slab */}
              {slabType === "circular" && (
                <>
                  {/* Circle shape */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="rounded-full border-2 border-blue-300 bg-blue-50 flex items-center justify-center"
                      style={{ width: '85%', height: '85%' }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-blue-800">Ø {length}</span>
                        <span className="text-xs text-blue-600">{displayUnit}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Diameter label */}
                  <div className="absolute -top-7 left-0 w-full flex flex-col items-center">
                    <div className="flex items-center w-full px-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="h-0.5 bg-gray-400 flex-1"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-0.5">Diameter: {length} {displayUnit}</span>
                  </div>
                </>
              )}
              
              {/* Custom Area Slab */}
              {slabType === "custom" && (
                <>
                  {/* Irregular shape representation */}
                  <div className="relative h-full flex flex-col items-center justify-center">
                    <svg 
                      viewBox="0 0 100 100" 
                      className="w-4/5 h-4/5"
                    >
                      <path 
                        d="M10,30 Q30,5 50,10 T90,30 Q95,50 90,70 T50,90 Q30,95 10,70 T10,30" 
                        fill="#e6f2ff" 
                        stroke="#90cdf4" 
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold text-blue-800">{(length * width).toFixed(2)}</span>
                      <span className="text-xs text-blue-600">{areaUnit}</span>
                    </div>
                  </div>
                  
                  {/* Area label */}
                  <div className="absolute -top-7 left-0 w-full flex flex-col items-center">
                    <div className="flex items-center w-full px-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="h-0.5 bg-gray-400 flex-1"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-0.5">Area: {(length * width).toFixed(2)} {areaUnit}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thickness indicator */}
            <div className="h-8 bg-blue-200 border-t border-blue-300 rounded-b-md flex items-center justify-center relative">
              <span className="text-xs font-medium text-blue-800">Thickness: {thickness} {displayUnit}</span>
              
              {/* Thickness arrows */}
              <div className="absolute -right-10 top-0 h-full flex items-center">
                <div className="flex flex-col items-center">
                  <div className="h-full w-0.5 bg-gray-400 flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlabVisualization;
