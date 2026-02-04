
import React from 'react';
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from '@/components/layout/Layout';
import CurrencyConverter from '@/components/calculators/tools/CurrencyConverter';

const CurrencyConverterPage = () => {
  return (
    <Layout>
      <Helmet>
            <title>Currency Converter | Exchange Rate Calculator | Fiscal Compass</title>
            <meta name="description" content="Convert between world currencies with live exchange rates. See historical rates and currency charts." />
      </Helmet>      
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
        <p className="text-muted-foreground mb-8">
          Convert between different currencies using current exchange rates. Quick and easy to use for travel planning, investments, or business transactions.
        </p>
        <CurrencyConverter />
      </div>
    </Layout>
  );
};

export default CurrencyConverterPage;
