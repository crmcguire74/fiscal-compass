
import React from 'react';
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import DebtPayoffCalculator from '@/components/calculators/debt/DebtPayoffCalculator';

const DebtPayoffCalculatorPage = () => {
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
            <DebtPayoffCalculator />
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Debt Payoff Strategies</h2>
          <p className="mb-4">
            Choosing the right debt payoff strategy can save you thousands of dollars in interest and help you become debt-free faster. 
            This calculator helps you compare two popular methods:
          </p>
          
          <h3 className="text-lg font-medium mb-2">Debt Snowball Method:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>How it works:</strong> Pay minimum payments on all debts, then put extra money toward the smallest balance first.</li>
            <li><strong>Psychological benefit:</strong> Quick wins as smaller debts are paid off provide motivation to continue.</li>
            <li><strong>Best for:</strong> People who need motivation from seeing progress quickly.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Debt Avalanche Method:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>How it works:</strong> Pay minimum payments on all debts, then put extra money toward the highest interest rate debt first.</li>
            <li><strong>Financial benefit:</strong> Saves the most money in interest over time.</li>
            <li><strong>Best for:</strong> People who prioritize mathematical optimization over psychological wins.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Tips for Successful Debt Repayment:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Create a budget:</strong> Know exactly how much extra you can put toward debt each month.</li>
            <li><strong>Build an emergency fund:</strong> Have at least $1,000 set aside to avoid new debt when emergencies arise.</li>
            <li><strong>Stop adding new debt:</strong> Cut up credit cards or freeze them if necessary while paying off existing balances.</li>
            <li><strong>Increase income:</strong> Consider a side hustle, overtime, or asking for a raise to accelerate your debt payoff.</li>
            <li><strong>Celebrate milestones:</strong> Reward yourself (inexpensively) when you pay off each debt to stay motivated.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DebtPayoffCalculatorPage;
