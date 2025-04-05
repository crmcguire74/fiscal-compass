
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TaxBracketVisualization from '@/components/calculators/tax/TaxBracketVisualization';

const TaxBracketCalculatorPage = () => {
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
                  <BarChart3 className="h-6 w-6 text-white" />
                  Tax Bracket Calculator
                  </h3>
                  <p className="text-sm text-gray-100 mt-2">
                     Visualize how progressive tax brackets apply to your income.
                  </p>
                </div>
              </div>
            </div>

            <TaxBracketVisualization />
            
          </div>
        </div>     

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">Understanding Tax Brackets</h2>
            <p className="mb-4">
              The U.S. uses a progressive tax system, which means your income is taxed at different rates as it crosses certain thresholds. This visualization helps you understand how your income is taxed across these different brackets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Common Tax Bracket Misconceptions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A common myth is that moving into a higher tax bracket means all your income is taxed at the higher rate</li>
                  <li>In reality, only the portion of your income that falls within a specific bracket is taxed at that rate</li>
                  <li>Your effective tax rate is always lower than your highest marginal rate</li>
                  <li>Tax brackets are adjusted annually for inflation</li>
                  <li>Different filing statuses (single, married, etc.) have different bracket thresholds</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tax Planning Strategies:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Contribute to pre-tax retirement accounts to potentially lower your taxable income bracket</li>
                  <li>Time income recognition and deductions across tax years when possible</li>
                  <li>Consider tax-loss harvesting for investment accounts</li>
                  <li>Understand how additional income (bonuses, side jobs) will be taxed</li>
                  <li>Compare standard and itemized deductions to maximize tax savings</li>
                </ul>
              </div>
            </div>
          </div>
      </div>

    </Layout>
  );
};

export default TaxBracketCalculatorPage;
