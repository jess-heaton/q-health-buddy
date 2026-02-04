import { QDiabetesInput } from "@/lib/qdiabetes";
import { Button } from "@/components/ui/button";

interface FactorBreakdownProps {
  formData: Partial<QDiabetesInput>;
  onViewResult?: () => void;
  onViewProjection?: () => void;
  bmi?: number;
}

export function FactorBreakdown({ formData, onViewResult, onViewProjection, bmi }: FactorBreakdownProps) {
  // Define risk factors with their descriptions and impact
  const factors = [
    {
      name: "Age",
      value: formData.age ? `${formData.age} years` : "N/A",
      impact: formData.age ? (formData.age > 45 ? "high" : "moderate") : "none",
      description: "Older age increases diabetes risk"
    },
    {
      name: "BMI",
      value: bmi ? `${bmi.toFixed(1)}` : "N/A",
      impact: bmi && bmi > 30 ? "high" : (bmi && bmi > 25 ? "moderate" : "low"),
      description: "Body Mass Index is a key risk factor"
    },
    {
      name: "Smoking",
      value: formData.smoking ? (formData.smoking > 1 ? "Active" : "Former") : "Never",
      impact: formData.smoking ? (formData.smoking > 1 ? "high" : "moderate") : "low",
      description: "Smoking status affects diabetes risk"
    },
    {
      name: "Family History",
      value: formData.familyHistoryDiabetes ? "Yes" : "No",
      impact: formData.familyHistoryDiabetes ? "high" : "low",
      description: "Family history is a strong predictor"
    },
    {
      name: "Cardiovascular Disease",
      value: formData.cardiovascularDisease ? "Yes" : "No",
      impact: formData.cardiovascularDisease ? "high" : "low",
      description: "CVD indicates increased metabolic risk"
    },
    {
      name: "Hypertension",
      value: formData.treatedHypertension ? "Yes" : "No",
      impact: formData.treatedHypertension ? "moderate" : "low",
      description: "High blood pressure increases risk"
    },
  ];

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case "high": return "bg-rose-50 text-rose-700";
      case "moderate": return "bg-amber-50 text-amber-700";
      case "low": return "bg-emerald-50 text-emerald-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch(impact) {
      case "high": return "bg-rose-100 text-rose-800";
      case "moderate": return "bg-amber-100 text-amber-800";
      case "low": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full py-12 px-0" style={{ background: '#f9f4f1' }}>
      <div className="max-w-6xl mx-auto flex flex-row items-stretch gap-0 min-h-[420px]">
        {/* Left half: Navigation, Score, Projection, etc. */}
        <div className="flex flex-col justify-center items-center flex-1 px-10 py-12">
          <div className="mb-8 w-full">
            <div className="grid grid-cols-3 gap-4 w-full mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewResult?.();
                }}
                className="text-base font-semibold"
              >
                Score
              </Button>
              <Button
                size="lg"
                disabled
                onClick={(e) => e.stopPropagation()}
                className="text-base font-semibold bg-[#28030f] text-white"
              >
                Factors
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProjection?.();
                }}
                className="text-base font-semibold"
              >
                Projection
              </Button>
            </div>
            <div className="text-center text-sm px-4 py-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 w-full mb-4">
              <p className="text-gray-700 font-medium">💡 Insight</p>
              <p className="text-gray-600 mt-1 text-sm">Small changes to high-impact factors can significantly reduce your risk</p>
            </div>
            <div className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <span>↻</span>
              <span>Tap to view other metrics</span>
            </div>
          </div>
        </div>
        {/* Right half: Factors/results in white box */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-10 w-full max-w-xl min-h-[340px]">
            <div className="text-2xl font-bold mb-6 text-gray-800 text-center">Risk Factors</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {factors.map((factor, idx) => (
                <div key={idx} className={`p-6 rounded-xl border border-gray-200 transition-all hover:shadow-md ${getImpactColor(factor.impact)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-lg" style={{color: '#28030f'}}>{factor.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactBadgeColor(factor.impact)}`}>
                      {factor.impact === "high" ? "High Impact" : factor.impact === "moderate" ? "Moderate" : "Low Impact"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base font-semibold mb-1">{factor.value}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
