import { X } from "lucide-react";
import { useEffect } from "react";

interface PromptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromptOverlay({ isOpen, onClose }: PromptOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "/") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const prompts = [
    { category: "Demographics", items: ["Age", "Sex/Gender"] },
    { category: "Physical", items: ["Height", "Weight", "BMI"] },
    { category: "Medical History", items: ["Cardiovascular disease", "Hypertension (treated)", "Learning disabilities", "Mental illness"] },
    { category: "Medications", items: ["Corticosteroids", "Statins", "Antipsychotics"] },
    { category: "Family & Lifestyle", items: ["Family history of diabetes", "Smoking status", "Ethnicity"] },
    { category: "Laboratory", items: ["Fasting blood glucose", "HbA1c"] },
    { category: "Women Only", items: ["PCOS", "Gestational diabetes"] },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 backdrop-blur-sm"
      style={{backgroundColor: 'rgba(40, 3, 15, 0.15)'}}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border"
        style={{borderColor: '#e8dce5'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-8 py-6 border-b" style={{borderColor: '#e8dce5', backgroundColor: '#fcfaf8'}}>
          <div>
            <h2 className="text-2xl font-light tracking-tight" style={{color: '#28030f'}}>
              What We'll Ask
            </h2>
            <p className="text-xs font-light mt-1" style={{color: '#665073'}}>
              Speak naturally about these topics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{color: '#665073'}}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {prompts.map((section) => (
            <div key={section.category}>
              <h3 
                className="text-sm font-light mb-4 uppercase tracking-wider"
                style={{color: '#c23a6a'}}
              >
                {section.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-xl border transition-all hover:shadow-md"
                    style={{
                      borderColor: '#e8dce5',
                      backgroundColor: '#f9f7fa',
                      color: '#665073'
                    }}
                  >
                    <p className="text-sm font-light">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-8 py-6 border-t" style={{borderColor: '#e8dce5', backgroundColor: '#fcfaf8'}}>
          <p className="text-xs font-light text-center" style={{color: '#665073'}}>
            Press <span className="px-2 py-1 rounded bg-gray-100" style={{color: '#28030f'}}>ESC</span> or <span className="px-2 py-1 rounded bg-gray-100" style={{color: '#28030f'}}>/</span> to close
          </p>
        </div>
      </div>
    </div>
  );
}
