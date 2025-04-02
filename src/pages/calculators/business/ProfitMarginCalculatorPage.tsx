
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProfitMarginCalculator from '@/components/calculators/business/ProfitMarginCalculator';
import { ChevronRight, Percent } from 'lucide-react';

const ProfitMarginCalculatorPage = () => {
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
              <Link to="/calculators/business" className="hover:text-white">Business</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Profit Margin Calculator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Profit Margin Calculator</h1>
            <p className="text-xl text-white/90">
              Calculate and analyze your business's gross, operating, and net profit margins.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <ProfitMarginCalculator />
      </div>
    </Layout>
  );
};

export default ProfitMarginCalculatorPage;
