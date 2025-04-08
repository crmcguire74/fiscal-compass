import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calculator } from "lucide-react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const investmentCalculators = [
  {
    title: "Compound Interest Calculator",
    description:
      "Calculate how your investments can grow over time with compound interest.",
    path: "/calculators/investment/compound-interest",
  },
  {
    title: "Multi-Account Savings Calculator",
    description:
      "Track and project growth across multiple savings and investment accounts with different rates and contributions.",
    path: "/calculators/investment/savings-calculator",
    isNew: true,
  },
];

const InvestmentCalculatorsIndex = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-14">
        <div className="container max-w-5xl">
          <div className="flex items-center text-sm mb-3 text-white/80">
            <Link to="/calculators" className="hover:text-white">
              Calculators
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Investment & Wealth</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Investment Calculators
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Tools to help you understand and optimize your investment
            strategies.
          </p>
        </div>
      </div>

      <div className="container max-w-5xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investmentCalculators.map((calc, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{calc.title}</CardTitle>
                  {calc.isNew && (
                    <span className="bg-finance-accent/20 text-finance-accent px-2 py-1 rounded text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
                <CardDescription>{calc.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-6">
                <Button asChild className="w-full">
                  <Link to={calc.path}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Use Calculator
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InvestmentCalculatorsIndex;
