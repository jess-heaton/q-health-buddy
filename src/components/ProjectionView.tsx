import { QDiabetesInput, QDiabetesResult, calculateQDiabetesRisk } from "@/lib/qdiabetes";
import { TrendingDown, AlertCircle } from "lucide-react";

interface ProjectionViewProps {
  formData: Partial<QDiabetesInput>;
  currentResult: QDiabetesResult;
  bmi?: number;
}

export function ProjectionView({ formData, currentResult, bmi }: ProjectionViewProps) {
  // Calculate projected result with reduced factors
  const calculateProjection = () => {
    const improved: QDiabetesInput = {
      age: formData.age || 50,
      sex: (formData.sex || 'male') as 'male' | 'female',
      ethnicity: formData.ethnicity || 1,
      smoking: 0,
      bmi: Math.min(bmi || 25, 25),
      familyHistoryDiabetes: formData.familyHistoryDiabetes || false,
      cardiovascularDisease: formData.cardiovascularDisease || false,
      treatedHypertension: false,
      learningDisabilities: formData.learningDisabilities || false,
      mentalIllness: formData.mentalIllness || false,
      corticosteroids: formData.corticosteroids || false,
      statins: formData.statins || false,
      atypicalAntipsychotics: formData.atypicalAntipsychotics || false,
      polycysticOvaries: formData.polycysticOvaries,
      gestationalDiabetes: formData.gestationalDiabetes,
      fastingBloodGlucose: formData.fastingBloodGlucose 
        ? Math.min(formData.fastingBloodGlucose, 5.9)
        : undefined,
      hba1c: formData.hba1c 
        ? Math.min(formData.hba1c, 5.6)
        : undefined,
      townsendScore: formData.townsendScore || 0,
    };

    return calculateQDiabetesRisk(improved);
  };

  const projectedResult = calculateProjection();
  const riskReduction = currentResult.riskPercentage - projectedResult.riskPercentage;
  const percentageImprovement = ((riskReduction / currentResult.riskPercentage) * 100).toFixed(0);

  // Determine which factors were improved
  const improvements = [];
  if ((formData.smoking || 0) > 0) {
    improvements.push("Quit smoking");
  }
  if ((bmi || 25) > 25) {
    improvements.push(`Reduce BMI to 25`);
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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#665073' }}>
          Lifestyle Impact
        </p>
        <h3 className="text-xl font-light" style={{ color: '#28030f' }}>
          Risk Projection
        </h3>
      </div>

      {/* Risk Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs">
        <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
          <p className="text-xs font-light mb-1" style={{ color: '#665073' }}>Current</p>
          <div className="text-3xl font-light" style={{ color: '#28030f' }}>
            {currentResult.riskPercentage.toFixed(1)}
            <span className="text-sm" style={{ color: '#8a7a9a' }}>%</span>
          </div>
        </div>
        <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs font-light mb-1 text-emerald-700">Potential</p>
          <div className="text-3xl font-light text-emerald-600">
            {projectedResult.riskPercentage.toFixed(1)}
            <span className="text-sm text-emerald-400">%</span>
          </div>
        </div>
      </div>

      {/* Improvement Badge */}
      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 w-full max-w-xs text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span className="text-lg font-medium text-emerald-700">{percentageImprovement}% reduction</span>
        </div>
        <p className="text-sm text-emerald-600">
          Risk could drop by {riskReduction.toFixed(2)}%
        </p>
      </div>

      {/* Improvements List */}
      {improvements.length > 0 ? (
        <div className="w-full max-w-xs">
          <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: '#665073' }}>
            By making these changes:
          </p>
          <div className="space-y-2">
            {improvements.map((improvement, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  ✓
                </div>
                <p className="text-sm font-light" style={{ color: '#28030f' }}>{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs p-3 bg-blue-50 rounded-lg border border-blue-200 flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 font-light">Your current factors are already well-managed!</p>
        </div>
      )}

      {/* Footer Note */}
      <p className="text-xs font-light text-center mt-6" style={{ color: '#8a7a9a' }}>
        These projections are estimates based on lifestyle improvements
      </p>
    </div>
  );
}
