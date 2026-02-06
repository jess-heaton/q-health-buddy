import { useState, useCallback, useEffect, useRef } from "react";
import { VoiceMic, ExtractedVariables } from "@/components/VoiceMic";
import { RiskResult } from "@/components/RiskResult";
import { FactorBreakdown } from "@/components/FactorBreakdown";
import { ProjectionView } from "@/components/ProjectionView";
import { EditForm } from "@/components/EditForm";
import { ResultCard } from "@/components/ResultCard";
import { FlippableCard } from "@/components/FlippableCard";
import { SendToHeidiButton } from "@/components/SendToHeidiButton";
import { PromptOverlay } from "@/components/PromptOverlay";
import { KeyboardHints } from "@/components/KeyboardHints";
import { CalculatorsMenu } from "@/components/CalculatorsMenu";
import { HeidiPromoOverlay } from "@/components/HeidiPromoOverlay";
import { 
  calculateQDiabetesRisk, 
  QDiabetesInput, 
  QDiabetesResult 
} from "@/lib/qdiabetes";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewState = "mic" | "result";
type ResultView = "score" | "factors" | "projection";

export function QDiabetesCalculator() {
  const { toast } = useToast();
  const [viewState, setViewState] = useState<ViewState>("mic");
  const [resultView, setResultView] = useState<ResultView>("score");
  const [result, setResult] = useState<QDiabetesResult | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasShownMissingVarsError, setHasShownMissingVarsError] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [showCalculatorsMenu, setShowCalculatorsMenu] = useState(false);
  const [showHeidiPromo, setShowHeidiPromo] = useState(false);
  const [hasShownHeidiPromo, setHasShownHeidiPromo] = useState(false);
  const voiceMicRef = useRef<any>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<QDiabetesInput>>({
    age: undefined,
    sex: undefined,
    ethnicity: 1,
    smoking: 0,
    bmi: undefined,
    familyHistoryDiabetes: false,
    cardiovascularDisease: false,
    treatedHypertension: false,
    learningDisabilities: false,
    mentalIllness: false,
    corticosteroids: false,
    statins: false,
    atypicalAntipsychotics: false,
    polycysticOvaries: false,
    gestationalDiabetes: false,
    fastingBloodGlucose: undefined,
    hba1c: undefined,
    townsendScore: 0,
  });

  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  // Keyboard listener for / to show/hide prompts, spacebar for recording, M for menu toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewState === "mic") {
        if (e.key === "/" && !showCalculatorsMenu) {
          e.preventDefault();
          setShowPrompts(!showPrompts);
        } else if ((e.key === "m" || e.key === "M") && !showPrompts) {
          e.preventDefault();
          setShowCalculatorsMenu(!showCalculatorsMenu);
        } else if (e.code === "Space" && !showPrompts && !showCalculatorsMenu) {
          e.preventDefault();
          // Toggle recording via voiceMic ref
          if (voiceMicRef.current?.toggleRecording) {
            voiceMicRef.current.toggleRecording();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewState, showPrompts, showHints, showCalculatorsMenu]);

  // Show Heidi promo overlay once, 3 seconds after entering results
  useEffect(() => {
    if (viewState === "result" && !hasShownHeidiPromo) {
      const timer = setTimeout(() => {
        setShowHeidiPromo(true);
        setHasShownHeidiPromo(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [viewState, hasShownHeidiPromo]);

  const calculateBMI = useCallback(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return w / (h * h);
    }
    return undefined;
  }, [height, weight]);

  const calculateRisk = useCallback(() => {
    if (!formData.age || !formData.sex) return null;
    
    const bmi = calculateBMI() || 25;
    const input: QDiabetesInput = {
      ...formData,
      age: formData.age,
      sex: formData.sex,
      bmi,
      ethnicity: formData.ethnicity || 1,
      smoking: formData.smoking || 0,
      familyHistoryDiabetes: formData.familyHistoryDiabetes || false,
      cardiovascularDisease: formData.cardiovascularDisease || false,
      treatedHypertension: formData.treatedHypertension || false,
      learningDisabilities: formData.learningDisabilities || false,
      mentalIllness: formData.mentalIllness || false,
      corticosteroids: formData.corticosteroids || false,
      statins: formData.statins || false,
      atypicalAntipsychotics: formData.atypicalAntipsychotics || false,
      polycysticOvaries: formData.polycysticOvaries,
      gestationalDiabetes: formData.gestationalDiabetes,
      fastingBloodGlucose: formData.fastingBloodGlucose,
      hba1c: formData.hba1c,
      townsendScore: formData.townsendScore,
    };
    
    return calculateQDiabetesRisk(input);
  }, [formData, calculateBMI]);

  const handleVariablesExtracted = useCallback((variables: ExtractedVariables) => {
    console.log("Applying extracted variables:", variables);
    
    setFormData(prev => {
      const updated = { ...prev };
      
      if (variables.age != null) updated.age = variables.age;
      if (variables.sex != null) updated.sex = variables.sex;
      if (variables.ethnicity != null) updated.ethnicity = variables.ethnicity;
      if (variables.smoking != null) updated.smoking = variables.smoking;
      if (variables.familyHistoryDiabetes != null) updated.familyHistoryDiabetes = variables.familyHistoryDiabetes;
      if (variables.cardiovascularDisease != null) updated.cardiovascularDisease = variables.cardiovascularDisease;
      if (variables.treatedHypertension != null) updated.treatedHypertension = variables.treatedHypertension;
      if (variables.learningDisabilities != null) updated.learningDisabilities = variables.learningDisabilities;
      if (variables.mentalIllness != null) updated.mentalIllness = variables.mentalIllness;
      if (variables.corticosteroids != null) updated.corticosteroids = variables.corticosteroids;
      if (variables.statins != null) updated.statins = variables.statins;
      if (variables.atypicalAntipsychotics != null) updated.atypicalAntipsychotics = variables.atypicalAntipsychotics;
      if (variables.polycysticOvaries != null) updated.polycysticOvaries = variables.polycysticOvaries;
      if (variables.gestationalDiabetes != null) updated.gestationalDiabetes = variables.gestationalDiabetes;
      if (variables.fastingBloodGlucose != null) updated.fastingBloodGlucose = variables.fastingBloodGlucose;
      if (variables.hba1c != null) updated.hba1c = variables.hba1c;
      if (variables.townsendScore != null) updated.townsendScore = variables.townsendScore;
      
      return updated;
    });
    
    if (variables.height != null) setHeight(variables.height.toString());
    if (variables.weight != null) setWeight(variables.weight.toString());

    // Delay calculation to allow state to update
    setTimeout(() => {
      // We need to recalculate with the new values
      const newFormData = { ...formData };
      if (variables.age != null) newFormData.age = variables.age;
      if (variables.sex != null) newFormData.sex = variables.sex;
      if (variables.ethnicity != null) newFormData.ethnicity = variables.ethnicity;
      if (variables.smoking != null) newFormData.smoking = variables.smoking;
      if (variables.familyHistoryDiabetes != null) newFormData.familyHistoryDiabetes = variables.familyHistoryDiabetes;
      if (variables.cardiovascularDisease != null) newFormData.cardiovascularDisease = variables.cardiovascularDisease;
      if (variables.treatedHypertension != null) newFormData.treatedHypertension = variables.treatedHypertension;
      if (variables.learningDisabilities != null) newFormData.learningDisabilities = variables.learningDisabilities;
      if (variables.mentalIllness != null) newFormData.mentalIllness = variables.mentalIllness;
      if (variables.corticosteroids != null) newFormData.corticosteroids = variables.corticosteroids;
      if (variables.statins != null) newFormData.statins = variables.statins;
      if (variables.atypicalAntipsychotics != null) newFormData.atypicalAntipsychotics = variables.atypicalAntipsychotics;
      if (variables.polycysticOvaries != null) newFormData.polycysticOvaries = variables.polycysticOvaries;
      if (variables.gestationalDiabetes != null) newFormData.gestationalDiabetes = variables.gestationalDiabetes;
      if (variables.fastingBloodGlucose != null) newFormData.fastingBloodGlucose = variables.fastingBloodGlucose;
      if (variables.hba1c != null) newFormData.hba1c = variables.hba1c;
      if (variables.townsendScore != null) newFormData.townsendScore = variables.townsendScore;

      const newHeight = variables.height != null ? variables.height.toString() : height;
      const newWeight = variables.weight != null ? variables.weight.toString() : weight;
      
      const h = parseFloat(newHeight) / 100;
      const w = parseFloat(newWeight);
      const bmi = (h > 0 && w > 0) ? w / (h * h) : 25;

      if (newFormData.age && newFormData.sex) {
        const input: QDiabetesInput = {
          ...newFormData,
          age: newFormData.age,
          sex: newFormData.sex,
          bmi,
          ethnicity: newFormData.ethnicity || 1,
          smoking: newFormData.smoking || 0,
          familyHistoryDiabetes: newFormData.familyHistoryDiabetes || false,
          cardiovascularDisease: newFormData.cardiovascularDisease || false,
          treatedHypertension: newFormData.treatedHypertension || false,
          learningDisabilities: newFormData.learningDisabilities || false,
          mentalIllness: newFormData.mentalIllness || false,
          corticosteroids: newFormData.corticosteroids || false,
          statins: newFormData.statins || false,
          atypicalAntipsychotics: newFormData.atypicalAntipsychotics || false,
          polycysticOvaries: newFormData.polycysticOvaries,
          gestationalDiabetes: newFormData.gestationalDiabetes,
          fastingBloodGlucose: newFormData.fastingBloodGlucose,
          hba1c: newFormData.hba1c,
          townsendScore: newFormData.townsendScore,
        };
        
        const calculatedResult = calculateQDiabetesRisk(input);
        setResult(calculatedResult);
        setViewState("result");
      }
    }, 100);
  }, [formData, height, weight]);

  const updateFormData = <K extends keyof QDiabetesInput>(key: K, value: QDiabetesInput[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRecalculate = () => {
    const calculatedResult = calculateRisk();
    if (calculatedResult) {
      setResult(calculatedResult);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setViewState("mic");
    setResult(null);
    setIsFlipped(false);
    setTranscript("");
    setHasShownMissingVarsError(false);
    setFormData({
      age: undefined,
      sex: undefined,
      ethnicity: 1,
      smoking: 0,
      bmi: undefined,
      familyHistoryDiabetes: false,
      cardiovascularDisease: false,
      treatedHypertension: false,
      learningDisabilities: false,
      mentalIllness: false,
      corticosteroids: false,
      statins: false,
      atypicalAntipsychotics: false,
      polycysticOvaries: false,
      gestationalDiabetes: false,
      fastingBloodGlucose: undefined,
      hba1c: undefined,
      townsendScore: 0,
    });
    setHeight("");
    setWeight("");
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{backgroundColor: '#fcfaf8'}}>
      <PromptOverlay isOpen={showPrompts} onClose={() => setShowPrompts(false)} collectedData={{ formData, height, weight }} />
      {viewState === "mic" && <KeyboardHints isVisible={showHints} onToggle={() => setShowHints(!showHints)} isListening={isListening} />}
      <CalculatorsMenu isOpen={showCalculatorsMenu} onClose={() => setShowCalculatorsMenu(false)} />
      <HeidiPromoOverlay
        isVisible={showHeidiPromo}
        onDismiss={() => setShowHeidiPromo(false)}
        onSendToHeidi={() => {}}
      />
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-2">
        {viewState === "mic" ? (
          /* Voice-First Input Screen - Centered & Spacious */
          <div className="w-full max-w-2xl text-center space-y-8 flex flex-col items-center">
            <VoiceMic 
              ref={voiceMicRef}
              onVariablesExtracted={handleVariablesExtracted}
              onListeningChange={setIsListening}
              onTranscriptUpdate={setTranscript}
              onDoneListening={() => {
                console.log("Done Listening clicked - formData:", formData);
                const bmi = calculateBMI() || 25;
                if (formData.age && formData.sex) {
                  const input = {
                    ...formData,
                    age: formData.age,
                    sex: formData.sex,
                    bmi,
                    ethnicity: formData.ethnicity || 1,
                    smoking: formData.smoking || 0,
                    familyHistoryDiabetes: formData.familyHistoryDiabetes || false,
                    cardiovascularDisease: formData.cardiovascularDisease || false,
                    treatedHypertension: formData.treatedHypertension || false,
                    learningDisabilities: formData.learningDisabilities || false,
                    mentalIllness: formData.mentalIllness || false,
                    corticosteroids: formData.corticosteroids || false,
                    statins: formData.statins || false,
                    atypicalAntipsychotics: formData.atypicalAntipsychotics || false,
                    polycysticOvaries: formData.polycysticOvaries,
                    gestationalDiabetes: formData.gestationalDiabetes,
                    fastingBloodGlucose: formData.fastingBloodGlucose,
                    hba1c: formData.hba1c,
                    townsendScore: formData.townsendScore,
                  };
                  const calculatedResult = calculateQDiabetesRisk(input);
                  console.log("Calculated result:", calculatedResult);
                  setResult(calculatedResult);
                  setViewState("result");
                  setIsFlipped(false);
                  setHasShownMissingVarsError(false);
                } else if (!hasShownMissingVarsError) {
                  console.log("Missing age or sex - can't calculate");
                  setHasShownMissingVarsError(true);
                  toast({
                    title: "Missing Information",
                    description: "Please mention your age and sex (male/female) so we can calculate your risk.",
                    variant: "destructive",
                  });
                }
              }}
            />

            {/* Transcript Display - Only if speaking */}
            {transcript && (
              <div className="p-6 rounded-2xl text-left text-sm font-light animate-fade-in border border-gray-200 bg-gray-50 text-gray-700 w-full">
                <p className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wide">We heard:</p>
                {transcript}
              </div>
            )}

            {/* Skip Button for Testing */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const heightCm = 182;
                  const weightKg = 90;
                  const calculatedBmi = weightKg / ((heightCm / 100) ** 2);
                  const testData = {
                    age: 40,
                    sex: "male" as const,
                    ethnicity: 1,
                    smoking: 2, // moderate smoker
                    bmi: calculatedBmi,
                    familyHistoryDiabetes: false,
                    cardiovascularDisease: false,
                    treatedHypertension: true,
                    learningDisabilities: false,
                    mentalIllness: false,
                    corticosteroids: false,
                    statins: false,
                    atypicalAntipsychotics: false,
                    polycysticOvaries: false,
                    gestationalDiabetes: false,
                    fastingBloodGlucose: undefined,
                    hba1c: undefined,
                    townsendScore: 0,
                  };
                  setFormData(testData);
                  setHeight(heightCm.toString());
                  setWeight(weightKg.toString());
                  const calculatedResult = calculateQDiabetesRisk(testData);
                  setResult(calculatedResult);
                  setViewState("result");
                  setIsFlipped(false);
                }}
                className="text-xs font-light text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip to test results →
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen - Full Width Split Layout */
          <div className="w-full flex flex-col items-center px-4 md:px-8">
            {/* Flippable Card with new Heidi-style layout */}
            <FlippableCard
              front={
                result && (
                  <ResultCard
                    result={result}
                    formData={formData}
                    bmi={calculateBMI()}
                    currentView={resultView}
                    onViewChange={setResultView}
                  >
                    {resultView === "score" ? (
                      <RiskResult 
                        result={result} 
                        age={formData.age} 
                        bmi={calculateBMI()}
                      />
                    ) : resultView === "factors" ? (
                      <FactorBreakdown 
                        formData={formData}
                        bmi={calculateBMI()}
                      />
                    ) : (
                      <ProjectionView
                        formData={formData}
                        currentResult={result}
                        bmi={calculateBMI()}
                      />
                    )}
                  </ResultCard>
                )
              }
              back={
                <EditForm
                  formData={formData}
                  height={height}
                  weight={weight}
                  onFormDataChange={updateFormData}
                  onHeightChange={setHeight}
                  onWeightChange={setWeight}
                  onRecalculate={handleRecalculate}
                  calculateBMI={calculateBMI}
                  onFlip={() => setIsFlipped(false)}
                />
              }
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              className="w-full"
            />

            {/* Bottom Actions Row */}
            <div className="w-full max-w-6xl flex justify-between items-center mt-8 px-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-light rounded-lg border transition-all hover:shadow-sm"
                style={{ borderColor: '#e8dce5', color: '#665073', backgroundColor: '#fcfaf8' }}
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                New Assessment
              </button>
              
              <button
                onClick={() => {}}
                className="group flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{backgroundColor: '#fbf583', color: '#28030f'}}
              >
                <span className="text-base font-medium tracking-wide" style={{color: '#28030f'}}>
                  Send to Heidi
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" style={{color: '#28030f'}} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default QDiabetesCalculator;
