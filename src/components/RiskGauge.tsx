import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  percentage: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
}

export function RiskGauge({ percentage, riskLevel }: RiskGaugeProps) {
  const riskColors = {
    low: 'text-risk-low',
    moderate: 'text-risk-moderate',
    high: 'text-risk-high',
    'very-high': 'text-risk-very-high',
  };

  const riskLabels = {
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    'very-high': 'Very High Risk',
  };

  const riskBadges = {
    low: 'risk-badge-low',
    moderate: 'risk-badge-moderate',
    high: 'risk-badge-high',
    'very-high': 'risk-badge-very-high',
  };

  // Clamp percentage to 0-50 for visual representation (most scores are under 50%)
  const visualPercentage = Math.min(percentage, 50) * 2;

  return (
    <div className="space-y-6">
      {/* Main percentage display */}
      <div className="text-center">
        <div className={cn("text-7xl font-display font-bold tracking-tight", riskColors[riskLevel])}>
          {percentage.toFixed(1)}%
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          10-year risk of developing Type 2 Diabetes
        </p>
      </div>

      {/* Risk badge */}
      <div className="flex justify-center">
        <span className={riskBadges[riskLevel]}>
          {riskLabels[riskLevel]}
        </span>
      </div>

      {/* Visual gauge */}
      <div className="relative pt-4">
        <div className="risk-gauge">
          <div 
            className="risk-gauge-marker"
            style={{ left: `calc(${visualPercentage}% - 2px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0%</span>
          <span>5.6%</span>
          <span>10%</span>
          <span>20%</span>
          <span>50%+</span>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span className="text-risk-low">Low</span>
          <span className="text-risk-moderate">Moderate</span>
          <span className="text-risk-high">High</span>
          <span className="text-risk-very-high">Very High</span>
        </div>
      </div>
    </div>
  );
}
