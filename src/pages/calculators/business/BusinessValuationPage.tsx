
import React from 'react';
import Layout from '@/components/layout/Layout';
import BusinessValuationCalculator from '@/components/calculators/business/BusinessValuationCalculator';

const BusinessValuationPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Business Valuation Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Estimate the value of your business using different valuation methods, including revenue multiples, 
          earnings multiples, asset-based valuation, and discounted cash flow analysis.
        </p>
        <BusinessValuationCalculator />
      </div>
    </Layout>
  );
};

export default BusinessValuationPage;
