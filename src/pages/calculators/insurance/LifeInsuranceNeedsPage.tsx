import Layout from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from "react-router-dom";
import LifeInsuranceNeedsCalculator from "@/components/calculators/insurance/LifeInsuranceNeedsCalculator";

const LifeInsuranceNeedsPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/calculators/insurance"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Insurance Calculators
          </Link>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <LifeInsuranceNeedsCalculator />
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            Understanding Life Insurance Needs
          </h2>
          <div className="space-y-4">
            <p>
              Life insurance serves as a financial safety net for your loved
              ones in the event of your passing. The right amount of coverage
              can help:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Replace your income to maintain your family's standard of living
              </li>
              <li>Pay off outstanding debts like mortgages or student loans</li>
              <li>Cover funeral and final expenses</li>
              <li>Fund children's education or other future needs</li>
              <li>
                Provide peace of mind knowing your family is financially
                protected
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> This calculator provides estimates based on
              the information you provide. For personalized advice, consult with
              a licensed insurance professional.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LifeInsuranceNeedsPage;
