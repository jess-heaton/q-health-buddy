import { ChevronUp } from "lucide-react";

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
          className="p-4 rounded-xl shadow-sm border border-gray-300 bg-white"
        >
          <div className="space-y-3 text-xs font-light text-gray-700">
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1 rounded font-medium text-gray-700 border border-gray-300 bg-gray-50"
              >
                SPACE
              </span>
              <span>Start / Stop recording</span>
            </div>
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1 rounded font-medium text-gray-700 border border-gray-300 bg-gray-50"
              >
                /
              </span>
              <span>Show question prompts</span>
            </div>
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-1 rounded font-medium text-gray-700 border border-gray-300 bg-gray-50"
              >
                M
              </span>
              <span>View calculators</span>
            </div>
          </div>
          
          {/* Recording Status */}
          {isListening && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{backgroundColor: '#efeb7f'}}
              ></div>
              <span className="text-xs font-light text-gray-600">
                Recording...
              </span>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={onToggle}
            className="mt-3 w-full py-1.5 rounded-lg transition-colors text-xs font-light bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          >
            Hide <ChevronUp className="w-3 h-3 inline ml-1" />
          </button>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="p-3 rounded-full shadow-sm border border-gray-300 bg-white transition-all hover:shadow-md text-gray-700"
          title="Show keyboard shortcuts"
        >
          <span className="text-xs font-light">?</span>
        </button>
      )}
    </div>
  );
}
