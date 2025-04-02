
import React from "react";
import Layout from "@/components/layout/Layout";
import BabyCostCalculator from "@/components/calculators/life-events/BabyCostCalculator";

const BabyCostPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Baby Cost Calculator</h1>
          <p className="text-muted-foreground text-lg">
            Estimate and plan for the financial impact of having a baby during the first year.
          </p>
        </div>
        <BabyCostCalculator />
      </div>
    </Layout>
  );
};

export default BabyCostPage;
