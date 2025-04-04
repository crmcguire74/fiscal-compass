import GasMaintenanceCalculator from '@/components/calculators/auto/GasMaintenanceCalculator';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Fuel, Wrench, Car, Calculator, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const GasMaintenancePage = () => {
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
          <GasMaintenanceCalculator />
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Understanding Vehicle Running Costs</h2>
          <p className="mb-4">
            Beyond the purchase price or monthly payment, owning a vehicle involves ongoing running costs. 
            This calculator helps estimate two major components: fuel and basic maintenance.
          </p>
          
          <h3 className="text-lg font-medium mb-2">Key Factors That Affect Your Operating Costs:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Annual Distance:</strong> How many miles you typically drive per year.</li>
            <li><strong>Fuel Efficiency (MPG):</strong> Your vehicle's miles per gallon rating.</li>
            <li><strong>Gas Price:</strong> The current cost per gallon in your area.</li>
            <li><strong>Maintenance Frequency & Cost:</strong> Estimates for regular services like oil changes and tire rotations.</li>
            <li><strong>Other Annual Costs:</strong> A placeholder for other predictable maintenance like inspections, brakes, tires, etc.</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <Fuel className="h-4 w-4 text-primary mr-1" />
                Fuel Costs
              </h4>
              <p className="text-sm text-muted-foreground">
                Calculated as: (Annual miles ÷ MPG) × Gas price per gallon.
                For example, driving 12,000 miles in a car that gets 25 MPG with gas at $3.50/gallon 
                would cost $1,680 annually.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center">
                <Wrench className="h-4 w-4 text-primary mr-1" />
                Maintenance Costs
              </h4>
              <p className="text-sm text-muted-foreground">
                Regular maintenance like oil changes, tire rotations, and fluid checks help prevent 
                larger repairs. These costs vary by vehicle but typically range from $500-$1,500 annually.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <h4 className="text-base font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
              Hidden Ownership Costs to Consider
            </h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Insurance:</strong> Typically $800-$1,500 annually depending on your vehicle, location, and driving history.</li>
              <li><strong>Registration & Taxes:</strong> Annual fees that vary by state and vehicle value.</li>
              <li><strong>Depreciation:</strong> New vehicles can lose 20-30% of their value in the first year.</li>
              <li><strong>Parking:</strong> Monthly garage fees in urban areas can add $1,200-$3,600 annually.</li>
              <li><strong>Major Repairs:</strong> Setting aside $500-$1,000 annually can help prepare for unexpected repairs.</li>
            </ul>
          </div>
          
          <p>
            Remember that maintenance costs can vary significantly based on vehicle age, make, model, and driving conditions. 
            This calculator provides a basic estimate for common items, but your actual costs may differ.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default GasMaintenancePage;
