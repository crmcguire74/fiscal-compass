
import Layout from '@/components/layout/Layout';
import CompoundInterestCalculator from '@/components/calculators/investment/CompoundInterestCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompoundInterestPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/calculators/investment" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Investment Calculators
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto mb-6">
          <CompoundInterestCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Compound Interest</h2>
          <p className="mb-4">
            Compound interest is when the interest you earn on your money also earns interest. This powerful concept can help your savings grow exponentially over time.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Factors That Affect Your Returns:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Initial Investment:</strong> The amount you start with.</li>
            <li><strong>Regular Contributions:</strong> Adding money consistently can dramatically increase your final balance.</li>
            <li><strong>Interest Rate:</strong> Higher rates lead to faster growth, but often come with higher risk.</li>
            <li><strong>Time Period:</strong> The longer your money compounds, the more dramatic the growth becomes.</li>
            <li><strong>Compounding Frequency:</strong> How often interest is calculated (daily, monthly, yearly, etc.).</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">How to Use This Calculator:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter your starting amount in the "Initial Investment" field.</li>
            <li>Specify how much you plan to contribute each month.</li>
            <li>Set your expected annual interest rate (return on investment).</li>
            <li>Choose how many years you'll be investing.</li>
            <li>Select how often your interest compounds (monthly is common for many investments).</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default CompoundInterestPage;
