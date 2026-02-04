
import React from 'react';
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from '@/components/layout/Layout';
import DivorceCalculator from '@/components/calculators/life-events/DivorceCalculator';

const DivorceCalculatorPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">Divorce Asset Division Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Plan for equitable asset division during a divorce based on your state's laws and individual circumstances.
        </p>
        <DivorceCalculator />
      </div>
    </Layout>
  );
};

export default DivorceCalculatorPage;
