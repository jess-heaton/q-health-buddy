import { ChevronUp, Keyboard } from "lucide-react";

interface KeyboardHintsProps {
  isVisible: boolean;
  onToggle: () => void;
  isListening?: boolean;
}

export function KeyboardHints({ isVisible, onToggle, isListening }: KeyboardHintsProps) {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      {isVisible ? (
        <div 
          className="p-5 rounded-2xl shadow-sm border"
          style={{ backgroundColor: '#fcfaf8', borderColor: '#e8dce5' }}
        >
          <div className="space-y-3 text-xs font-light" style={{ color: '#665073' }}>
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1.5 rounded-lg font-medium text-xs"
                style={{ backgroundColor: '#fbf583', color: '#28030f' }}
              >
                SPACE
              </span>
              <span>Start / Stop recording</span>
            </div>
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1.5 rounded-lg font-medium text-xs"
                style={{ backgroundColor: '#f5e6f0', color: '#28030f' }}
              >
                /
              </span>
              <span>View question prompts</span>
            </div>
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1.5 rounded-lg font-medium text-xs"
                style={{ backgroundColor: '#f5e6f0', color: '#28030f' }}
              >
                M
              </span>
              <span>Browse calculators</span>
            </div>
          </div>
          
          {/* Recording Status */}
          {isListening && (
            <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: '#e8dce5' }}>
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{backgroundColor: '#fbf583'}}
              ></div>
              <span className="text-xs font-light" style={{ color: '#665073' }}>
                Recording...
              </span>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={onToggle}
            className="mt-4 w-full py-2 rounded-lg transition-colors text-xs font-light"
            style={{ backgroundColor: '#f5e6f0', color: '#665073' }}
          >
            Hide <ChevronUp className="w-3 h-3 inline ml-1" />
          </button>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="p-3 rounded-xl shadow-sm border transition-all hover:shadow-md"
          style={{ backgroundColor: '#fcfaf8', borderColor: '#e8dce5', color: '#665073' }}
          title="Show keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
