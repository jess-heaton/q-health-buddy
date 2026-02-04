import { cn } from "@/lib/utils";
import { QDiabetesResult } from "@/lib/qdiabetes";
import { RotateCw, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RiskResultProps {
  result: QDiabetesResult;
  age?: number;
  bmi?: number;
  onFlipHint?: boolean;
  onViewFactors?: () => void;
  onViewProjection?: () => void;
  currentView?: "result" | "factors" | "projection";
}

export function RiskResult({ result, age, bmi, onFlipHint = true, onViewFactors, onViewProjection, currentView = "result" }: RiskResultProps) {
  const riskColors = {
    low: { bg: "bg-emerald-50", border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-700 border-emerald-300", text: "text-emerald-600" },
    moderate: { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-100 text-amber-700 border-amber-300", text: "text-amber-600" },
    high: { bg: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-100 text-orange-700 border-orange-300", text: "text-orange-600" },
    "very-high": { bg: "bg-red-50", border: "border-red-300", badge: "bg-red-100 text-red-700 border-red-300", text: "text-red-600" },
  };

  const riskLabels = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    "very-high": "Very High Risk",
  };

  const visualPercentage = Math.min(result.riskPercentage, 50) * 2;

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-0 bg-white">
      {/* Hero Section - Compact and Bold */}
      <div className="w-full py-10 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4" style={{color: '#28030f'}}>Your 10-Year Diabetes Risk</p>
        <div className="flex items-baseline justify-center mb-6">
          <div className="text-7xl font-black leading-none" style={{color: '#28030f'}}>
            {result.riskPercentage.toFixed(1)}
          </div>
          <div className="text-3xl font-light ml-2" style={{color: '#28030f'}}>%</div>
        </div>
        
        {/* Risk Level Badge - Inline with percentage */}
        <div className={cn(
          "inline-block px-5 py-2 rounded-full border-2 text-sm font-semibold",
          result.riskLevel === "low" && "bg-emerald-50 border-emerald-400 text-emerald-700",
          result.riskLevel === "moderate" && "bg-amber-50 border-amber-400 text-amber-700",
          result.riskLevel === "high" && "bg-orange-50 border-orange-400 text-orange-700",
          result.riskLevel === "very-high" && "bg-red-50 border-red-400 text-red-700"
        )}>
          {riskLabels[result.riskLevel]}
        </div>
      </div>

      {/* Visual Gauge - Prominent */}
      <div className="w-full px-8 py-6">
        <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 shadow-md mb-4">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-2 h-6 rounded-full shadow-lg transition-all duration-700"
            style={{ left: `calc(${visualPercentage}% - 4px)`, backgroundColor: '#28030f' }}
          />
        </div>
        <div className="flex justify-between text-xs font-light text-gray-500">
          <span>0%</span>
          <span>10%</span>
          <span>25%</span>
          <span>50%+</span>
        </div>
      </div>

      {/* Interpretation Box - Simplified and Compact */}
      <div className="w-full px-8 py-4">
        <div className="p-6 rounded-2xl" style={{backgroundColor: '#fbf583'}}>
          <p className="text-sm font-semibold mb-2" style={{color: '#28030f'}}>What does this mean?</p>
          <p className="text-sm font-light leading-relaxed" style={{color: '#28030f'}}>
            {result.riskPercentage < 2 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Low risk.`}
            {result.riskPercentage >= 2 && result.riskPercentage < 6 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Early action helps.`}
            {result.riskPercentage >= 6 && result.riskPercentage < 10 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Lifestyle changes recommended.`}
            {result.riskPercentage >= 10 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Active intervention advised.`}
          </p>
        </div>
      </div>

      {/* Quick Stat - Subtle */}
      {bmi && (
        <div className="text-center py-3 px-8">
          <p className="text-xs font-light text-gray-400 mb-1">Current BMI</p>
          <p className="text-2xl font-light" style={{color: '#28030f'}}>{bmi.toFixed(1)}</p>
        </div>
      )}

      {/* Navigation Buttons - Minimal */}
      <div className="w-full px-8 py-6">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={(e) => e.stopPropagation()}
            disabled={currentView === "result"}
            className="py-2 px-3 rounded-lg font-medium text-xs transition-all"
            style={{
              backgroundColor: currentView === "result" ? '#fbf583' : '#f3f4f6',
              color: '#28030f',
              opacity: currentView === "result" ? 1 : 0.5,
              border: `1px solid ${currentView === "result" ? '#fbf583' : '#e5e7eb'}`
            }}
          >
            Score
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewFactors?.();
            }}
            className="py-2 px-3 rounded-lg font-medium text-xs transition-all border border-gray-300 hover:bg-gray-50"
            style={{color: '#28030f'}}
          >
            Factors
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProjection?.();
            }}
            className="py-2 px-3 rounded-lg font-medium text-xs transition-all border border-gray-300 hover:bg-gray-50"
            style={{color: '#28030f'}}
          >
            Projection
          </button>
        </div>
      </div>

      {/* Flip Hint - Minimal */}
      <div className="text-center pb-4">
        <p className="text-xs font-light text-gray-300">
          ← Tap to edit
        </p>
      </div>
    </div>
  );
}

export default RiskResult;
