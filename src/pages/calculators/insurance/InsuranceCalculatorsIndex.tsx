
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Shield, Heart, Home, Car, Umbrella, Baby, Activity, Landmark, BarChart3 } from "lucide-react";

const InsuranceCalculatorsIndex = () => {
  const calculators = [
    {
      id: "life-insurance-needs",
      title: "Life Insurance Needs Calculator",
      description: "Determine how much life insurance coverage you need to protect your family and dependents.",
      icon: <Heart className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/life-insurance-needs",
      comingSoon: false,
    },
    {
      id: "homeowners-insurance",
      title: "Homeowners Insurance Calculator",
      description: "Estimate how much home insurance coverage you need based on your property value and assets.",
      icon: <Home className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/homeowners-insurance",
      comingSoon: false,
    },
    {
      id: "auto-insurance",
      title: "Auto Insurance Coverage Calculator",
      description: "Determine the optimal coverage levels for your vehicles and driving habits.",
      icon: <Car className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/auto-insurance",
      comingSoon: false,
    },
    {
      id: "umbrella-insurance",
      title: "Umbrella Insurance Calculator",
      description: "Calculate how much additional liability coverage you need to protect your assets.",
      icon: <Umbrella className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/umbrella-insurance",
      comingSoon: false,
    },
    {
      id: "disability-insurance",
      title: "Disability Insurance Calculator",
      description: "Determine how much disability coverage you need to protect your income if you become unable to work.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/disability-insurance",
      comingSoon: false,
    },
    {
      id: "health-insurance",
      title: "Health Insurance Expense Calculator",
      description: "Compare health insurance plans and estimate your annual healthcare expenses.",
      icon: <Activity className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/health-insurance",
      comingSoon: false,
    },
    {
      id: "business-insurance",
      title: "Business Insurance Calculator",
      description: "Estimate your business insurance needs including liability, property, and business interruption coverage.",
      icon: <Landmark className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/business-insurance",
      comingSoon: true,
    },
    {
      id: "insurance-comparison",
      title: "Insurance Plan Comparison Tool",
      description: "Compare different insurance plans side by side to find the best coverage for your needs and budget.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/insurance-comparison",
      comingSoon: true,
    },
    {
      id: "long-term-care",
      title: "Long-Term Care Insurance Calculator",
      description: "Calculate the potential costs of long-term care and determine how much insurance coverage you need.",
      icon: <Baby className="h-8 w-8 text-primary" />,
      path: "/calculators/insurance/long-term-care",
      comingSoon: true,
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Insurance Planning Calculators</h1>
            <p className="text-xl text-white/90">
              Use these calculators to help determine your insurance needs and find the right coverage for you and your family.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">
            Use these tools to help determine your insurance needs and find the right coverage for you and your family.
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
              <CardFooter className="mt-auto">
                <div className="flex justify-end w-full">
                  {calculator.comingSoon ? (
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button asChild className="hover:bg-accent">
                      <Link to={calculator.path}>
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InsuranceCalculatorsIndex;
