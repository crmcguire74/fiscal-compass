
import { ArrowLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TakeHomePayCalculator from '@/components/calculators/tax/TakeHomePayCalculator';

const BonusTaxCalculatorPage = () => {
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
                <Gift className="h-6 w-6 text-finance-primary" />
                Bonus Tax Calculator
              </h1>
              <p className="text-muted-foreground mt-1">
                Calculate how much of your bonus you'll actually receive after taxes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TakeHomePayCalculator />
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">Understanding Bonus Taxation</h2>
            <p className="mb-4">
              Bonuses are typically considered "supplemental wages" by the IRS and are often subject to different withholding rules than your regular paycheck.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">How Bonuses Are Taxed:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The IRS allows for a flat 22% federal withholding rate on bonuses up to $1 million</li>
                  <li>For bonuses exceeding $1 million, the rate increases to 37% for the amount over $1 million</li>
                  <li>State taxes on bonuses vary by location</li>
                  <li>Bonuses are also subject to Social Security and Medicare taxes</li>
                  <li>Your employer may also withhold for retirement plans if applicable</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bonus Tax Planning Tips:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Consider increasing your 401(k) contribution for the pay period with your bonus</li>
                  <li>Ask your employer about timing options for receiving your bonus</li>
                  <li>Be aware that bonus withholding is often higher than your actual tax rate</li>
                  <li>Remember that your final tax liability is determined when you file your tax return</li>
                  <li>Consider setting aside some of your bonus for estimated tax payments if withholding seems insufficient</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BonusTaxCalculatorPage;
