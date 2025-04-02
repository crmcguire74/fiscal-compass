
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomeEquityCalculator from '@/components/calculators/real-estate/HomeEquityCalculator';

const HomeEquityCalculatorPage = () => {
  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="mb-6">
          <Link to="/calculators/mortgage">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mortgage Calculators
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Home className="h-6 w-6 text-finance-primary" />
                Home Equity After Closing Costs Calculator
              </h1>
              <p className="text-muted-foreground mt-1">
                Calculate your net proceeds after selling your home and paying all associated costs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <HomeEquityCalculator />
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-3">Understanding Home Selling Costs</h2>
            <p className="mb-4">
              When selling a home, many homeowners are surprised by the various costs that reduce their final proceeds. Understanding these costs in advance can help you make more informed decisions about pricing and timing your home sale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Common Selling Costs:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Realtor commissions typically range from 5-6% of the sale price</li>
                  <li>Closing costs include title insurance, escrow fees, and transfer taxes</li>
                  <li>Pre-sale repairs and improvements can significantly impact your bottom line</li>
                  <li>Home staging and professional photography costs</li>
                  <li>Potential overlap in housing costs if you buy before selling</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tips to Maximize Net Proceeds:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Consider negotiating realtor commission rates</li>
                  <li>Focus on high-ROI improvements before selling</li>
                  <li>Time your sale during seasonal market peaks when possible</li>
                  <li>Explore alternative selling options like FSBO or discount brokers</li>
                  <li>Request closing cost credits from buyers in strong seller markets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeEquityCalculatorPage;
