import React from "react";
import Layout from "@/components/layout/Layout"; // Corrected import
import ScientificCalculator from "@/components/calculators/tools/ScientificCalculator"; // This component doesn't exist yet
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ScientificCalculatorPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Scientific Calculator
            </CardTitle>
            <CardDescription className="text-center">
              Perform complex mathematical calculations including trigonometric,
              logarithmic, and exponential functions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for the actual calculator component */}
            <ScientificCalculator />
          </CardContent>
        </Card>

        {/* Optional: Add sections for related information, formulas, or explanations below */}
        {/*
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>About the Scientific Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Detailed explanation about scientific calculations, functions available, etc.
            </p>
          </CardContent>
        </Card>
        */}
      </div>
    </Layout>
  );
};

export default ScientificCalculatorPage;
