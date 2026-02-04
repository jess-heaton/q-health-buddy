import { QDiabetesInput } from "@/lib/qdiabetes";

interface FactorBreakdownProps {
  formData: Partial<QDiabetesInput>;
  bmi?: number;
}

export function FactorBreakdown({ formData, bmi }: FactorBreakdownProps) {
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
      name: "CVD",
      value: formData.cardiovascularDisease ? "Yes" : "No",
      impact: formData.cardiovascularDisease ? "high" : "low",
      description: "Cardiovascular disease increases risk"
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
      case "high": return "bg-rose-50 border-rose-200";
      case "moderate": return "bg-amber-50 border-amber-200";
      case "low": return "bg-emerald-50 border-emerald-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch(impact) {
      case "high": return "bg-rose-100 text-rose-700";
      case "moderate": return "bg-amber-100 text-amber-700";
      case "low": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#665073' }}>
          Contributing Factors
        </p>
        <h3 className="text-xl font-light" style={{ color: '#28030f' }}>
          Risk Factor Analysis
        </h3>
      </div>

      {/* Factors Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {factors.map((factor, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border transition-all hover:shadow-sm ${getImpactColor(factor.impact)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm" style={{ color: '#28030f' }}>{factor.name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImpactBadgeColor(factor.impact)}`}>
                {factor.impact === "high" ? "High" : factor.impact === "moderate" ? "Med" : "Low"}
              </span>
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: '#28030f' }}>{factor.value}</p>
            <p className="text-xs font-light leading-relaxed" style={{ color: '#665073' }}>{factor.description}</p>
          </div>
        ))}
      </div>

      {/* Insight Box */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <p className="text-sm font-light text-center" style={{ color: '#28030f' }}>
          💡 Small changes to high-impact factors can significantly reduce your risk
        </p>
      </div>
    </div>
  );
}
