import React from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  Home,
  TrendingUp,
  GraduationCap,
  CreditCard,
  Heart,
  DollarSign,
  BookOpen,
  Briefcase,
  Calendar,
  Shield,
  ChevronRight,
  Search,
  ArrowRight,
} from "lucide-react";
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
import CalculatorSearch from "@/components/calculators/shared/CalculatorSearch";
import { CALCULATOR_CATEGORIES } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalculatorsIndex = () => {
  const getCategoryIcon = (iconName: string) => {
    const iconMap = {
      home: <Home className="h-12 w-12 text-finance-primary" />,
      "piggy-bank": <TrendingUp className="h-12 w-12 text-finance-primary" />,
      "trending-up": <TrendingUp className="h-12 w-12 text-finance-primary" />,
      "credit-card": <CreditCard className="h-12 w-12 text-finance-primary" />,
      shield: <Shield className="h-12 w-12 text-finance-primary" />,
      "dollar-sign": <DollarSign className="h-12 w-12 text-finance-primary" />,
      book: <BookOpen className="h-12 w-12 text-finance-primary" />,
      heart: <Heart className="h-12 w-12 text-finance-primary" />,
      briefcase: <Briefcase className="h-12 w-12 text-finance-primary" />,
      calendar: <Calendar className="h-12 w-12 text-finance-primary" />,
      "graduation-cap": (
        <GraduationCap className="h-12 w-12 text-finance-primary" />
      ),
    };
    return (
      iconMap[iconName] || (
        <Calculator className="h-12 w-12 text-finance-primary" />
      )
    );
  };

  const popularCalculators = [
    {
      path: "/calculators/investment/compound-interest",
      name: "Compound Interest",
    },
    {
      path: "/calculators/mortgage/mortgage-payment",
      name: "Mortgage Payment",
    },
    {
      path: "/calculators/retirement/retirement-savings",
      name: "Retirement Savings",
    },
    {
      path: "/calculators/tax/take-home-pay-calculator",
      name: "Take-Home Pay",
    },
    {
      path: "/calculators/tools/scientific-calculator",
      name: "Scientific Calculator",
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-14">
        <div className="container max-w-5xl">
          <div className="flex items-center text-sm mb-3 text-white/80">
            <Link to="/calculators" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Calculators</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Financial Calculators
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Powerful tools to plan your finances, make informed decisions, and
            achieve your financial goals.
          </p>
        </div>
      </div>

      <div className="bg-white py-8 border-b">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-col items-center justify-between gap-6">
            <div className="w-full md:w-2/3 ml-0 mr-auto">
              <h2 className="text-xl font-semibold mb-4">
                Find the calculator you need
              </h2>
              <CalculatorSearch />
            </div>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">
                Popular Calculators
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularCalculators.map((calc, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-finance-primary/30 hover:bg-finance-primary/10"
                  >
                    <Link to={calc.path}>{calc.name}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl">
        <h2 className="text-5xl font-semibold mb-12 mt-24 text-center text-blue-800">
          Calculator Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATOR_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="transition-all hover:shadow-md hover:border-finance-primary/30"
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                  {getCategoryIcon(category.icon)}
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full hover:bg-finance-accent">
                  <Link to={`/calculators/${category.id}`}>
                    View Calculators <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-12 border-t">
        <div className="container max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Most Popular Calculators
            </h2>
            <p className="text-muted-foreground">
              Our most frequently used financial tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturedCalculatorCard
              title="Compound Interest Calculator"
              description="See how your savings can grow over time with the power of compound interest."
              path="/calculators/investment/compound-interest"
            />
            <FeaturedCalculatorCard
              title="Mortgage Payment Calculator"
              description="Calculate your monthly mortgage payment based on loan amount, interest rate, and term."
              path="/calculators/mortgage/mortgage-payment"
            />
            <FeaturedCalculatorCard
              title="Retirement Savings Calculator"
              description="Project your retirement savings and determine if you're on track to meet your goals."
              path="/calculators/retirement/retirement-savings"
            />
            <FeaturedCalculatorCard
              title="Take-Home Pay Calculator (Salaried)"
              description="Calculate your net income after taxes, retirement contributions, and other deductions."
              path="/calculators/tax/take-home-pay-salaried"
            />
            <FeaturedCalculatorCard
              title="Debt-to-Income Ratio Calculator"
              description="Calculate your DTI ratio to see if you qualify for a mortgage and determine what you can afford."
              path="/calculators/mortgage/dti-calculator"
            />
            <FeaturedCalculatorCard
              title="Break-Even Analysis Calculator"
              description="Calculate when your business will become profitable by finding your break-even point."
              path="/calculators/business/break-even-analysis"
            />
          </div>
        </div>
      </div>

      <div className="container py-12 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Financial Literacy Resources
        </h2>
        <p className="text-muted-foreground mb-6">
          Expand your financial knowledge with our helpful resources
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">Read Our Blog</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/blog/featured">Featured Articles</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

const FeaturedCalculatorCard = ({ title, description, path }) => (
  <Card className="transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter className="pt-2">
      <Button asChild variant="outline" className="w-full">
        <Link to={path}>
          Use Calculator <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

export default CalculatorsIndex;
