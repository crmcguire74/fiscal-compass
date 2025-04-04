import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Car, Calculator, Fuel, Wrench, DollarSign, ArrowRight, ChevronRight } from 'lucide-react';

const AUTO_CALCULATORS = [
  {
    id: "auto-loan",
    title: "Auto Loan Calculator",
    description: "Estimate monthly payments and total cost of financing a vehicle.",
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    path: "/calculators/auto/auto-loan",
  },
  {
    id: "auto-lease",
    title: "Auto Lease Calculator",
    description: "Calculate monthly lease payments including money factor and residual value.",
    icon: <Car className="h-8 w-8 text-primary" />,
    path: "/calculators/auto/auto-lease",
  },
  {
    id: "gas-maintenance",
    title: "Gas & Maintenance Calculator",
    description: "Estimate annual fuel costs and basic maintenance expenses.",
    icon: <Fuel className="h-8 w-8 text-primary" />,
    path: "/calculators/auto/gas-maintenance",
  },
  // Add more calculators as they become available
];

const AutoCalculatorsIndex = () => {
  React.useEffect(() => {
    // Update meta tags for SEO
    document.title = 'Auto Calculators | Vehicle Cost Analysis Tools | Fiscal Compass';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Calculate car payments, compare lease vs. buy options, and estimate ownership costs ' +
        'with our comprehensive suite of auto calculators.');
    }
  }, []);

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
              <span>Auto</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Auto Calculators</h1>
            <p className="text-xl text-white/90">
              Tools to help you make informed decisions about vehicle financing, leasing, and ownership costs.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">
            Use these tools to estimate costs and compare options for vehicle purchases, leases, and maintenance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AUTO_CALCULATORS.map((calculator) => (
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

        <div className="mt-12 bg-gray-50 rounded-lg p-6 border max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Understanding Vehicle Costs</h2>
          <p className="mb-4">
            When considering a vehicle purchase, it's important to look beyond just the sticker price. 
            There are three main cost components to consider:
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Acquisition Cost
              </h3>
              <p className="text-sm text-muted-foreground">
                Whether you choose to finance or lease, this includes down payment, monthly payments, and any fees.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Fuel className="h-5 w-5 text-primary" />
                Operating Costs
              </h3>
              <p className="text-sm text-muted-foreground">
                Regular expenses like fuel, insurance, parking, and registration fees.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Wrench className="h-5 w-5 text-primary" />
                Maintenance Costs
              </h3>
              <p className="text-sm text-muted-foreground">
                Routine maintenance, repairs, and potential replacement of wear items like tires and brakes.
              </p>
            </div>
          </div>
          <p className="mt-6">
            Use our calculators to estimate these different cost components and make a more informed decision 
            about your next vehicle purchase or lease.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AutoCalculatorsIndex;
