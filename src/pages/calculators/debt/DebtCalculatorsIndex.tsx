import React from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CircleDollarSign,
  Calculator,
  BarChart3,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const calculators = [
  {
    title: "Debt-to-Income Ratio Calculator",
    description:
      "Calculate your debt-to-income ratio, a key metric lenders use to evaluate loan eligibility.",
    icon: <BarChart3 className="h-12 w-12 text-primary" />,
    url: "/calculators/debt/dti-calculator",
    comingSoon: false,
  },
  {
    title: "Debt Payoff Calculator",
    description:
      "Compare pros and cons of different debt payoff strategies and create a plan to become debt-free.",
    icon: <Calculator className="h-12 w-12 text-primary" />,
    url: "/calculators/debt/payoff-calculator",
    comingSoon: false,
  },
  {
    title: "Debt Consolidation Calculator",
    description:
      "See if consolidating your debts could save you money and help you pay off debt faster.",
    icon: <CircleDollarSign className="h-12 w-12 text-primary" />,
    url: "/calculators/debt/consolidation-calculator",
    comingSoon: true,
  },
];

const DebtCalculatorsIndex = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">
                Calculators
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Debt Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Debt Management Calculators
            </h1>
            <p className="text-xl text-white/90">
              Take control of your debt with our suite of debt management
              calculators.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Available Calculators
            </h2>
            <p className="text-muted-foreground">
              Use these tools to understand your debt situation and create
              strategies to improve it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calculator, index) => (
              <Card
                key={index}
                className={calculator.comingSoon ? "opacity-70" : ""}
              >
                <CardHeader>
                  <div className="mb-2">{calculator.icon}</div>
                  <CardTitle className="text-xl">{calculator.title}</CardTitle>
                  <CardDescription>{calculator.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex justify-end w-full">
                    {calculator.comingSoon ? (
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to={calculator.url}>
                          Use Calculator <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">
              Why Use Our Debt Calculators?
            </h2>
            <p className="mb-4">
              Managing debt effectively is a critical component of financial
              health. Our calculators help you understand your current debt
              situation and create strategies to improve it.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Know Where You Stand:</strong> Calculate important
                metrics like your debt-to-income ratio to understand your
                financial position.
              </li>
              <li>
                <strong>Create a Plan:</strong> Develop strategies to pay down
                debt more efficiently and save on interest.
              </li>
              <li>
                <strong>Save Money:</strong> Find opportunities to reduce
                interest payments through consolidation or refinancing.
              </li>
              <li>
                <strong>Make Better Decisions:</strong> Evaluate the impact of
                different debt management approaches before taking action.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DebtCalculatorsIndex;
