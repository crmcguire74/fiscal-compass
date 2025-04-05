import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Clock,
  Ruler,
  Globe,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const ToolsCalculatorsIndex = () => {
  const calculators = [
    {
      id: "currency-converter",
      title: "Currency Converter",
      description:
        "Convert between different currencies with up-to-date exchange rates.",
      icon: <Globe className="h-8 w-8 text-primary" />,
      path: "/calculators/tools/currency-converter",
      comingSoon: false,
    },
    {
      id: "measurement-converter",
      title: "Measurement Converter",
      description:
        "Convert between different units of length, weight, volume, temperature, and more.",
      icon: <Ruler className="h-8 w-8 text-primary" />,
      path: "/calculators/tools/measurement-converter",
      comingSoon: false,
    },
    {
      id: "time-calculator",
      title: "Time Calculator",
      description:
        "Calculate time differences, add or subtract time from dates, and more.",
      icon: <Clock className="h-8 w-8 text-primary" />,
      path: "/calculators/tools/time-calculator",
      comingSoon: false,
    },
    {
      id: "scientific-calculator",
      title: "Scientific Calculator",
      description:
        "Perform advanced scientific calculations with mathematical functions.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      path: "/calculators/tools/scientific-calculator",
      comingSoon: false, // Changed to false
    },
  ];

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
              <span>Practical Tools</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Practical Tools & Converters
            </h1>
            <p className="text-xl text-white/90">
              Everyday calculators and converters for quick reference and
              practical problem-solving
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Tools</h2>
          <p className="text-muted-foreground">
            Use these calculators and converters for everyday practical
            calculations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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
                {calculator.comingSoon ? (
                  <Button variant="outline" disabled className="inline-flex">
                    Coming Soon
                  </Button>
                ) : (
                  <Button asChild className="inline-flex">
                    <Link to={calculator.path}>
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ToolsCalculatorsIndex;
