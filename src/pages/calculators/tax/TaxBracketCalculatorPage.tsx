
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
          <Link to="/calculators/tax">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tax Calculators
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-finance-primary" />
                Tax Bracket Calculator
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualize how progressive tax brackets apply to your income.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TaxBracketVisualization />
          
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
      </div>
    </Layout>
  );
};

export default TaxBracketCalculatorPage;
