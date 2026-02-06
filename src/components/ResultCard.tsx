import { QDiabetesInput, QDiabetesResult } from "@/lib/qdiabetes";
import { cn } from "@/lib/utils";

type ResultView = "score" | "factors" | "projection";

interface ResultCardProps {
  result: QDiabetesResult;
  formData: Partial<QDiabetesInput>;
  bmi?: number;
  currentView: ResultView;
  onViewChange: (view: ResultView) => void;
  children: React.ReactNode;
}

export function ResultCard({
  result,
  formData,
  bmi,
  currentView,
  onViewChange,
  children,
}: ResultCardProps) {
  const getViewTitle = () => {
    switch (currentView) {
      case "score":
        return "Your Risk Score";
      case "factors":
        return "Risk Factors";
      case "projection":
        return "Future Projection";
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case "score":
        return "Evidence-based assessment using the validated QDiabetes-2018 algorithm, trusted by clinicians across the UK.";
      case "factors":
        return "Understanding which factors contribute most to your risk can help identify the most impactful lifestyle changes.";
      case "projection":
        return "See how modifiable risk factors could reduce your future diabetes risk with targeted interventions.";
    }
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 rounded-2xl" style={{ background: '#f9f4f1' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-6 md:gap-10 min-h-[480px]">
        {/* Left Panel - Navigation & Context */}
        <div className="flex-1 flex flex-col justify-center py-8 md:py-12">
          {/* Eyebrow */}
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#665073' }}>
            QDiabetes Assessment
          </p>
          
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6 leading-tight" style={{ color: '#28030f' }}>
            <span className="italic">{getViewTitle()}</span>
          </h2>
          
          {/* Description */}
          <p className="text-base font-light leading-relaxed mb-8 max-w-md" style={{ color: '#665073' }}>
            {getViewDescription()}
          </p>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 mb-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewChange("score");
              }}
              className={cn(
                "text-sm transition-all",
                currentView === "score"
                  ? "font-semibold"
                  : "font-light opacity-70 hover:opacity-100"
              )}
              style={{ color: '#28030f' }}
            >
              Score
            </button>
            <span className="text-gray-300 mx-1">·</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewChange("factors");
              }}
              className={cn(
                "text-sm transition-all",
                currentView === "factors"
                  ? "font-semibold"
                  : "font-light opacity-70 hover:opacity-100"
              )}
              style={{ color: '#28030f' }}
            >
              Factors
            </button>
            <span className="text-gray-300 mx-1">·</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewChange("projection");
              }}
              className={cn(
                "text-sm transition-all",
                currentView === "projection"
                  ? "font-semibold"
                  : "font-light opacity-70 hover:opacity-100"
              )}
              style={{ color: '#28030f' }}
            >
              Projection
            </button>
          </nav>

          {/* Flip Hint */}
          <p className="text-xs font-light" style={{ color: '#8a7a9a' }}>
            ← Tap card to edit details
          </p>
        </div>

        {/* Right Panel - White Content Box */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
