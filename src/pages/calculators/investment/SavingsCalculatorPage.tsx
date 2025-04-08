import Layout from "@/components/layout/Layout";
import SavingsCalculator from "@/components/calculators/investment/SavingsCalculator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SavingsCalculatorPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/calculators/investment"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Investment Calculators
          </Link>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <SavingsCalculator />
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Savings Goals</h2>
          <p className="mb-4">
            Having clear savings goals and understanding how to reach them is
            crucial for financial success. This calculator helps you plan and
            track your progress towards your savings objectives.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Factors to Consider:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Target Amount:</strong> The total amount you want to save.
            </li>
            <li>
              <strong>Time Frame:</strong> How long you have to reach your goal.
            </li>
            <li>
              <strong>Regular Contributions:</strong> How much you can save
              regularly.
            </li>
            <li>
              <strong>Interest Rate:</strong> Expected return on your savings.
            </li>
            <li>
              <strong>Current Savings:</strong> What you've already saved.
            </li>
          </ul>
          <h3 className="text-lg font-medium mb-2">
            How to Use This Calculator:
          </h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter your savings goal amount.</li>
            <li>Input your current savings if any.</li>
            <li>Set your target date or timeframe.</li>
            <li>Add expected interest rate on your savings.</li>
            <li>Review the required monthly savings and projected growth.</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default SavingsCalculatorPage;
