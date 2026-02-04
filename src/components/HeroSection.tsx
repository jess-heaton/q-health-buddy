import { ArrowRight, TrendingUp, Clock, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
      style={{backgroundColor: '#fcfaf8'}}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light"
            style={{backgroundColor: '#f5e6f0', color: '#28030f'}}
          >
            <span className="inline-block w-2 h-2 rounded-full" style={{backgroundColor: '#c23a6a'}}></span>
            Evidence-based risk assessment tool
          </div>
        </div>

        {/* Main Heading */}
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-light text-center mb-6 leading-tight tracking-tight"
          style={{color: '#28030f'}}
        >
          Streamline Type 2 Diabetes Risk Assessment
        </h1>

        {/* Subheading */}
        <p 
          className="text-lg sm:text-xl font-light text-center max-w-3xl mx-auto mb-12 leading-relaxed"
          style={{color: '#665073'}}
        >
          Evidence-based QDiabetes calculator built for GPs. Assess patient risk in seconds—speak naturally or enter data manually. Seamlessly integrate with Heidi for patient care planning.
        </p>

        {/* Three Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Fast */}
          <div className="flex flex-col items-center text-center">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{backgroundColor: '#f5e6f0'}}
            >
              <Clock className="w-6 h-6" style={{color: '#c23a6a'}} />
            </div>
            <h3 
              className="text-lg font-light mb-2"
              style={{color: '#28030f'}}
            >
              Faster Assessments
            </h3>
            <p 
              className="text-sm font-light"
              style={{color: '#665073'}}
            >
              Voice or form input—use what fits your workflow
            </p>
          </div>

          {/* Evidence */}
          <div className="flex flex-col items-center text-center">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{backgroundColor: '#f5e6f0'}}
            >
              <TrendingUp className="w-6 h-6" style={{color: '#c23a6a'}} />
            </div>
            <h3 
              className="text-lg font-light mb-2"
              style={{color: '#28030f'}}
            >
              Clinical Confidence
            </h3>
            <p 
              className="text-sm font-light"
              style={{color: '#665073'}}
            >
              QDiabetes-2018 algorithm trusted by NHS
            </p>
          </div>

          {/* Integration */}
          <div className="flex flex-col items-center text-center">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{backgroundColor: '#f5e6f0'}}
            >
              <Users className="w-6 h-6" style={{color: '#c23a6a'}} />
            </div>
            <h3 
              className="text-lg font-light mb-2"
              style={{color: '#28030f'}}
            >
              Complete Planning
            </h3>
            <p 
              className="text-sm font-light"
              style={{color: '#665073'}}
            >
              Send results to Heidi for next steps
            </p>
          </div>
        </div>

        {/* CTA with Arrow */}
        <div className="flex justify-center">
          <div 
            className="inline-flex items-center gap-2 text-base font-light px-1 py-1 rounded-lg cursor-pointer transition-all hover:gap-3"
            style={{color: '#c23a6a'}}
          >
            <span>Start assessment below</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
