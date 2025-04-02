
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TakeHomePayCalculator from '@/components/calculators/tax/TakeHomePayCalculator';

const TakeHomePayPage = () => {
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
                <DollarSign className="h-6 w-6 text-finance-primary" />
                Take-Home Pay Calculator
              </h1>
              <p className="text-muted-foreground mt-1">
                Calculate your net income after taxes, retirement contributions, and other deductions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TakeHomePayCalculator />
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">Understanding Your Take-Home Pay</h2>
            <p className="mb-4">
              Your take-home pay is what remains of your earnings after taxes and deductions. Understanding the factors that affect your net income can help you make more informed financial decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Key Deductions Explained:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Federal income tax varies based on your income bracket</li>
                  <li>State income tax varies widely depending on your location</li>
                  <li>FICA taxes include 6.2% for Social Security (up to a wage base limit) and 1.45% for Medicare</li>
                  <li>401(k) contributions reduce your taxable income</li>
                  <li>Other pre-tax deductions like health insurance or FSA contributions affect your net pay</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tax Planning Tips:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Maximize pre-tax retirement contributions to reduce taxable income</li>
                  <li>Consider tax-advantaged accounts like HSAs and FSAs</li>
                  <li>Review your W-4 withholding to avoid large tax bills or refunds</li>
                  <li>Understand how bonuses are taxed for better financial planning</li>
                  <li>Consider the tax implications when negotiating job offers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TakeHomePayPage;
