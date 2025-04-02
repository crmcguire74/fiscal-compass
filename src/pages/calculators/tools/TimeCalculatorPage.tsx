
import React from 'react';
import Layout from '@/components/layout/Layout';
import TimeCalculator from '@/components/calculators/tools/TimeCalculator';

const TimeCalculatorPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Time Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Calculate time differences between dates, add or subtract time periods, and more. Useful for project planning, travel itineraries, and scheduling.
        </p>
        <TimeCalculator />
      </div>
    </Layout>
  );
};

export default TimeCalculatorPage;
