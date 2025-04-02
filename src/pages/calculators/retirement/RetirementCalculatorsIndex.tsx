
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, CalendarClock, Calculator, PiggyBank, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RetirementCalculatorsIndex = () => {
  const calculators = [
    {
      id: "retirement-savings",
      title: "Retirement Savings Calculator",
      description: "Calculate how much you need to save for retirement and track your progress toward your goals.",
      icon: <PiggyBank className="h-8 w-8 text-primary" />,
      path: "/calculators/retirement/retirement-savings",
    },
    {
      id: "early-ira-withdrawal",
      title: "Early IRA Withdrawal Calculator",
      description: "Estimate the true cost of early withdrawals from your retirement accounts, including taxes and penalties.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      path: "/calculators/retirement/early-ira-withdrawal",
    },
    {
      id: "social-security-optimizer",
      title: "Social Security Optimizer",
      description: "Determine the optimal age to claim Social Security benefits based on your unique situation.",
      icon: <CalendarClock className="h-8 w-8 text-primary" />,
      path: "/calculators/retirement/social-security-optimizer",
      comingSoon: true,
    },
    {
      id: "retirement-income",
      title: "Retirement Income Calculator",
      description: "Estimate your monthly income in retirement based on your savings, pensions, and Social Security.",
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      path: "/calculators/retirement/retirement-income",
      comingSoon: true,
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
              <span>Retirement</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Retirement Calculators</h1>
            <p className="text-xl text-white/90">
              Plan for your future with our comprehensive retirement calculators.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground text-lg">
            Use these calculators to help plan and optimize your retirement strategy.
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
                    <Button asChild>
                      <Link to={calculator.path}>
                        Use Calculator <ArrowRight className="ml-2 h-4 w-4" />
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

export default RetirementCalculatorsIndex;
