import { X, Lock } from "lucide-react";
import { useEffect } from "react";

interface CalculatorOption {
  name: string;
  description: string;
  icon: string;
  status: "coming-soon" | "available";
}

interface CalculatorsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorsMenu({ isOpen, onClose }: CalculatorsMenuProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const calculators: CalculatorOption[] = [
    {
      name: "QDiabetes",
      description: "Type 2 Diabetes risk assessment",
      icon: "🩺",
      status: "available",
    },
    {
      name: "QRISK3",
      description: "Cardiovascular disease risk",
      icon: "❤️",
      status: "coming-soon",
    },
    {
      name: "FRAX",
      description: "Fracture risk assessment tool",
      icon: "🦴",
      status: "coming-soon",
    },
    {
      name: "HAS-BLED",
      description: "Bleeding risk in atrial fibrillation",
      icon: "🔴",
      status: "coming-soon",
    },
    {
      name: "CHADS₂-VASc",
      description: "Stroke risk assessment",
      icon: "🧠",
      status: "coming-soon",
    },
    {
      name: "CKD-EPI",
      description: "Kidney function & GFR estimation",
      icon: "🫘",
      status: "coming-soon",
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-sm"
      style={{backgroundColor: 'rgba(40, 3, 15, 0.2)'}}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border"
        style={{borderColor: '#e8dce5'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-8 py-6 border-b" style={{borderColor: '#e8dce5', backgroundColor: '#f9f4f1'}}>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{color: '#665073'}}>
              Assessment Tools
            </p>
            <h2 className="text-2xl font-normal tracking-tight" style={{color: '#28030f'}}>
              <span className="italic">Clinical Calculators</span>
            </h2>
            <p className="text-sm font-light mt-2" style={{color: '#665073'}}>
              Evidence-based tools for primary care
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl transition-colors"
            style={{color: '#665073', backgroundColor: '#f5e6f0'}}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {calculators.map((calc) => (
              <div
                key={calc.name}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  calc.status === "available" 
                    ? "cursor-pointer hover:shadow-md hover:border-opacity-100" 
                    : "opacity-75"
                }`}
                style={{
                  borderColor: calc.status === "available" ? '#665073' : '#e8dce5',
                  backgroundColor: calc.status === "available" ? '#faf7fc' : '#fafafa'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{calc.icon}</span>
                  {calc.status === "coming-soon" && (
                    <div 
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-light"
                      style={{backgroundColor: '#f5e6f0', color: '#665073'}}
                    >
                      <Lock className="w-3 h-3" />
                      Coming Soon
                    </div>
                  )}
                  {calc.status === "available" && (
                    <div 
                      className="px-2.5 py-1 rounded-full text-xs font-light text-white"
                      style={{backgroundColor: '#665073'}}
                    >
                      Active
                    </div>
                  )}
                </div>
                <h3 
                  className="text-lg font-light mb-2 tracking-tight"
                  style={{color: '#28030f'}}
                >
                  {calc.name}
                </h3>
                <p 
                  className="text-sm font-light"
                  style={{color: '#665073'}}
                >
                  {calc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-8 py-5 border-t" style={{borderColor: '#e8dce5', backgroundColor: '#f9f4f1'}}>
          <p className="text-xs font-light text-center" style={{color: '#665073'}}>
            Press <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{backgroundColor: '#f5e6f0', color: '#28030f'}}>M</span> or <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{backgroundColor: '#f5e6f0', color: '#28030f'}}>ESC</span> to close
          </p>
        </div>
      </div>
    </div>
  );
}
