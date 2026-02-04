import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FlippableCardProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
}

export function FlippableCard({ 
  front, 
  back, 
  isFlipped: controlledIsFlipped, 
  onFlip,
  className 
}: FlippableCardProps) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  
  const isFlipped = controlledIsFlipped ?? internalIsFlipped;
  
  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalIsFlipped(!internalIsFlipped);
    }
  };

  return (
    <div 
      className={cn("perspective-1000 cursor-pointer w-full relative", className)}
      style={{ perspective: "1000px" }}
    >
      <div 
        className="w-full transition-transform duration-700"
        onClick={handleFlip}
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          cursor: "pointer"
        }}
      >
        {/* Front */}
        <div 
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          {front}
        </div>
      </div>

      {/* Back - rendered separately to overlay */}
      <div 
        className="w-full transition-transform duration-700 absolute top-0 left-0"
        onClick={handleFlip}
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          cursor: "pointer"
        }}
      >
        {back}
      </div>
    </div>
  );
}
