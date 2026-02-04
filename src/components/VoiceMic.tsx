import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Add gentle pulse animation
const pulseStyle = `
  @keyframes gentlePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseStyle;
  document.head.appendChild(style);
}

export interface ExtractedVariables {
  age?: number | null;
  sex?: "male" | "female" | null;
  weight?: number | null;
  height?: number | null;
  ethnicity?: number | null;
  smoking?: number | null;
  familyHistoryDiabetes?: boolean | null;
  cardiovascularDisease?: boolean | null;
  treatedHypertension?: boolean | null;
  learningDisabilities?: boolean | null;
  mentalIllness?: boolean | null;
  corticosteroids?: boolean | null;
  statins?: boolean | null;
  atypicalAntipsychotics?: boolean | null;
  polycysticOvaries?: boolean | null;
  gestationalDiabetes?: boolean | null;
  fastingBloodGlucose?: number | null;
  hba1c?: number | null;
  townsendScore?: number | null;
}

interface VoiceMicProps {
  onVariablesExtracted: (variables: ExtractedVariables) => void;
  onListeningChange?: (isListening: boolean) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export const VoiceMic = forwardRef(function VoiceMicComponent({ onVariablesExtracted, onListeningChange, onTranscriptUpdate, onDoneListening }: VoiceMicProps & { onDoneListening?: () => void }, ref) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const { toast } = useToast();
  
  // Expose toggleListening via ref
  useImperativeHandle(ref, () => ({
    toggleRecording: () => {
      // Will be set below once toggleListening is defined
    }
  }));
  
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptBufferRef = useRef("");
  const extractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const extractVariables = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    console.log("Extracting variables from:", text);
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-variables', {
        body: { transcript: text }
      });

      if (error) {
        console.error("Extraction error:", error);
        throw error;
      }

      if (data?.variables) {
        console.log("Extracted variables:", data.variables);
        onVariablesExtracted(data.variables);
      }
    } catch (error) {
      console.error("Failed to extract variables:", error);
      toast({
        title: "Extraction failed",
        description: "Could not extract variables from speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onVariablesExtracted, toast]);

  const extractAndDone = useCallback(async (onDoneListening?: () => void) => {
    if (!transcriptBufferRef.current.trim()) {
      if (onDoneListening) onDoneListening();
      return;
    }
    
    setIsProcessing(true);
    const text = transcriptBufferRef.current.trim();
    console.log("Extracting variables from:", text);
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-variables', {
        body: { transcript: text }
      });

      if (error) {
        console.error("Extraction error:", error);
        throw error;
      }

      if (data?.variables) {
        console.log("Extracted variables:", data.variables);
        onVariablesExtracted(data.variables);
      }
    } catch (error) {
      console.error("Failed to extract variables:", error);
      toast({
        title: "Extraction failed",
        description: "Could not extract variables from speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      // NOW call onDoneListening after extraction is done
      if (onDoneListening) onDoneListening();
    }
  }, [onVariablesExtracted, toast]);



  const updatePulseIntensity = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setPulseIntensity(Math.min(average / 128, 1));
    
    if (isListening) {
      animationRef.current = requestAnimationFrame(updatePulseIntensity);
    }
  }, [isListening]);

  const startListening = async () => {
    try {
      console.log("Starting voice input...");
      
      const DG_KEY = "80a82d82e55093891aa08e6c09ded43f86ecb22d";

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio analyser for visual feedback
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en",
        ["token", DG_KEY]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Deepgram WebSocket connected");
        recorder.start(250);
        setIsListening(true);
        onListeningChange?.(true);
        animationRef.current = requestAnimationFrame(updatePulseIntensity);
        
        recorder.ondataavailable = (e) => {
          if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
            socket.send(e.data);
          }
        };
      };

      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          const transcriptText = data.channel?.alternatives?.[0]?.transcript;
          
          if (transcriptText && data.is_final) {
            console.log("Transcript:", transcriptText);
            transcriptBufferRef.current += " " + transcriptText;
            const fullTranscript = transcriptBufferRef.current.trim();
            onTranscriptUpdate?.(fullTranscript);
          }
        } catch (e) {
          console.error("Error parsing Deepgram message:", e);
        }
      };

      socket.onerror = (error) => {
        console.error("Deepgram WebSocket error:", error);
        toast({
          title: "Connection error",
          description: "Voice recognition connection failed.",
          variant: "destructive",
        });
        stopListening();
      };

      socket.onclose = () => {
        console.log("Deepgram WebSocket closed");
      };

    } catch (error) {
      console.error("Failed to start listening:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      setIsListening(false);
      onListeningChange?.(false);
    }
  };

  const stopListening = useCallback(() => {
    console.log("Stopping voice input...");
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;

    if (socketRef.current) {
      socketRef.current.close();
    }
    socketRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;

    analyserRef.current = null;
    setPulseIntensity(0);
    setIsListening(false);
    onListeningChange?.(false);
  }, [onListeningChange]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      transcriptBufferRef.current = "";
      startListening();
    }
  };

  // Update the ref with toggleListening function
  useEffect(() => {
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current = { toggleRecording: toggleListening };
    }
  }, [isListening]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mic Button - Much Larger & Professional */}
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={cn(
          "relative w-64 h-64 rounded-full transition-all duration-300",
          "flex items-center justify-center",
          "shadow-2xl",
          "hover:shadow-3xl hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-4 focus:ring-purple-300",
          isProcessing && "opacity-70 cursor-not-allowed"
        )}
        style={{
          backgroundColor: '#fbf583',
          boxShadow: isListening 
            ? `0 0 ${40 + pulseIntensity * 60}px ${10 + pulseIntensity * 20}px rgba(251, 245, 131, ${0.3 + pulseIntensity * 0.2})`
            : "0 20px 50px rgba(0, 0, 0, 0.15)",
          animation: !isProcessing ? `gentlePulse ${isListening ? '1.5s' : '3s'} ease-in-out infinite` : 'none'
        }}
      >
        {/* Outer ring pulse */}
        {isListening && (
          <>
            <span 
              className="absolute inset-0 rounded-full bg-yellow-300/20 animate-ping"
              style={{ animationDuration: "1.5s" }}
            />
            <span 
              className="absolute inset-[-12px] rounded-full border-2 border-yellow-300/30 animate-ping"
              style={{ animationDuration: "2s" }}
            />
          </>
        )}
        
        {/* Icon */}
        {isProcessing ? (
          <Loader2 className="w-24 h-24 text-gray-900 animate-spin" />
        ) : (
          <Mic className={cn(
            "w-24 h-24 text-gray-900 transition-transform",
            isListening && "scale-110"
          )} />
        )}
      </button>

      {/* Status text - Professional & Clear */}
      <div className="text-center space-y-4 mt-8">
        {isProcessing ? (
          <p className="text-2xl font-light text-gray-900">Processing audio...</p>
        ) : isListening ? (
          <>
            <p className="text-2xl font-light text-gray-900">Listening...</p>
            <p className="text-base text-gray-600 max-w-md font-light leading-relaxed">
              Describe the patient: age, sex, height, weight, smoking status, medical history...
            </p>
            {/* Done Listening Button */}
            <button
              className="mt-6 px-8 py-3 rounded-full text-gray-900 font-medium text-base transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#fbf583' }}
              onClick={() => {
                stopListening();
                extractAndDone(onDoneListening);
              }}
              disabled={isProcessing}
            >
              Done Listening
            </button>
          </>
        ) : (
          <>
            <p className="text-2xl font-light text-gray-900">Tap to speak</p>
            <p className="text-base text-gray-600 max-w-md font-light leading-relaxed">
              Describe the patient: age, sex, height, weight, smoking status, medical history...
            </p>
          </>
        )}
      </div>
    </div>
  );
});
