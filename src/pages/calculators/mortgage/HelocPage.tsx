
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import HelocCalculator from '@/components/calculators/mortgage/HelocCalculator';

const HelocPage = () => {
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
            <HelocCalculator />
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Home Equity Lines of Credit (HELOCs)</h2>
          <p className="mb-4">
            A HELOC is a revolving line of credit secured by your home's equity. Unlike a home equity loan, a HELOC allows you 
            to borrow only what you need, when you need it, up to your approved credit limit.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Features of HELOCs:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Variable Interest Rates:</strong> Rates typically adjust based on changes in the prime rate.</li>
            <li><strong>Draw Period:</strong> A set time (often 5-10 years) when you can withdraw funds as needed.</li>
            <li><strong>Repayment Period:</strong> After the draw period ends, you can no longer borrow and must repay the outstanding balance.</li>
            <li><strong>Flexibility:</strong> Borrow only what you need, when you need it.</li>
            <li><strong>Interest-Only Payments:</strong> Often, only interest payments are required during the draw period.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">Common Uses for HELOCs:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ongoing Home Improvements:</strong> Projects that occur in phases over time.</li>
            <li><strong>Emergency Funds:</strong> A safety net for unexpected expenses.</li>
            <li><strong>Education Expenses:</strong> Paying for college tuition or other educational costs.</li>
            <li><strong>Major Purchases:</strong> Funding significant expenses when needed.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">HELOC vs. Home Equity Loan:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Disbursement:</strong> HELOC provides ongoing access to funds; home equity loan gives a one-time lump sum.</li>
            <li><strong>Interest Rates:</strong> HELOCs typically have variable rates; home equity loans usually have fixed rates.</li>
            <li><strong>Payment Structure:</strong> HELOC payments vary based on the amount borrowed; home equity loan payments are fixed.</li>
            <li><strong>Flexibility:</strong> HELOCs offer more flexibility in borrowing; home equity loans provide more certainty in repayment.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default HelocPage;
