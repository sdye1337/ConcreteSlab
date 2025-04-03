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
    <div className="slab-visualization w-full h-44 mb-5 flex items-center justify-center">
      <div className="slab-3d relative" style={{ 
        perspective: "800px",
        transformStyle: "preserve-3d",
        transform: "rotateX(60deg) rotateZ(-45deg)"
      }}>
        {/* Top Surface */}
        <div 
          className="absolute bg-blue-100 border border-blue-300 rounded-md"
          style={{ 
            width: "8rem", 
            height: "8rem", 
            transform: "translateZ(20px)" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xs text-blue-600 font-medium">
            {length} {displayUnit} × {width} {displayUnit}
          </div>
        </div>
        
        {/* Front Side */}
        <div 
          className="absolute bg-blue-200 border border-blue-300 rounded-sm"
          style={{ 
            width: "8rem", 
            height: "1.25rem", 
            transform: "rotateX(90deg) translateZ(-64px) translateY(-10px)" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-xs text-blue-600 font-medium">
            {thickness} {displayUnit}
          </div>
        </div>
        
        {/* Left Side */}
        <div 
          className="absolute bg-blue-200 border border-blue-300 rounded-sm"
          style={{ 
            width: "1.25rem", 
            height: "8rem", 
            transform: "rotateY(90deg) translateZ(64px) translateX(-10px)" 
          }}
        ></div>
      </div>
    </div>
  );
};

export default SlabVisualization;
