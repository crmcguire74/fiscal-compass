
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
          <Link to="/calculators/debt" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Debt Calculators
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
            Your debt-to-income ratio (DTI) is a personal finance measure that compares your monthly debt payments to your monthly gross income. 
            It's expressed as a percentage and helps lenders evaluate your ability to manage monthly payments and repay debts.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Why DTI Matters:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Credit Applications:</strong> Lenders use DTI to assess risk when you apply for loans or credit.</li>
            <li><strong>Financial Health:</strong> DTI provides a snapshot of your financial balance between income and debt obligations.</li>
            <li><strong>Budgeting:</strong> Understanding your DTI helps you make better budgeting decisions.</li>
            <li><strong>Borrowing Power:</strong> A lower DTI typically means you can borrow more money for major purchases.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">What's a Good DTI Ratio?</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Below 36%:</strong> Generally considered healthy and favorable to lenders.</li>
            <li><strong>36% to 43%:</strong> Acceptable for most loans but may need improvement.</li>
            <li><strong>43% to 50%:</strong> Concerning to lenders and indicates potential financial stress.</li>
            <li><strong>Above 50%:</strong> Signals significant financial risk and difficulty managing debt.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Strategies to Improve Your DTI:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Increase Income:</strong> Take on a side job, work overtime, or negotiate a raise.</li>
            <li><strong>Pay Down Debt:</strong> Focus on high-interest debts first using debt snowball or avalanche methods.</li>
            <li><strong>Avoid New Debt:</strong> Postpone major purchases that require financing.</li>
            <li><strong>Refinance Existing Debt:</strong> Look for opportunities to lower your monthly payments.</li>
            <li><strong>Debt Consolidation:</strong> Combine multiple debts into one with a potentially lower monthly payment.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DtiCalculatorPage;
