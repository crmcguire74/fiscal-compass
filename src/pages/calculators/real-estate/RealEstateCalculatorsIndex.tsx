import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Calculator, TrendingUp, Building } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const calculators = [
  {
    title: 'Home Equity Calculator',
    description: 'Calculate your home equity and track your wealth building progress.',
    icon: TrendingUp,
    href: '/calculators/real-estate/home-equity',
    color: 'text-blue-500',
  },
  {
    title: 'Mortgage Payment Calculator',
    description: 'Estimate your monthly mortgage payments and amortization schedule.',
    icon: Calculator,
    href: '/calculators/mortgage/payment',
    color: 'text-green-500',
    popular: true,
  },
  {
    title: 'HELOC Calculator',
    description: 'Determine how much you can borrow with a home equity line of credit.',
    icon: Building,
    href: '/calculators/mortgage/heloc',
    color: 'text-orange-500',
  },
];

const RealEstateCalculatorsIndex: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = 'Real Estate Calculators | Financial Planning Tools | Fiscal Compass';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Make smarter real estate decisions with our suite of calculators. ' +
        'Calculate home equity, estimate mortgage payments, and more.');
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Real Estate Calculators</h1>
            <p className="text-lg text-muted-foreground">
              Make informed real estate decisions with our comprehensive suite of calculators 
              designed to help you analyze costs, compare options, and plan your investments.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link key={calc.title} to={calc.href}>
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${calc.color}`} />
                        <span>{calc.title}</span>
                        {calc.popular && (
                          <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>{calc.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold">Why Use Our Real Estate Calculators?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Make Informed Decisions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compare different scenarios side by side</li>
                  <li>Understand the long-term financial impact</li>
                  <li>Consider all costs and benefits</li>
                  <li>Visualize your wealth building journey</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Advanced Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Save your calculations for later</li>
                  <li>Adjust assumptions in real-time</li>
                  <li>Consider tax implications</li>
                  <li>Export results for reference</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Making the Most of Our Calculators</h3>
              <p className="mb-4">
                To get the most accurate results from our calculators, gather the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Current home prices in your target area</li>
                <li>Local property tax rates</li>
                <li>Current mortgage interest rates</li>
                <li>Your monthly income and expenses</li>
                <li>Insurance cost estimates</li>
                <li>HOA fees (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RealEstateCalculatorsIndex;
