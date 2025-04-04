import AutoLoanCalculator from '@/components/calculators/auto/AutoLoanCalculator';
import Layout from '@/components/layout/Layout';

const AutoLoanPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AutoLoanCalculator />
        </div>
        
        {/* TODO: Add relevant content sections if needed */}
        <div className="mt-12 space-y-6">
           <h2 className="text-2xl font-semibold">Understanding Auto Loans</h2>
           <p>
             An auto loan calculator helps you estimate your monthly payments based on the vehicle price, 
             down payment, trade-in value, loan term, and interest rate (APR). 
             Understanding these costs can help you budget effectively for your new vehicle.
           </p>
           <h3 className="text-xl font-semibold">Key Factors</h3>
           <ul className="list-disc pl-6 space-y-2">
             <li><strong>Vehicle Price:</strong> The sticker price of the car.</li>
             <li><strong>Down Payment:</strong> Cash you pay upfront, reducing the loan amount.</li>
             <li><strong>Trade-in Value:</strong> The value of your current vehicle applied towards the new one.</li>
             <li><strong>Sales Tax:</strong> Tax applied to the vehicle purchase (often after trade-in).</li>
             <li><strong>Loan Term:</strong> The length of the loan in months (e.g., 60 months = 5 years).</li>
             <li><strong>Interest Rate (APR):</strong> The annual percentage rate charged on the loan.</li>
           </ul>
           <p>
             A lower APR and shorter loan term generally result in less total interest paid, but higher monthly payments. 
             Conversely, a longer term lowers monthly payments but increases the total interest cost.
           </p>
        </div>
      </div>
    </Layout>
  );
};

export default AutoLoanPage;
