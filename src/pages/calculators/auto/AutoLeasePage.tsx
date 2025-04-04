import AutoLeaseCalculator from '@/components/calculators/auto/AutoLeaseCalculator';
import Layout from '@/components/layout/Layout';

const AutoLeasePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AutoLeaseCalculator />
        </div>
        
        {/* TODO: Add relevant content sections if needed */}
        <div className="mt-12 space-y-6">
           <h2 className="text-2xl font-semibold">Understanding Auto Leases</h2>
           <p>
             An auto lease calculator helps estimate your monthly lease payment. Unlike a loan, a lease payment primarily covers the vehicle's depreciation during the lease term, plus a finance charge (rent charge) based on the money factor.
           </p>
           <h3 className="text-xl font-semibold">Key Lease Terms</h3>
           <ul className="list-disc pl-6 space-y-2">
             <li><strong>MSRP:</strong> Manufacturer's Suggested Retail Price. Used to calculate the residual value.</li>
             <li><strong>Negotiated Price:</strong> The price you agree to pay for the car (also called Capitalized Cost).</li>
             <li><strong>Lease Term:</strong> The duration of the lease in months (e.g., 36 months).</li>
             <li><strong>Money Factor:</strong> Represents the interest rate. Multiply by 2400 to get an approximate APR.</li>
             <li><strong>Residual Value:</strong> The estimated value of the car at the end of the lease, expressed as a percentage of MSRP.</li>
             <li><strong>Down Payment/Trade-in:</strong> Reduces the capitalized cost, lowering the depreciation amount.</li>
             <li><strong>Fees:</strong> Can include acquisition fees (paid upfront) and disposition fees (paid at lease end).</li>
           </ul>
           <p>
             Leasing typically results in lower monthly payments than financing the same car, but you don't own the vehicle at the end. Be mindful of mileage limits and potential fees for excess wear and tear.
           </p>
        </div>
      </div>
    </Layout>
  );
};

export default AutoLeasePage;
