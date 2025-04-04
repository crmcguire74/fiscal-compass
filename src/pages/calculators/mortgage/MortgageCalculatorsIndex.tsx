
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Home, Percent, Calculator, DollarSign, BadgeDollarSign, Building, LineChart, ChevronRight } from "lucide-react";

const MortgageCalculatorsIndex = () => {
  const calculators = [
    {
      id: "mortgage-payment",
      title: "Mortgage Payment Calculator",
      description: "Calculate your monthly mortgage payment based on loan amount, interest rate, and term.",
      icon: <Home className="h-8 w-8 text-primary" />,
      path: "/calculators/mortgage/mortgage-payment",
    },
    {
      id: "rent-vs-buy",
      title: "Rent vs Buy Calculator",
      description: "Compare the financial implications of renting versus buying a home.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      path: "/calculators/mortgage/rent-vs-buy",
    },
    {
      id: "dti-calculator",
      title: "Debt-to-Income Ratio Calculator",
      description: "Calculate your DTI ratio to see if you qualify for a mortgage and determine what you can afford.",
      icon: <Percent className="h-8 w-8 text-primary" />,
      path: "/calculators/mortgage/dti-calculator",
    },
    {
      id: "home-equity-loan",
      title: "Home Equity Loan Calculator",
      description: "Calculate your potential home equity loan amount and monthly payments.",
      icon: <Building className="h-8 w-8 text-primary" />,
      path: "/calculators/mortgage/home-equity-loan",
    },
    {
      id: "heloc",
      title: "HELOC Calculator",
      description: "Estimate your home equity line of credit borrowing capacity and payment scenarios.",
      icon: <LineChart className="h-8 w-8 text-primary" />,
      path: "/calculators/mortgage/heloc",
    },
    {
      id: "home-equity-calculator",
      title: "Home Equity After Selling Costs",
      description: "Calculate how much equity you'll have after paying all selling costs and fees.",
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      path: "/calculators/real-estate/home-equity-calculator",
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Mortgage</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Mortgage Calculators</h1>
            <p className="text-xl text-white/90">
              Use our mortgage calculators to help make informed decisions about home loans, refinancing, 
              and using your home equity.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">
            Use these tools to help determine your mortgage needs and explore options for using your home equity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <Card key={calculator.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-2">
                  {calculator.icon}
                </div>
                <CardTitle>{calculator.title}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto justify-end">
                <Button asChild>
                  <Link to={calculator.path}>
                    Use Calculator <ArrowRight className="ml-2 h-4 w-4" />
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

export default MortgageCalculatorsIndex;
