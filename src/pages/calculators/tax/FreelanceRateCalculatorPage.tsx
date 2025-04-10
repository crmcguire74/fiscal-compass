import Layout from "@/components/layout/Layout";
import FreelanceRateCalculator from "@/components/calculators/tax/FreelanceRateCalculator";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const FreelanceRateCalculatorPage = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
             <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">
                Calculators
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
               <Link to="/calculators/tax" className="hover:text-white">
                Income & Taxes
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Freelance Rate Calculator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Freelance Rate Calculator
            </h1>
            <p className="text-xl text-white/90">
              Calculate the ideal hourly rate for your freelance business to ensure profitability.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="container py-12">
        <FreelanceRateCalculator />

        {/* Related Info Section (Optional but good practice) */}
        <div className="mt-16 bg-white p-8 rounded-lg border shadow-sm">
           <h2 className="text-2xl font-semibold mb-4">Understanding Freelance Rates</h2>
           <div className="prose max-w-none text-muted-foreground">
             <p>Setting the right freelance rate is crucial for sustainability and growth. It involves more than just covering personal expenses; you need to account for:</p>
             <ul>
               <li><strong>Business Operating Costs:</strong> Software subscriptions, hardware, office space (even home office deductions), insurance, marketing, etc.</li>
               <li><strong>Taxes:</strong> As a freelancer, you're responsible for self-employment tax (Social Security and Medicare) in addition to federal, state, and local income taxes.</li>
               <li><strong>Non-Billable Time:</strong> Time spent on administrative tasks, marketing, client communication, and professional development doesn't directly generate income but is essential.</li>
               <li><strong>Profit Margin:</strong> This allows your business to grow, invest in new tools, save for retirement, and handle unexpected downturns.</li>
               <li><strong>Benefits:</strong> Factor in costs you'd typically get from an employer, like health insurance premiums, retirement contributions, and paid time off.</li>
             </ul>
             <p>This calculator helps you quantify these factors to arrive at a baseline rate. Remember to also research market rates for your industry and experience level to remain competitive.</p>
           </div>
            <div className="mt-6 px-4 py-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p>
                  <strong>Disclaimer:</strong> This calculator provides an estimate for informational purposes only. Tax calculations are simplified. Consult with financial and tax professionals for personalized advice tailored to your specific situation.
                </p>
              </div>
        </div>
      </div>
    </Layout>
  );
};

export default FreelanceRateCalculatorPage;
