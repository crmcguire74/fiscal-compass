
import React from 'react';
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import DtiCalculator from '@/components/calculators/shared/DtiCalculator';

const DtiCalculatorPage = () => {
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
            <DtiCalculator />
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Debt-to-Income (DTI) Ratio</h2>
          <p className="mb-4">
            Your debt-to-income ratio (DTI) is a key financial metric that compares how much you owe each month to how much you earn. 
            Lenders use this ratio to evaluate your ability to manage monthly payments and repay the money you plan to borrow.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Why DTI Matters for Mortgages:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Loan Qualification:</strong> Most mortgage lenders prefer a DTI ratio of 43% or less.</li>
            <li><strong>Loan Terms:</strong> A lower DTI may help you secure better interest rates and loan terms.</li>
            <li><strong>Financial Health:</strong> DTI provides insights into your overall financial well-being.</li>
            <li><strong>Buying Power:</strong> Understanding your DTI helps you determine how much house you can afford.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Types of DTI Ratios:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Front-End DTI:</strong> Only includes housing-related expenses (mortgage/rent, property taxes, insurance, HOA fees).</li>
            <li><strong>Back-End DTI:</strong> Includes all recurring monthly debt payments (housing, car loans, student loans, credit cards, etc.).</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Improving Your DTI:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pay Down Debt:</strong> Reduce or eliminate existing debts, especially high-interest ones.</li>
            <li><strong>Avoid New Debt:</strong> Hold off on making large purchases or taking on new loans before applying for a mortgage.</li>
            <li><strong>Increase Income:</strong> Consider a side job, asking for a raise, or finding a higher-paying position.</li>
            <li><strong>Restructure Debt:</strong> Consolidate or refinance existing debt to lower monthly payments.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DtiCalculatorPage;
