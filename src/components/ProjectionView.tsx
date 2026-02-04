import { QDiabetesInput, QDiabetesResult, calculateQDiabetesRisk } from "@/lib/qdiabetes";
import { Button } from "@/components/ui/button";
import { TrendingDown, AlertCircle } from "lucide-react";

interface ProjectionViewProps {
  formData: Partial<QDiabetesInput>;
  currentResult: QDiabetesResult;
  bmi?: number;
  onViewScore?: () => void;
  onViewFactors?: () => void;
}

export function ProjectionView({ formData, currentResult, bmi, onViewScore, onViewFactors }: ProjectionViewProps) {
  // Calculate projected result with reduced factors
  const calculateProjection = () => {
    // Create improved formData with reduced high-impact factors
    const improved: QDiabetesInput = {
      age: formData.age || 50,
      sex: (formData.sex || 'male') as 'male' | 'female',
      ethnicity: formData.ethnicity || 1, // NOT changed - not reducible
      smoking: 0, // Assume quit smoking (best case)
      bmi: Math.min(bmi || 25, 25), // Reduce to healthy BMI (< 25)
      familyHistoryDiabetes: formData.familyHistoryDiabetes || false, // NOT changed - not reducible
      cardiovascularDisease: formData.cardiovascularDisease || false, // NOT easily changed but kept for calculation
      treatedHypertension: false, // Assume controlled/managed
      learningDisabilities: formData.learningDisabilities || false,
      mentalIllness: formData.mentalIllness || false,
      corticosteroids: formData.corticosteroids || false, // Can reduce if possible
      statins: formData.statins || false, // May continue but not primary factor
      atypicalAntipsychotics: formData.atypicalAntipsychotics || false,
      polycysticOvaries: formData.polycysticOvaries,
      gestationalDiabetes: formData.gestationalDiabetes,
      fastingBloodGlucose: formData.fastingBloodGlucose 
        ? Math.min(formData.fastingBloodGlucose, 5.9) // Improve to normal range
        : undefined,
      hba1c: formData.hba1c 
        ? Math.min(formData.hba1c, 5.6) // Improve to normal range
        : undefined,
      townsendScore: formData.townsendScore || 0,
    };

    return calculateQDiabetesRisk(improved);
  };

  const projectedResult = calculateProjection();
  const riskReduction = currentResult.riskPercentage - projectedResult.riskPercentage;
  const percentageImprovement = ((riskReduction / currentResult.riskPercentage) * 100).toFixed(1);

  // Determine which factors were improved
  const improvements = [];
  if ((formData.smoking || 0) > 0) {
    improvements.push("Quit smoking");
  }
  if ((bmi || 25) > 25) {
    improvements.push(`Reduce BMI to 25 (from ${bmi?.toFixed(1)})`);
  }
  if (formData.treatedHypertension) {
    improvements.push("Manage hypertension");
  }
  if (formData.fastingBloodGlucose && formData.fastingBloodGlucose > 5.9) {
    improvements.push("Improve fasting glucose");
  }
  if (formData.hba1c && formData.hba1c > 5.6) {
    improvements.push("Improve HbA1c");
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8 w-full">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-light mb-2">Lifestyle Impact</p>
        <h2 className="text-3xl sm:text-4xl font-light text-[#1a1a1a]">Risk Projection</h2>
      </div>

      {/* Risk Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-sm">
        {/* Current Risk */}
        <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-light">Current</p>
          <div className="text-4xl font-light text-[#3D2D47]">
            {currentResult.riskPercentage.toFixed(1)}<span className="text-lg text-gray-400">%</span>
          </div>
        </div>

        {/* Projected Risk */}
        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs text-green-700 mb-2 font-light">Potential</p>
          <div className="text-4xl font-light text-green-600">
            {projectedResult.riskPercentage.toFixed(1)}<span className="text-lg text-green-400">%</span>
          </div>
        </div>
      </div>

      {/* Improvement Badge */}
      <div className="mb-8 p-5 rounded-lg bg-emerald-50 border border-emerald-200 w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <TrendingDown className="w-5 h-5 text-emerald-600" />
          <span className="text-lg font-light text-emerald-700">
            {percentageImprovement}% reduction</span>
        </div>
        <p className="text-sm text-emerald-600 text-center">
          Risk could drop by {riskReduction.toFixed(2)}%
        </p>
      </div>

      {/* Improvements List */}
      {improvements.length > 0 ? (
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs font-semibold text-[#6B5B7F] mb-3 uppercase tracking-wide">By making these changes:</p>
          <div className="space-y-2">
            {improvements.map((improvement, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="w-5 h-5 rounded-full bg-[#FFDA1A] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#3D2D47] mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-[#4A4A4A]">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">Your current factors are already well-managed!</p>
        </div>
      )}

      {/* Navigation and Footer */}
      <div className="mt-auto flex flex-col gap-3 w-full max-w-xs">
        {/* View switcher */}
        <div className="grid grid-cols-3 gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewScore?.();
            }}
            className="text-xs"
          >
            Score
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewFactors?.();
            }}
            className="text-xs"
          >
            Factors
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled
            onClick={(e) => e.stopPropagation()}
            className="text-xs"
          >
            Projection
          </Button>
        </div>

        {/* Tip */}
        <div className="text-center text-xs text-[#8B7BA8]">
          <p>These projections are estimates based on lifestyle improvements</p>
        </div>

        {/* Tap to flip hint */}
        <div className="text-xs text-[#8B7BA8] flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Tap to edit your details</span>
        </div>
      </div>
    </div>
  );
}
