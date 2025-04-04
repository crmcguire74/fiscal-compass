import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { Car, Calculator, Fuel, Wrench, DollarSign } from 'lucide-react';

const AUTO_CALCULATORS = [
  {
    title: "Auto Loan Calculator",
    description: "Estimate monthly payments and total cost of financing a vehicle.",
    icon: <DollarSign className="w-6 h-6" />,
    href: "/calculators/auto/auto-loan",
  },
  {
    title: "Auto Lease Calculator",
    description: "Calculate monthly lease payments including money factor and residual value.",
    icon: <Car className="w-6 h-6" />,
    href: "/calculators/auto/auto-lease",
  },
  {
    title: "Gas & Maintenance Calculator",
    description: "Estimate annual fuel costs and basic maintenance expenses.",
    icon: <Fuel className="w-6 h-6" />,
    href: "/calculators/auto/gas-maintenance",
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <Car className="h-8 w-8" />
              Auto Calculators
            </h1>
            <p className="text-muted-foreground mt-2">
              Tools to help you make informed decisions about vehicle financing, leasing, and ownership costs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AUTO_CALCULATORS.map((calculator) => (
              <Link key={calculator.href} to={calculator.href}>
                <Card className="p-6 h-full hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      {calculator.icon}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{calculator.title}</h2>
                    <p className="text-muted-foreground text-sm flex-grow">
                      {calculator.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold">Understanding Vehicle Costs</h2>
            <p>
              When considering a vehicle purchase, it's important to look beyond just the sticker price. 
              There are three main cost components to consider:
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Acquisition Cost
                </h3>
                <p className="text-sm text-muted-foreground">
                  Whether you choose to finance or lease, this includes down payment, monthly payments, and any fees.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Operating Costs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Regular expenses like fuel, insurance, parking, and registration fees.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Costs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Routine maintenance, repairs, and potential replacement of wear items like tires and brakes.
                </p>
              </div>
            </div>
            <p>
              Use our calculators to estimate these different cost components and make a more informed decision 
              about your next vehicle purchase or lease.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutoCalculatorsIndex;
