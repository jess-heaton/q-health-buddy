import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

interface HeidiPromoOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSendToHeidi: () => void;
}

export function HeidiPromoOverlay({ isVisible, onDismiss, onSendToHeidi }: HeidiPromoOverlayProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      onDismiss();
    }, 300);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isVisible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "rgba(40, 3, 15, 0.25)", backdropFilter: "blur(6px)" }}
      onClick={handleDismiss}
    >
      <div
        className={`relative max-w-md w-full mx-6 rounded-2xl p-8 text-center transition-all duration-300 ${
          isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          backgroundColor: "#faf7fc",
          border: "1px solid rgba(102, 80, 115, 0.2)",
          boxShadow: "0 25px 60px -12px rgba(102, 80, 115, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/60"
          style={{ color: "#665073" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon / visual element */}
        <div
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ backgroundColor: "rgba(102, 80, 115, 0.1)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4" stroke="#665073" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" stroke="#665073" strokeWidth="2"/>
          </svg>
        </div>

        {/* Heading */}
        <h3
          className="text-xl font-semibold mb-2"
          style={{
            color: "#28030f",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
          }}
        >
          Save this to your notes?
        </h3>

        {/* Description */}
        <p
          className="text-sm font-light leading-relaxed mb-6"
          style={{ color: "#665073" }}
        >
          Automatically add this assessment to your consultation notes with a full conversation summary.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {
            onSendToHeidi();
            handleDismiss();
          }}
          className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: "#fbf583", color: "#28030f" }}
        >
          <span className="text-base font-medium tracking-wide" style={{ color: "#28030f" }}>
            Send to Heidi
          </span>
          <ArrowRight
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
            style={{ color: "#28030f" }}
          />
        </button>

        {/* Dismiss text */}
        <button
          onClick={handleDismiss}
          className="mt-4 text-xs font-light transition-colors"
          style={{ color: "#998a9e" }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
