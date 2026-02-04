import { ExternalLink } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 rounded-lg border bg-card text-card-foreground">
      <h3 className="font-display font-semibold text-lg mb-4">About QDiabetes®-2018</h3>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          This calculator implements the QDiabetes®-2018 algorithm, developed by doctors and academics working in the UK National Health Service. 
          It calculates your 10-year risk of developing Type 2 Diabetes based on routinely collected data from many thousands of GPs across the country.
        </p>
        <p>
          QDiabetes® is intended for use in the UK. Recent NICE guidance recommends that GPs and other primary healthcare professionals 
          use a validated computer-based risk-assessment tool, such as QDiabetes, to identify people who may be at high risk of type 2 diabetes.
        </p>
        <p className="font-medium text-foreground">
          All medical decisions need to be taken by a patient in consultation with their doctor. 
          The authors and sponsors accept no responsibility for clinical use or misuse of this score.
        </p>
        <div className="pt-3 flex flex-wrap gap-4">
          <a 
            href="https://qdiabetes.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Official QDiabetes Website
            <ExternalLink className="w-3 h-3" />
          </a>
          <a 
            href="https://doi.org/10.1136/bmj.j5019" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            BMJ Research Paper
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
        <p>
          © 2017 ClinRisk Ltd. Algorithm licensed under GNU Affero General Public License v3.0.
        </p>
      </div>
    </div>
  );
}
