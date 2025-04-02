import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Heart,
  Baby,
  Presentation,
  GraduationCap,
  Gavel,
  ChevronRight, // Added ChevronRight
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

const LifeEventsCalculatorsIndex = () => {
  const calculators = [
    {
      id: "wedding-budget",
      title: "Wedding Budget Calculator",
      description:
        "Plan your wedding budget and track expenses for your special day.",
      icon: <Heart className="h-8 w-8 text-primary" />,
      path: "/calculators/life-events/wedding-budget",
      comingSoon: false,
    },
    {
      id: "baby-costs",
      title: "Baby Cost Calculator",
      description:
        "Estimate the first-year costs of having a baby, including essentials and childcare.",
      icon: <Baby className="h-8 w-8 text-primary" />,
      path: "/calculators/life-events/baby-costs",
      comingSoon: false,
    },
    {
      id: "divorce-calculator",
      title: "Divorce Asset Division Calculator",
      description:
        "Calculate how assets and debts might be divided during a divorce based on your state's laws.",
      icon: <Gavel className="h-8 w-8 text-primary" />,
      path: "/calculators/life-events/divorce-calculator",
      comingSoon: false,
    },
    {
      id: "career-change",
      title: "Career Change Calculator",
      description: "Analyze the financial impact of changing careers or jobs.",
      icon: <Presentation className="h-8 w-8 text-primary" />,
      path: "/calculators/life-events/career-change",
      comingSoon: true,
    },
    {
      id: "grad-school-roi",
      title: "Graduate School ROI",
      description:
        "Calculate the return on investment for pursuing an advanced degree.",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      path: "/calculators/life-events/grad-school-roi",
      comingSoon: true,
    },
  ];

  return (
    <Layout>
      {/* Added styled header section */}
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
              <span>Life Events</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Life Event Calculators
            </h1>
            <p className="text-xl text-white/90">
              Planning for major life milestones requires careful financial
              consideration. Use these calculators to help you prepare.
            </p>
          </div>
        </div>
      </div>

      {/* Existing content below header */}
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">
            Tools to help you navigate the financial aspects of significant life
            changes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {/* Adjusted grid columns for consistency */}
          {calculators.map((calculator) => (
            <Card key={calculator.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-2">
                  {calculator.icon}
                </div>
                <CardTitle>{calculator.title}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex justify-end">
                {calculator.comingSoon ? (
                  <Button variant="outline" disabled className="inline-flex">
                    Coming Soon
                  </Button>
                ) : (
                  <Button asChild className="inline-flex w-auto">
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

export default LifeEventsCalculatorsIndex;
