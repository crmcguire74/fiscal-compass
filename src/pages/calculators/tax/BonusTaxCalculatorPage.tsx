
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
                  <Gift className="h-6 w-6 text-white" />
                  Bonus Tax Calculator
                  </h3>
                  <p className="text-sm text-gray-100 mt-2">
                  Calculate how much of your bonus you'll actually receive after taxes.
                  </p>
                </div>
              </div>
            </div>

            <TakeHomePayCalculator />
            
            
          </div>
        </div>     

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

    </Layout>
  );
};

export default BonusTaxCalculatorPage;
