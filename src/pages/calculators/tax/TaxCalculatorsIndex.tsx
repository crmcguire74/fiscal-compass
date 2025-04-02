
import { Calculator, DollarSign, ArrowRight, ChevronRight, BarChart3, Gift } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const TAX_CALCULATORS = [
  {
    id: 'take-home-pay-calculator',
    name: 'Take-Home Pay Calculator',
    description: 'Calculate your net income after taxes, retirement contributions, and other deductions',
    icon: DollarSign,
    status: 'active',
    featured: true,
  },
  {
    id: 'tax-bracket-calculator',
    name: 'Tax Bracket Calculator',
    description: 'Visualize how your income is taxed across different tax brackets',
    icon: BarChart3,
    status: 'active',
    featured: false,
  },
  {
    id: 'bonus-tax-calculator',
    name: 'Bonus Tax Calculator',
    description: 'Calculate how much of your bonus you\'ll actually receive after taxes',
    icon: Gift,
    status: 'active',
    featured: false,
  },
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    description: 'Estimate your federal and state income tax liability based on income and deductions',
    icon: Calculator,
    status: 'coming-soon',
    featured: false,
  },
  {
    id: 'capital-gains-calculator',
    name: 'Capital Gains Tax Calculator',
    description: 'Calculate potential capital gains tax on investments and property sales',
    icon: Calculator,
    status: 'coming-soon',
  }
];

const TaxCalculatorsIndex = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Tax</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Tax Calculators</h1>
            <p className="text-xl text-white/90">
              Tools to help you estimate tax liabilities and plan your tax strategy
            </p>
          </div>
        </div>
      </div>

      {/* Calculators List */}
      <div className="container py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">Tools to help with tax planning and estimation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TAX_CALCULATORS.map((calculator) => (
            <Card key={calculator.id} className={`overflow-hidden ${calculator.featured ? 'border-blue-200 shadow-md' : ''}`}>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-2">
                  <calculator.icon className="h-6 w-6 text-finance-primary" />
                </div>
                <CardTitle className="text-xl flex items-center">
                  {calculator.name}
                  {calculator.featured && (
                    <span className="ml-2 bg-finance-accent/20 text-finance-accent text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-1">
                <div className="flex justify-end w-full">
                  {calculator.status === 'active' ? (
                    <Button asChild className="hover:bg-accent">
                      <Link to={`/calculators/tax/${calculator.id}`}>
                        Use Calculator <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                  ) : (
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center bg-white p-8 rounded-lg border shadow-sm">
          <div className="inline-block bg-blue-50 px-6 py-3 rounded-full text-sm font-medium text-blue-700 mb-4">
            More calculators are being developed
          </div>
          <h2 className="text-2xl font-semibold mb-2">Tax Calculators Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're currently developing a suite of tax calculators to help you plan your tax strategy and estimate your tax liabilities.
            Check back soon for these useful tools.
          </p>
          <Link to="/contact">
            <Button variant="outline">
              Suggest a Calculator
            </Button>
          </Link>
        </div>
      </div>

      {/* Tax Info Section */}
      <div className="bg-white py-12 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Tax Planning Essentials</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="mb-4">
                Effective tax planning can help you:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <p className="font-medium">Reduce your tax liability</p>
                  <p className="text-muted-foreground">Identify deductions, credits, and strategies to minimize taxes legally.</p>
                </li>
                <li>
                  <p className="font-medium">Prepare for tax payments</p>
                  <p className="text-muted-foreground">Estimate your tax bill in advance to avoid surprises at tax time.</p>
                </li>
                <li>
                  <p className="font-medium">Make informed decisions</p>
                  <p className="text-muted-foreground">Understand the tax implications of investment, retirement, and income choices.</p>
                </li>
                <li>
                  <p className="font-medium">Plan for life changes</p>
                  <p className="text-muted-foreground">Anticipate how marriage, children, retirement, or property sales affect your taxes.</p>
                </li>
              </ul>
              <div className="mt-4 px-4 py-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p><strong>Note:</strong> These calculators provide estimates for informational purposes only. For personalized tax advice, consult with a qualified tax professional.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaxCalculatorsIndex;
