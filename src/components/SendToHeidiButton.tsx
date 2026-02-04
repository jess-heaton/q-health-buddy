import { ArrowRight } from "lucide-react";

export function SendToHeidiButton() {
  return (
    <button
      onClick={() => {}}
      className="fixed bottom-8 right-8 group flex items-center gap-2 px-7 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
      style={{backgroundColor: '#fbf582', color: '#28030f'}}
    >
      <span className="text-base font-medium" style={{fontFamily: 'Georgia, serif', color: '#28030f'}}>
        Send to Heidi
      </span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{color: '#28030f'}} />
    </button>
  );
}
