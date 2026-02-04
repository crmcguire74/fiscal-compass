import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from "@/components/layout/Layout";
import InflationCalculator from "@/components/calculators/tools/InflationCalculator";

const InflationPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Inflation Calculator | CPI Calculator | Fiscal Compass</title>
        <meta name="description" content="Calculate the impact of inflation on purchasing power over time. See how much money from the past is worth today." />
      </Helmet>
      <div className="container py-8 max-w-7xl">
        <div className="mb-6">
          <a
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            href="/calculators/tools"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-arrow-left mr-1 h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back to Tools
          </a>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <div className="rounded-lg border bg-card text-card-foreground w-full shadow-md border-gray-200">
            <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold tracking-tight text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-white" />
                    Inflation Calculator
                  </h3>
                  <p className="text-sm text-gray-100 mt-2">
                    Calculate how inflation affects purchasing power over time
                    and understand historical price changes
                  </p>
                </div>
              </div>
            </div>

            <InflationCalculator />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">
              Understanding Inflation and Purchasing Power
            </h2>
            <p className="mb-4">
              Inflation measures how the purchasing power of money changes over
              time. As prices rise, each dollar buys fewer goods and services,
              effectively reducing the value of money.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Consumer Price Index (CPI) tracks the average change in
                    prices paid by urban consumers
                  </li>
                  <li>
                    Purchasing power represents how much goods and services
                    money can buy
                  </li>
                  <li>
                    Historical comparisons help understand the real value of
                    money over time
                  </li>
                  <li>
                    Inflation rates can vary significantly between different
                    time periods
                  </li>
                  <li>
                    Some items may experience different rates of inflation than
                    the overall average
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Common Applications:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Adjusting historical prices to current values for comparison
                  </li>
                  <li>
                    Understanding how savings and investments need to grow to
                    maintain purchasing power
                  </li>
                  <li>
                    Evaluating the real return on investments after accounting
                    for inflation
                  </li>
                  <li>
                    Planning for future expenses by considering the impact of
                    inflation
                  </li>
                  <li>
                    Analyzing historical financial data in terms of today's
                    dollars
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <h3 className="font-semibold mb-2">About the Data:</h3>
            <p className="text-sm text-muted-foreground">
              This calculator uses the Consumer Price Index (CPI) data from the
              U.S. Bureau of Labor Statistics. The CPI is a measure of the
              average change over time in the prices paid by urban consumers for
              a market basket of consumer goods and services. The values shown
              are based on annual averages of the CPI-U (All Urban Consumers)
              series.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InflationPage;
