import { ArrowLeft, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import TakeHomePaySalariedCalculator from "@/components/calculators/tax/TakeHomePaySalariedCalculator";

const TakeHomePaySalariedPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="mb-6">
          <a
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            href="/calculators/tax"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-arrow-left mr-1 h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back to Tax Calculators
          </a>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <div className="rounded-lg border bg-card text-card-foreground w-full shadow-md border-gray-200">
            <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold tracking-tight text-2xl flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-white" />
                    Take-Home Pay Calculator (Salaried)
                  </h3>
                  <p className="text-sm text-gray-100 mt-2">
                    Estimate your take-home pay after taxes, retirement, and
                    other deductions
                  </p>
                </div>
              </div>
            </div>

            <TakeHomePaySalariedCalculator />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">
              Understanding Your Take-Home Pay
            </h2>
            <p className="mb-4">
              Your take-home pay is what remains of your earnings after taxes
              and deductions. Understanding the factors that affect your net
              income can help you make more informed financial decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Key Deductions Explained:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Federal income tax varies based on your income bracket
                  </li>
                  <li>
                    State income tax varies widely depending on your location
                  </li>
                  <li>
                    FICA taxes include 6.2% for Social Security (up to a wage
                    base limit) and 1.45% for Medicare
                  </li>
                  <li>401(k) contributions reduce your taxable income</li>
                  <li>
                    Other pre-tax deductions like health insurance or FSA
                    contributions affect your net pay
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tax Planning Tips:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Maximize pre-tax retirement contributions to reduce taxable
                    income
                  </li>
                  <li>Consider tax-advantaged accounts like HSAs and FSAs</li>
                  <li>
                    Review your W-4 withholding to avoid large tax bills or
                    refunds
                  </li>
                  <li>
                    Understand how bonuses are taxed for better financial
                    planning
                  </li>
                  <li>
                    Consider the tax implications when negotiating job offers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TakeHomePaySalariedPage;
