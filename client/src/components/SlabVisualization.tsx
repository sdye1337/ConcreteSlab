interface SlabVisualizationProps {
  length: number;
  width: number;
  thickness: number;
  unitType: string;
}

const SlabVisualization = ({ 
  length, 
  width, 
  thickness,
  unitType 
}: SlabVisualizationProps) => {
  const displayUnit = unitType === "metric" ? "m" : "ft";
  
  return (
    <div className="slab-visualization w-full h-48 mb-5 flex items-center justify-center">
      <div className="slab-3d relative" style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transform: "rotateX(60deg) rotateZ(-45deg)",
        transition: "all 0.3s ease"
      }}>
        {/* Top Surface */}
        <div 
          className="absolute bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-md shadow-sm"
          style={{ 
            width: "10rem", 
            height: "10rem", 
            transform: "translateZ(20px)" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-sm text-blue-700 font-medium">
            {length} {displayUnit} × {width} {displayUnit}
          </div>
        </div>
        
        {/* Front Side */}
        <div 
          className="absolute bg-gradient-to-b from-blue-200 to-blue-300 border border-blue-300 rounded-sm"
          style={{ 
            width: "10rem", 
            height: "1.5rem", 
            transform: "rotateX(90deg) translateZ(-80px) translateY(-12px)" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xs text-blue-800 font-medium">
            {thickness} {displayUnit}
          </div>
        </div>
        
        {/* Left Side */}
        <div 
          className="absolute bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-300 rounded-sm"
          style={{ 
            width: "1.5rem", 
            height: "10rem", 
            transform: "rotateY(90deg) translateZ(80px) translateX(-12px)" 
          }}
        ></div>
        
        {/* Grid lines on top surface for visual appeal */}
        <div 
          className="absolute pointer-events-none"
          style={{ 
            width: "10rem", 
            height: "10rem", 
            transform: "translateZ(21px)",
            background: "linear-gradient(to right, transparent 9.09%, rgba(59, 130, 246, 0.1) 9.09%, rgba(59, 130, 246, 0.1) 10%, transparent 10%)",
            backgroundSize: "10% 100%"
          }}
        ></div>
        <div 
          className="absolute pointer-events-none"
          style={{ 
            width: "10rem", 
            height: "10rem", 
            transform: "translateZ(21px)",
            background: "linear-gradient(to bottom, transparent 9.09%, rgba(59, 130, 246, 0.1) 9.09%, rgba(59, 130, 246, 0.1) 10%, transparent 10%)",
            backgroundSize: "100% 10%"
          }}
        ></div>
      </div>
    </div>
  );
};

export default SlabVisualization;
