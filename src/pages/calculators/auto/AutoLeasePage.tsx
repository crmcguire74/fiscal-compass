import AutoLeaseCalculator from '@/components/calculators/auto/AutoLeaseCalculator';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Car, Calculator, PercentIcon, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AutoLeasePage = () => {
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
          <AutoLeaseCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Understanding Auto Leases</h2>
          <p className="mb-4">
            An auto lease calculator helps estimate your monthly lease payment. Unlike a loan, a lease payment primarily 
            covers the vehicle's depreciation during the lease term, plus a finance charge (rent charge) based on the money factor.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Key Lease Terms:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>MSRP:</strong> Manufacturer's Suggested Retail Price. Used to calculate the residual value.</li>
            <li><strong>Negotiated Price:</strong> The price you agree to pay for the car (also called Capitalized Cost).</li>
            <li><strong>Lease Term:</strong> The duration of the lease in months (e.g., 36 months).</li>
            <li><strong>Money Factor:</strong> Represents the interest rate. Multiply by 2400 to get an approximate APR.</li>
            <li><strong>Residual Value:</strong> The estimated value of the car at the end of the lease, expressed as a percentage of MSRP.</li>
            <li><strong>Down Payment/Trade-in:</strong> Reduces the capitalized cost, lowering the depreciation amount.</li>
            <li><strong>Fees:</strong> Can include acquisition fees (paid upfront) and disposition fees (paid at lease end).</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <Car className="h-4 w-4 text-primary mr-1" />
                Capitalized Cost
              </h4>
              <p className="text-sm text-muted-foreground">
                The negotiated price of the vehicle plus any add-ons and fees that aren't paid upfront.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <PercentIcon className="h-4 w-4 text-primary mr-1" />
                Residual Value
              </h4>
              <p className="text-sm text-muted-foreground">
                The estimated value of the vehicle at the end of the lease. Higher residual values lead to lower monthly payments.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <Calculator className="h-4 w-4 text-primary mr-1" />
                Money Factor
              </h4>
              <p className="text-sm text-muted-foreground">
                Similar to an interest rate. Multiply by 2400 to convert to an approximate APR percentage.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <h4 className="text-base font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 text-blue-500 mr-1" />
              Important Lease Considerations
            </h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Mileage Limits:</strong> Most leases restrict annual mileage (typically 10,000-15,000). Exceeding this costs $0.15-$0.30 per mile.</li>
              <li><strong>Wear and Tear:</strong> You'll be charged for damage beyond "normal wear and tear."</li>
              <li><strong>Early Termination:</strong> Ending a lease early usually involves significant penalties.</li>
              <li><strong>Gap Insurance:</strong> Consider this to cover the difference between the car's value and the lease payoff if the car is totaled.</li>
              <li><strong>Purchase Option:</strong> Most leases allow you to buy the car at the end for the residual value plus fees.</li>
            </ul>
          </div>
          
          <p>
            Leasing typically results in lower monthly payments than financing the same car, but you don't own the vehicle at the end. 
            It's best suited for those who prefer driving newer vehicles every few years and don't mind never owning the car outright.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AutoLeasePage;
