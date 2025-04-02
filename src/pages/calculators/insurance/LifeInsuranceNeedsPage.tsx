
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LifeInsuranceNeedsCalculator from '@/components/calculators/insurance/LifeInsuranceNeedsCalculator';

const LifeInsuranceNeedsPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators/insurance" className="hover:text-white">Insurance</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Life Insurance Needs</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Life Insurance Needs Calculator</h1>
            <p className="text-xl text-white/90">
              Determine how much life insurance coverage you need to protect your loved ones
            </p>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 p-4 bg-muted rounded-lg">
            <Heart className="h-8 w-8 text-primary mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Protect What Matters Most</h2>
              <p className="text-muted-foreground">
                This calculator helps you estimate how much life insurance coverage you may need based on your income, expenses, and family situation.
              </p>
            </div>
          </div>
          
          <LifeInsuranceNeedsCalculator />
          
          <div className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Understanding Life Insurance Needs</h3>
            <div className="space-y-4">
              <p>
                Life insurance serves as a financial safety net for your loved ones in the event of your passing. The right amount of coverage can help:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Replace your income to maintain your family's standard of living</li>
                <li>Pay off outstanding debts like mortgages or student loans</li>
                <li>Cover funeral and final expenses</li>
                <li>Fund children's education or other future needs</li>
                <li>Provide peace of mind knowing your family is financially protected</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Note:</strong> This calculator provides estimates based on the information you provide. For personalized advice, consult with a licensed insurance professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LifeInsuranceNeedsPage;
