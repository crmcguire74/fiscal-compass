import { ArrowLeft, Clock } from "lucide-react"; // Using Clock icon
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ValueTimeCalculator from "@/components/calculators/tools/ValueTimeCalculator";

const ValueTimePage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="mb-6">
          <a
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            href="/calculators/tools" // Link back to Tools index
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
            Back to Tools Calculators
          </a>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <div className="rounded-lg border bg-card text-card-foreground w-full shadow-md border-gray-200">
            <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold tracking-tight text-2xl flex items-center gap-2">
                    <Clock className="h-6 w-6 text-white" /> {/* Icon */}
                    Value of Time Calculator
                  </h3>
                  <p className="text-sm text-gray-100 mt-2">
                    Calculate how much your time is worth per hour, minute, day,
                    week, or month.
                  </p>
                </div>
              </div>
            </div>
            <ValueTimeCalculator />
          </div>
        </div>

        {/* Optional: Add an explanation section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">
              Understanding the Value of Your Time
            </h2>
            <p className="mb-4">
              Knowing the monetary value of your time can be a powerful tool for
              making decisions. It helps you evaluate whether spending time on
              certain tasks is worthwhile compared to outsourcing them, or
              whether taking on extra work is worth the compensation offered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">How it Helps:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Make better outsourcing decisions (e.g., cleaning, errands).
                  </li>
                  <li>
                    Evaluate the true cost of meetings or unproductive time.
                  </li>
                  <li>Negotiate freelance rates or project fees.</li>
                  <li>Decide if commuting time is worth a higher salary.</li>
                  <li>Prioritize high-value tasks over low-value ones.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Considerations:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This is a purely financial calculation.</li>
                  <li>
                    It doesn't account for personal enjoyment or fulfillment.
                  </li>
                  <li>
                    Non-work time (leisure, family) has immense non-monetary
                    value.
                  </li>
                  <li>
                    Use this as one data point among many when making life
                    choices.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ValueTimePage;
