import CostToCloseCalculator from '@/components/calculators/mortgage/CostToCloseCalculator';
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CostToClosePage = () => {
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
          <CostToCloseCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About Closing Costs</h2>
          <p className="mb-4">
            Closing costs are the various fees and expenses you'll need to pay when finalizing your home purchase. Understanding these costs is crucial for proper financial planning.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Common Closing Costs Include:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Loan Origination Fee:</strong> Charged by the lender for processing your loan (typically 0.5-1% of loan amount).</li>
            <li><strong>Appraisal Fee:</strong> Cost for a professional assessment of the home's value.</li>
            <li><strong>Home Inspection:</strong> Fee for a detailed inspection of the home's condition.</li>
            <li><strong>Title Insurance:</strong> Protects against issues with the property's title.</li>
            <li><strong>Escrow Fee:</strong> Charged for managing the closing of your home purchase.</li>
            <li><strong>Transfer Tax:</strong> Government fee for transferring the property title.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Required Reserves:</h3>
          <p className="mb-4">
            Lenders often require you to have reserves in your escrow account to cover future expenses such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Property Taxes:</strong> Annual taxes assessed on your property.</li>
            <li><strong>Homeowners Insurance:</strong> Annual premium for home insurance coverage.</li>
            <li><strong>HOA Dues:</strong> If applicable, fees for homeowners association.</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">How to Use This Calculator:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter the home's purchase price and your planned down payment.</li>
            <li>Select your state for accurate tax calculations.</li>
            <li>Input the loan origination fee percentage.</li>
            <li>Enter estimated costs for appraisal, inspection, title insurance, and escrow.</li>
            <li>Specify the number of months of reserves required by your lender.</li>
            <li>Review the total closing costs and funds needed to close.</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default CostToClosePage;
