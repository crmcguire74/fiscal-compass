
import React from "react";
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from "@/components/layout/Layout";
import BabyCostCalculator from "@/components/calculators/life-events/BabyCostCalculator";

const BabyCostPage = () => {
  return (
    <Layout>
      <Helmet>
            <title>Baby Cost Calculator | First Year Baby Expenses | Fiscal Compass</title>
            <meta name="description" content="Calculate the cost of having a baby in the first year. Budget for diapers, formula, childcare, and medical expenses." />
      </Helmet>
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
