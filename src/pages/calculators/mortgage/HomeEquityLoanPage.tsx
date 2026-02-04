
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import HomeEquityLoanCalculator from '@/components/calculators/mortgage/HomeEquityLoanCalculator';

const HomeEquityLoanPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/calculators/mortgage" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Mortgage Calculators
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto mb-6">
          <Card>
            <HomeEquityLoanCalculator />
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Home Equity Loans</h2>
          <p className="mb-4">
            A home equity loan lets you borrow against your home's equity - the difference between your home's value 
            and your mortgage balance. It provides a lump sum payment with a fixed interest rate and fixed monthly payments.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Features of Home Equity Loans:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Fixed Interest Rate:</strong> Your rate remains the same throughout the loan term.</li>
            <li><strong>Fixed Monthly Payments:</strong> Consistent payments make budgeting easier.</li>
            <li><strong>Tax Deductible Interest:</strong> Interest may be tax-deductible if the loan is used for home improvements.</li>
            <li><strong>Lump Sum Disbursement:</strong> You receive the entire loan amount upfront.</li>
            <li><strong>Secured by Your Home:</strong> Your home serves as collateral for the loan.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">Common Uses for Home Equity Loans:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Home Improvements:</strong> Renovations, additions, or repairs.</li>
            <li><strong>Debt Consolidation:</strong> Combining high-interest debts into a single, lower-rate loan.</li>
            <li><strong>Major Expenses:</strong> Funding education, medical bills, or other large costs.</li>
            <li><strong>Emergency Funds:</strong> Creating a financial safety net for unexpected expenses.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default HomeEquityLoanPage;
