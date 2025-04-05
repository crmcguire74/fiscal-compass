import React, { useEffect } from "react";
import RentVsBuyCalculator from "@/components/calculators/mortgage/RentVsBuyCalculator";
import Layout from "@/components/layout/Layout";

const RentVsBuyPage: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title =
      "Rent vs. Buy Calculator | Compare Costs and Build Wealth | Fiscal Compass";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Make an informed decision between renting and buying a home. Compare monthly costs, " +
          "tax benefits, and long-term wealth building with our comprehensive calculator."
      );
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <RentVsBuyCalculator />

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold">
              Understanding the Rent vs. Buy Decision
            </h2>
            <p>
              The decision to rent or buy a home is one of the most significant
              financial choices you'll make. This calculator helps you compare
              the long-term financial implications of both options.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Buying Considerations</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Upfront costs (down payment, closing costs)</li>
                  <li>Monthly mortgage payments</li>
                  <li>Property taxes and insurance</li>
                  <li>Maintenance and repairs</li>
                  <li>Home value appreciation</li>
                  <li>Tax benefits from interest deduction</li>
                  <li>Building equity over time</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Renting Considerations
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Lower upfront costs</li>
                  <li>Predictable monthly payments</li>
                  <li>No maintenance responsibilities</li>
                  <li>Greater flexibility to move</li>
                  <li>Investment opportunities with saved money</li>
                  <li>No exposure to housing market risks</li>
                  <li>Rental price increases over time</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">
                Making Your Decision
              </h3>
              <p>
                While this calculator provides valuable financial insights,
                remember that the "right" choice depends on many factors beyond
                just numbers:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>How long do you plan to stay in the area?</li>
                <li>Do you value flexibility or stability more?</li>
                <li>
                  Are you ready for the responsibilities of homeownership?
                </li>
                <li>What are your local market conditions?</li>
                <li>How might your income and needs change over time?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RentVsBuyPage;
