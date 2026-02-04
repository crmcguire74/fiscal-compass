import Layout from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from "react-router-dom";
import AutoInsuranceCalculator from "@/components/calculators/insurance/AutoInsuranceCalculator";

const AutoInsurancePage = () => {
  return (
    <Layout>
      <Helmet>
            <title>Auto Insurance Calculator | Car Insurance Estimate | Fiscal Compass</title>
            <meta name="description" content="Estimate auto insurance costs based on vehicle, driving history, coverage levels, and location factors." />
      </Helmet>
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/calculators/insurance"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Insurance Calculators
          </Link>
        </div>

        <div className="max-w-5xl mx-auto mb-6">
          <AutoInsuranceCalculator />
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            Understanding Auto Insurance
          </h2>
          <div className="space-y-4">
            <p>
              Auto insurance provides financial protection against physical
              damage and bodily injury resulting from traffic accidents and
              against liability that could also arise. Here's what you need to
              know:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Liability coverage</span> -
                Protects you from costs if you injure someone or damage their
                property
              </li>
              <li>
                <span className="font-medium">Collision coverage</span> - Pays
                for damage to your vehicle caused by a collision
              </li>
              <li>
                <span className="font-medium">Comprehensive coverage</span> -
                Covers damage to your car from events like theft, fire, or
                natural disasters
              </li>
              <li>
                <span className="font-medium">
                  Uninsured/underinsured motorist
                </span>{" "}
                - Protects you if someone without insurance (or with
                insufficient insurance) hits you
              </li>
              <li>
                <span className="font-medium">Medical payments</span> - Covers
                medical expenses for you and your passengers
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> This calculator provides estimates based on
              general rating factors. For personalized quotes, contact insurance
              providers directly.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutoInsurancePage;
