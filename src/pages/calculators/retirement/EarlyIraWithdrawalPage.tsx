
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import EarlyIraWithdrawalCalculator from '@/components/calculators/retirement/EarlyIraWithdrawalCalculator';

const EarlyIraWithdrawalPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="mb-6">
          <Link to="/calculators/retirement">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Retirement Calculators
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Calculator className="h-6 w-6 text-finance-primary" />
                Early IRA Withdrawal Calculator
              </h1>
              <p className="text-muted-foreground mt-1">
                Calculate the tax impact and penalties of withdrawing from your retirement accounts early.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <EarlyIraWithdrawalCalculator />
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">Understanding Early IRA Withdrawals</h2>
            <p className="mb-4">
              Withdrawing money from your IRA before retirement age can have significant tax implications and may incur penalties. Understanding these consequences can help you make informed decisions about your retirement savings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Key Points to Consider:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Traditional IRA withdrawals are taxed as ordinary income</li>
                  <li>Withdrawals before age 59½ typically incur a 10% penalty</li>
                  <li>Several exceptions exist that may waive the 10% penalty</li>
                  <li>Roth IRA contributions (but not earnings) can be withdrawn anytime</li>
                  <li>Tax impact varies based on your overall income and tax bracket</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Alternative Options:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Consider taking a loan from your 401(k) instead (if available)</li>
                  <li>Look into Substantially Equal Periodic Payments (SEPP/72t)</li>
                  <li>Explore if you qualify for any penalty exceptions</li>
                  <li>Use Roth IRA contributions first (if applicable)</li>
                  <li>Evaluate other sources of funds before tapping retirement accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EarlyIraWithdrawalPage;
