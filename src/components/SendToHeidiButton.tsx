import { ArrowRight } from "lucide-react";

interface SendToHeidiButtonProps {
  className?: string;
}

export function SendToHeidiButton({ className }: SendToHeidiButtonProps) {
  return (
    <button
      onClick={() => {}}
      className={`group flex items-center gap-2.5 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${className || ''}`}
      style={{backgroundColor: '#fbf583', color: '#28030f'}}
    >
      <span className="text-sm font-medium tracking-wide" style={{color: '#28030f'}}>
        Send to Heidi
      </span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" style={{color: '#28030f'}} />
    </button>
  );
}
