import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  description?: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, description, children, error }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {description && <p className="form-description">{description}</p>}
      {children}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
