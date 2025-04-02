
import Layout from '@/components/layout/Layout';
import MortgagePaymentCalculator from '@/components/calculators/mortgage/MortgagePaymentCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MortgagePaymentPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/calculators/mortgage" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Mortgage Calculators
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto mb-6">
          <MortgagePaymentCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Mortgage Payments</h2>
          <p className="mb-4">
            Understanding your mortgage payment is crucial for homeownership planning. Your monthly payment typically includes principal, interest, property taxes, and homeowners insurance (PITI).
          </p>
          <h3 className="text-lg font-medium mb-2">Key Factors That Affect Your Mortgage Payment:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Loan Amount:</strong> The total amount you're borrowing (purchase price minus down payment).</li>
            <li><strong>Interest Rate:</strong> The percentage charged by your lender for borrowing the money.</li>
            <li><strong>Loan Term:</strong> The length of time you have to repay the loan (typically 15 or 30 years).</li>
            <li><strong>Property Taxes:</strong> Annual taxes assessed by your local government on your property.</li>
            <li><strong>Homeowners Insurance:</strong> Insurance that protects your home against damage and liability.</li>
            <li><strong>Private Mortgage Insurance (PMI):</strong> Additional insurance required when your down payment is less than 20%.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-2">Fixed vs. Adjustable Rate Mortgages:</h3>
          <div className="mb-4">
            <h4 className="text-base font-medium mb-1">Fixed-Rate Mortgage</h4>
            <p className="mb-2">With a fixed-rate mortgage, your interest rate remains the same for the entire term of the loan. This means:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Predictable monthly principal and interest payments</li>
              <li>Protection from rising interest rates</li>
              <li>Typically higher initial interest rate than ARMs</li>
              <li>Best for homeowners who plan to stay in their home long-term</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <h4 className="text-base font-medium mb-1">Adjustable-Rate Mortgage (ARM)</h4>
            <p className="mb-2">ARMs have an interest rate that changes periodically based on market conditions. They are typically described as X/Y ARMs, where:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li><strong>X</strong> = The initial fixed-rate period (in years)</li>
              <li><strong>Y</strong> = How often the rate adjusts after the fixed period (in years)</li>
            </ul>
            
            <h5 className="text-sm font-medium">Common ARM Types:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-sm">5/1 ARM</h6>
                <p className="text-xs">Fixed rate for the first 5 years, then adjusts annually. Typically offers lower initial rates than 30-year fixed mortgages, making it attractive for homeowners who plan to sell or refinance within 5 years.</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-sm">7/1 ARM</h6>
                <p className="text-xs">Fixed rate for the first 7 years, then adjusts annually. Provides a longer period of payment stability while still offering rates typically lower than 30-year fixed mortgages.</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-sm">10/1 ARM</h6>
                <p className="text-xs">Fixed rate for the first 10 years, then adjusts annually. Good middle ground between shorter ARMs and 30-year fixed mortgages, with rates typically lower than fixed but higher than 5/1 ARMs.</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h6 className="font-medium text-sm">3/1 ARM</h6>
                <p className="text-xs">Fixed rate for the first 3 years, then adjusts annually. Offers very low initial rates but with greater risk of significant payment increases after the initial period.</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium mt-3">Key ARM Terms:</h5>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li><strong>Initial Rate:</strong> The interest rate during the fixed-rate period.</li>
              <li><strong>Adjustment Period:</strong> How often the rate changes after the fixed period.</li>
              <li><strong>Index:</strong> The benchmark interest rate that your ARM is tied to (e.g., LIBOR, SOFR).</li>
              <li><strong>Margin:</strong> A fixed percentage that's added to the index to determine your new rate.</li>
              <li><strong>Rate Caps:</strong> Limits on how much your rate can increase, including:
                <ul className="list-disc pl-6 mt-1">
                  <li><strong>Initial adjustment cap:</strong> Maximum rate increase at first adjustment</li>
                  <li><strong>Periodic adjustment cap:</strong> Maximum rate increase for each subsequent adjustment</li>
                  <li><strong>Lifetime cap:</strong> Maximum rate increase over the life of the loan</li>
                </ul>
              </li>
            </ul>
            
            <div className="bg-amber-50 p-2 rounded mt-3 text-sm">
              <strong>When an ARM might be right for you:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>You plan to sell or refinance before the fixed-rate period ends</li>
                <li>You expect your income to increase significantly</li>
                <li>You believe interest rates will decrease in the future</li>
                <li>You want to qualify for a larger loan amount</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-2">How to Use This Calculator:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter the home price and your planned down payment.</li>
            <li>Select your loan type (Fixed or ARM).</li>
            <li>For Fixed-rate mortgages, enter your interest rate.</li>
            <li>For ARMs, select the type (e.g., 5/1) and enter the initial rate, adjustment rate, and rate cap.</li>
            <li>Select your loan term (typically 15 or 30 years).</li>
            <li>Add your estimated property tax rate and annual homeowners insurance.</li>
            <li>Specify if you'll need private mortgage insurance (PMI).</li>
            <li>Review the calculated monthly payment breakdown and amortization schedule.</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default MortgagePaymentPage;
