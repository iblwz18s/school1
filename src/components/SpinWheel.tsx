import { useRef, useState, useEffect } from "react";

interface SpinWheelProps {
  students: string[];
  onSelect: (student: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const SpinWheel = ({ students, onSelect, isSpinning, setIsSpinning }: SpinWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(210, 60%, 50%)",
    "hsl(150, 60%, 45%)",
    "hsl(45, 80%, 50%)",
    "hsl(280, 60%, 50%)",
    "hsl(0, 60%, 50%)",
    "hsl(180, 60%, 45%)",
  ];

  const segmentAngle = 360 / students.length;

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Random number of full rotations (5-10) plus random position
    const fullRotations = Math.floor(Math.random() * 6) + 5;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + (fullRotations * 360) + randomAngle;
    
    setRotation(newRotation);
    
    // Calculate which student is selected after spin
    setTimeout(() => {
      // السهم يشير للأعلى (عند زاوية -90 درجة من منظور الدائرة)
      // القطاع 0 يبدأ عند -90 درجة ويمتد في اتجاه عقارب الساعة
      // عند دوران العجلة بزاوية R، نحتاج معرفة أي قطاع يكون تحت السهم
      
      // تطبيع زاوية الدوران للحصول على زاوية بين 0-360
      const normalizedRotation = ((newRotation % 360) + 360) % 360;
      
      // عندما تدور العجلة في اتجاه عقارب الساعة، القطاعات تتحرك بعكس الترتيب
      // نحسب كم قطاع تحركت العجلة من موضعها الأصلي
      const selectedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % students.length;
      
      onSelect(students[selectedIndex]);
    }, 4000);
  };

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>
      
      {/* Wheel */}
      <div
        ref={wheelRef}
        className="w-full h-full rounded-full overflow-hidden cursor-pointer shadow-2xl border-4 border-border"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        }}
        onClick={spin}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {students.map((student, index) => {
            const startAngle = index * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);
            
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            // Text position
            const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
            const textRadius = 30;
            const textX = 50 + textRadius * Math.cos(midAngle);
            const textY = 50 + textRadius * Math.sin(midAngle);
            const textRotation = (startAngle + endAngle) / 2 + 90;
            
            // Get first name only for display
            const displayName = student.split(" ")[0];
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="hsl(var(--background))"
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="3"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {displayName}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
          <text x="50" y="50" fill="hsl(var(--foreground))" fontSize="3" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
            دوران
          </text>
        </svg>
      </div>
      
      {!isSpinning && (
        <p className="text-center text-muted-foreground mt-4 text-sm">اضغط على العجلة للدوران</p>
      )}
    </div>
  );
};

export default SpinWheel;
