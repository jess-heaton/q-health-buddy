import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { QDiabetesInput, ETHNICITY_OPTIONS, SMOKING_OPTIONS } from "@/lib/qdiabetes";
import { RotateCw, Calculator } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditFormProps {
  formData: Partial<QDiabetesInput>;
  height: string;
  weight: string;
  onFormDataChange: <K extends keyof QDiabetesInput>(key: K, value: QDiabetesInput[K]) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onRecalculate: () => void;
  calculateBMI: () => number | undefined;
  onFlip?: () => void;
}

export function EditForm({
  formData,
  height,
  weight,
  onFormDataChange,
  onHeightChange,
  onWeightChange,
  onRecalculate,
  calculateBMI,
  onFlip,
}: EditFormProps) {
  return (
    <div className="w-full py-8 px-6 md:px-12 rounded-2xl" style={{ background: '#f9f4f1' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-8 md:gap-12 min-h-[480px]">
        {/* Left Panel - Context */}
        <div className="flex-1 flex flex-col justify-center py-8 md:py-12">
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#665073' }}>
            Edit Mode
          </p>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6 leading-tight" style={{ color: '#28030f' }}>
            <span className="italic">Adjust Details</span>
          </h2>
          
          <p className="text-base font-light leading-relaxed mb-8 max-w-md" style={{ color: '#665073' }}>
            Fine-tune the clinical variables if the AI extraction needs adjustment. Changes will be reflected immediately in your risk calculation.
          </p>

          {/* Navigation Link with Bold instead of Underline */}
          <nav className="flex items-center gap-2 mb-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip?.();
              }}
              className="text-sm font-semibold transition-all"
              style={{ color: '#28030f' }}
            >
              ← Back to results
            </button>
          </nav>

          <p className="text-xs font-light" style={{ color: '#8a7a9a' }}>
            Tap card to return to results
          </p>
        </div>

        {/* Right Panel - White Form Box */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#fafafa' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-light text-base" style={{ color: '#28030f' }}>Clinical Variables</h3>
                  <p className="text-xs font-light" style={{ color: '#665073' }}>Modify and recalculate</p>
                </div>
                <button
                  onClick={onRecalculate}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ backgroundColor: '#28030f' }}
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <ScrollArea className="h-[400px]">
              <div className="px-6 py-5 space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Age</Label>
                    <Input
                      type="number"
                      min={25}
                      max={84}
                      value={formData.age || ""}
                      onChange={(e) => onFormDataChange("age", parseInt(e.target.value) || undefined)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Sex</Label>
                    <RadioGroup
                      value={formData.sex}
                      onValueChange={(value) => onFormDataChange("sex", value as 'male' | 'female')}
                      className="flex gap-4 h-9 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="edit-male" />
                        <Label htmlFor="edit-male" className="font-light text-sm cursor-pointer" style={{ color: '#665073' }}>Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="edit-female" />
                        <Label htmlFor="edit-female" className="font-light text-sm cursor-pointer" style={{ color: '#665073' }}>Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Height/Weight/BMI */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Height (cm)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => onHeightChange(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => onWeightChange(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>BMI</Label>
                    <div className="h-9 flex items-center px-3 rounded-md text-sm font-medium bg-gray-100" style={{ color: '#28030f' }}>
                      {calculateBMI()?.toFixed(1) || "—"}
                    </div>
                  </div>
                </div>

                {/* Ethnicity & Smoking */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Ethnicity</Label>
                    <Select
                      value={formData.ethnicity?.toString()}
                      onValueChange={(value) => onFormDataChange("ethnicity", parseInt(value))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ETHNICITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Smoking</Label>
                    <Select
                      value={formData.smoking?.toString()}
                      onValueChange={(value) => onFormDataChange("smoking", parseInt(value))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SMOKING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Blood Tests */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>Fasting Glucose</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.fastingBloodGlucose || ""}
                      onChange={(e) => onFormDataChange("fastingBloodGlucose", parseFloat(e.target.value) || undefined)}
                      className="h-9"
                      placeholder="mmol/L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-light" style={{ color: '#665073' }}>HbA1c</Label>
                    <Input
                      type="number"
                      step="1"
                      value={formData.hba1c || ""}
                      onChange={(e) => onFormDataChange("hba1c", parseFloat(e.target.value) || undefined)}
                      className="h-9"
                      placeholder="mmol/mol"
                    />
                  </div>
                </div>

                {/* Medical History Checkboxes */}
                <div className="pt-4 border-t border-gray-100">
                  <Label className="text-xs font-light mb-3 block" style={{ color: '#665073' }}>Medical History</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "familyHistoryDiabetes", label: "Family history" },
                      { key: "cardiovascularDisease", label: "CVD" },
                      { key: "treatedHypertension", label: "Hypertension" },
                      { key: "learningDisabilities", label: "Learning disabilities" },
                      { key: "mentalIllness", label: "Mental illness" },
                      { key: "corticosteroids", label: "Steroids" },
                      { key: "statins", label: "Statins" },
                      { key: "atypicalAntipsychotics", label: "Antipsychotics" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${key}`}
                          checked={(formData as any)[key] || false}
                          onCheckedChange={(checked) => onFormDataChange(key as any, checked as boolean)}
                        />
                        <Label htmlFor={`edit-${key}`} className="text-xs font-light cursor-pointer" style={{ color: '#665073' }}>
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Female-specific */}
                {formData.sex === "female" && (
                  <div className="pt-4 border-t border-gray-100">
                    <Label className="text-xs font-light mb-3 block" style={{ color: '#665073' }}>Women Only</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-pcos"
                          checked={formData.polycysticOvaries || false}
                          onCheckedChange={(checked) => onFormDataChange("polycysticOvaries", checked as boolean)}
                        />
                        <Label htmlFor="edit-pcos" className="text-xs font-light cursor-pointer" style={{ color: '#665073' }}>PCOS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-gestational"
                          checked={formData.gestationalDiabetes || false}
                          onCheckedChange={(checked) => onFormDataChange("gestationalDiabetes", checked as boolean)}
                        />
                        <Label htmlFor="edit-gestational" className="text-xs font-light cursor-pointer" style={{ color: '#665073' }}>Gestational diabetes</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
