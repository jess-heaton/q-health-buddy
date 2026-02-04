import { QDiabetesCalculator } from "@/components/QDiabetesCalculator";
import { ExternalLink } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{backgroundColor: '#fcfaf8'}}>
      {/* Minimalist Header */}
      <header className="bg-white" style={{backgroundColor: '#fcfaf8'}}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-light tracking-tight" style={{color: '#28030f'}}>
              QDiabetes<sup className="text-2xl">®</sup>
            </h1>
            <p className="text-base font-light text-gray-600 mt-3">
              Type 2 Diabetes Risk Assessment for GPs
            </p>
          </div>
          <a 
            href="https://qdiabetes.org" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-light px-4 py-2 rounded-lg border border-gray-200 transition-all hover:bg-gray-50" style={{color: '#28030f'}}
          >
            Learn more
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Content - Calculator */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <QDiabetesCalculator />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-gray-100 mt-16" style={{backgroundColor: '#fcfaf8'}}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{color: '#28030f'}}>About</h3>
              <p className="text-sm font-light leading-relaxed text-gray-600">
                QDiabetes®-2018 is an evidence-based algorithm trusted by NHS and recommended by NICE for Type 2 Diabetes risk assessment in primary care.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{color: '#28030f'}}>Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://qdiabetes.org" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light flex items-center gap-1 hover:underline text-blue-600"
                  >
                    Official QDiabetes Website <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://bmjopen.bmj.com/content/8/9/e020891" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light flex items-center gap-1 hover:underline text-blue-600"
                  >
                    Research Paper <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{color: '#28030f'}}>Disclaimer</h3>
              <p className="text-sm font-light leading-relaxed text-gray-600">
                For educational purposes. Clinical decisions should be made by GPs in consultation with patients.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-xs text-center font-light text-gray-500">
              © 2017 ClinRisk Ltd. QDiabetes® Algorithm licensed under GNU AGPL v3.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
