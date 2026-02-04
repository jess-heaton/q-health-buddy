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
    <div 
      className="h-full w-full flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{borderColor: '#e8dce5'}}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{borderColor: '#e8dce5', backgroundColor: '#fafafa'}}>
        <div>
          <h3 className="font-light text-base" style={{color: '#28030f'}}>Edit Details</h3>
          <p className="text-xs font-light" style={{color: '#665073'}}>Adjust and recalculate</p>
        </div>
        <button
          onClick={onFlip}
          className="flex items-center gap-2 text-xs transition-colors cursor-pointer font-light"
          style={{color: '#665073'}}
        >
          <RotateCw className="w-4 h-4" />
          <span>Done</span>
        </button>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 px-6 py-5">
        <div className="space-y-6 pr-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>Age</Label>
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
              <Label className="text-xs font-light" style={{color: '#665073'}}>Sex</Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => onFormDataChange("sex", value as 'male' | 'female')}
                className="flex gap-4 h-9 items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="edit-male" />
                  <Label htmlFor="edit-male" className="font-light text-sm cursor-pointer" style={{color: '#665073'}}>Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="edit-female" />
                  <Label htmlFor="edit-female" className="font-light text-sm cursor-pointer" style={{color: '#665073'}}>Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Height/Weight/BMI */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>Height (cm)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>Weight (kg)</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>BMI</Label>
              <div className="h-9 flex items-center px-3 rounded-md text-sm font-light" style={{backgroundColor: '#f5e6f0', color: '#28030f'}}>
                {calculateBMI()?.toFixed(1) || "—"}
              </div>
            </div>
          </div>

          {/* Ethnicity & Smoking */}
          <div className="grid grid-cols-2 gap-4" style={{paddingTop: '8px', borderTop: '1px solid #e8dce5'}}>
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>Ethnicity</Label>
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
              <Label className="text-xs font-light" style={{color: '#665073'}}>Smoking</Label>
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
          <div className="grid grid-cols-2 gap-4" style={{paddingTop: '8px', borderTop: '1px solid #e8dce5'}}>
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>Fasting Glucose (mmol/L)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.fastingBloodGlucose || ""}
                onChange={(e) => onFormDataChange("fastingBloodGlucose", parseFloat(e.target.value) || undefined)}
                className="h-9"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-light" style={{color: '#665073'}}>HbA1c (mmol/mol)</Label>
              <Input
                type="number"
                step="1"
                value={formData.hba1c || ""}
                onChange={(e) => onFormDataChange("hba1c", parseFloat(e.target.value) || undefined)}
                className="h-9"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Medical History Checkboxes */}
          <div className="space-y-3" style={{paddingTop: '8px', borderTop: '1px solid #e8dce5'}}>
            <Label className="text-xs font-light" style={{color: '#665073'}}>Medical History</Label>
            <div className="grid grid-cols-2 gap-3">
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
                  <Label htmlFor={`edit-${key}`} className="text-xs font-light cursor-pointer" style={{color: '#665073'}}>
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Female-specific */}
          {formData.sex === "female" && (
            <div className="space-y-3" style={{paddingTop: '8px', borderTop: '1px solid #e8dce5'}}>
              <Label className="text-xs font-light" style={{color: '#665073'}}>Women Only</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-pcos"
                    checked={formData.polycysticOvaries || false}
                    onCheckedChange={(checked) => onFormDataChange("polycysticOvaries", checked as boolean)}
                  />
                  <Label htmlFor="edit-pcos" className="text-xs font-light cursor-pointer" style={{color: '#665073'}}>PCOS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-gestational"
                    checked={formData.gestationalDiabetes || false}
                    onCheckedChange={(checked) => onFormDataChange("gestationalDiabetes", checked as boolean)}
                  />
                  <Label htmlFor="edit-gestational" className="text-xs font-light cursor-pointer" style={{color: '#665073'}}>Gestational diabetes</Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-4 border-t" style={{borderColor: '#e8dce5', backgroundColor: '#fafafa'}}>
        <button 
          onClick={onRecalculate} 
          className="w-full py-2 text-white font-light rounded-lg transition-colors text-sm"
          style={{backgroundColor: '#c23a6a'}}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a6255c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c23a6a')}
        >
          Recalculate Risk
        </button>
      </div>
    </div>
  );
}
