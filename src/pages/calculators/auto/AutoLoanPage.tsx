import AutoLoanCalculator from '@/components/calculators/auto/AutoLoanCalculator';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, DollarSign, Clock, PercentIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AutoLoanPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/calculators/auto" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Auto Calculators
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto mb-6">
          <AutoLoanCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Understanding Auto Loans</h2>
          <p className="mb-4">
            An auto loan calculator helps you estimate your monthly payments based on the vehicle price, 
            down payment, trade-in value, loan term, and interest rate (APR). 
            Understanding these costs can help you budget effectively for your new vehicle.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Key Factors That Affect Your Auto Loan:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Vehicle Price:</strong> The sticker price of the car.</li>
            <li><strong>Down Payment:</strong> Cash you pay upfront, reducing the loan amount.</li>
            <li><strong>Trade-in Value:</strong> The value of your current vehicle applied towards the new one.</li>
            <li><strong>Sales Tax:</strong> Tax applied to the vehicle purchase (often after trade-in).</li>
            <li><strong>Loan Term:</strong> The length of the loan in months (e.g., 60 months = 5 years).</li>
            <li><strong>Interest Rate (APR):</strong> The annual percentage rate charged on the loan.</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <DollarSign className="h-4 w-4 text-primary mr-1" />
                Loan Amount
              </h4>
              <p className="text-sm text-muted-foreground">
                The total amount you're borrowing after accounting for down payment and trade-in value.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 text-primary mr-1" />
                Loan Term
              </h4>
              <p className="text-sm text-muted-foreground">
                Shorter terms mean higher monthly payments but less interest over time. Common terms are 36, 48, 60, and 72 months.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <PercentIcon className="h-4 w-4 text-primary mr-1" />
                Interest Rate
              </h4>
              <p className="text-sm text-muted-foreground">
                Lower rates are better. Your credit score significantly impacts the rate you'll qualify for.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <h4 className="text-base font-medium mb-2">How to Get the Best Auto Loan</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Check your credit report</strong> before applying and address any issues.</li>
              <li><strong>Shop around</strong> for rates from multiple lenders including banks, credit unions, and online lenders.</li>
              <li><strong>Get pre-approved</strong> before visiting a dealership to have more negotiating power.</li>
              <li><strong>Consider a larger down payment</strong> to reduce the loan amount and possibly qualify for better rates.</li>
              <li><strong>Keep the loan term as short as comfortable</strong> to minimize interest costs.</li>
            </ul>
          </div>
          
          <p>
            A lower APR and shorter loan term generally result in less total interest paid, but higher monthly payments. 
            Conversely, a longer term lowers monthly payments but increases the total interest cost over the life of the loan.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AutoLoanPage;
