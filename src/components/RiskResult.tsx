import { cn } from "@/lib/utils";
import { QDiabetesResult } from "@/lib/qdiabetes";

interface RiskResultProps {
  result: QDiabetesResult;
  age?: number;
  bmi?: number;
}

export function RiskResult({ result, age, bmi }: RiskResultProps) {
  const riskLabels = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    "very-high": "Very High Risk",
  };

  const visualPercentage = Math.min(result.riskPercentage, 50) * 2;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 md:p-10">
      {/* Main Risk Display */}
      <div className="text-center mb-8">
        <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#665073' }}>
          10-Year Diabetes Risk
        </p>
        <div className="flex items-baseline justify-center mb-4">
          <span className="text-6xl md:text-7xl font-light" style={{ color: '#28030f' }}>
            {result.riskPercentage.toFixed(1)}
          </span>
          <span className="text-2xl font-light ml-1" style={{ color: '#665073' }}>%</span>
        </div>
        
        {/* Risk Level Badge */}
        <div className={cn(
          "inline-block px-4 py-1.5 rounded-full text-sm font-medium",
          result.riskLevel === "low" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
          result.riskLevel === "moderate" && "bg-amber-50 text-amber-700 border border-amber-200",
          result.riskLevel === "high" && "bg-orange-50 text-orange-700 border border-orange-200",
          result.riskLevel === "very-high" && "bg-red-50 text-red-700 border border-red-200"
        )}>
          {riskLabels[result.riskLevel]}
        </div>
      </div>

      {/* Visual Gauge */}
      <div className="w-full max-w-xs mb-8">
        <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 mb-2">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-5 rounded-sm shadow-md transition-all duration-700"
            style={{ left: `calc(${visualPercentage}% - 6px)`, backgroundColor: '#28030f' }}
          />
        </div>
        <div className="flex justify-between text-xs font-light" style={{ color: '#8a7a9a' }}>
          <span>0%</span>
          <span>10%</span>
          <span>25%</span>
          <span>50%+</span>
        </div>
      </div>

      {/* Interpretation Box */}
      <div className="w-full max-w-sm p-5 rounded-xl mb-6" style={{ backgroundColor: '#fbf583' }}>
        <p className="text-sm font-medium mb-1" style={{ color: '#28030f' }}>What does this mean?</p>
        <p className="text-sm font-light leading-relaxed" style={{ color: '#28030f' }}>
          {result.riskPercentage < 2 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Low risk.`}
          {result.riskPercentage >= 2 && result.riskPercentage < 6 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Early action helps.`}
          {result.riskPercentage >= 6 && result.riskPercentage < 10 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Lifestyle changes recommended.`}
          {result.riskPercentage >= 10 && `Out of 1,000 people like you, around ${Math.round(result.riskPercentage * 10)} will develop diabetes in 10 years. Active intervention advised.`}
        </p>
      </div>

      {/* BMI Quick Stat */}
      {bmi && (
        <div className="text-center">
          <p className="text-xs font-light mb-1" style={{ color: '#8a7a9a' }}>Current BMI</p>
          <p className="text-xl font-light" style={{ color: '#28030f' }}>{bmi.toFixed(1)}</p>
        </div>
      )}
    </div>
  );
}

export default RiskResult;
