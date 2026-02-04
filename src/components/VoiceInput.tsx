import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface VoiceInputProps {
  onVariablesExtracted: (variables: ExtractedVariables) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export function VoiceInput({ onVariablesExtracted, onTranscriptUpdate }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptBufferRef = useRef("");
  const extractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        toast({
          title: "Variables extracted",
          description: "Form fields have been updated from your voice input.",
        });
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

  const scheduleExtraction = useCallback(() => {
    // Clear any existing timeout
    if (extractionTimeoutRef.current) {
      clearTimeout(extractionTimeoutRef.current);
    }
    
    // Schedule extraction after 2 seconds of no new speech
    extractionTimeoutRef.current = setTimeout(() => {
      if (transcriptBufferRef.current.trim()) {
        extractVariables(transcriptBufferRef.current);
      }
    }, 2000);
  }, [extractVariables]);

  const startListening = async () => {
    try {
      console.log("Starting voice input...");
      
      // MVP: Direct Deepgram key
      const DG_KEY = "80a82d82e55093891aa08e6c09ded43f86ecb22d";

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      // Connect to Deepgram WebSocket
      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en",
        ["token", DG_KEY]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Deepgram WebSocket connected");
        recorder.start(250);
        setIsListening(true);
        
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
            setTranscript(fullTranscript);
            onTranscriptUpdate?.(fullTranscript);
            scheduleExtraction();
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
    }
  };

  const stopListening = useCallback(() => {
    console.log("Stopping voice input...");
    
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

    setIsListening(false);

    // Trigger final extraction if there's content
    if (transcriptBufferRef.current.trim()) {
      extractVariables(transcriptBufferRef.current);
    }
  }, [extractVariables]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      transcriptBufferRef.current = "";
      setTranscript("");
      startListening();
    }
  };

  const resetTranscript = () => {
    transcriptBufferRef.current = "";
    setTranscript("");
    onTranscriptUpdate?.("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="lg"
          onClick={toggleListening}
          disabled={isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Voice Input
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            Listening...
          </div>
        )}
      </div>

      {transcript && (
        <div className="p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Transcript</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetTranscript}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
}
