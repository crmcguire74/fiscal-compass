import GasMaintenanceCalculator from '@/components/calculators/auto/GasMaintenanceCalculator';
import Layout from '@/components/layout/Layout';

const GasMaintenancePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GasMaintenanceCalculator />
        </div>
        
        <div className="mt-12 space-y-6">
           <h2 className="text-2xl font-semibold">Understanding Vehicle Running Costs</h2>
           <p>
             Beyond the purchase price or monthly payment, owning a vehicle involves ongoing running costs. 
             This calculator helps estimate two major components: fuel and basic maintenance.
           </p>
           <h3 className="text-xl font-semibold">Key Factors</h3>
           <ul className="list-disc pl-6 space-y-2">
             <li><strong>Annual Distance:</strong> How many miles you typically drive per year.</li>
             <li><strong>Fuel Efficiency (MPG):</strong> Your vehicle's miles per gallon rating.</li>
             <li><strong>Gas Price:</strong> The current cost per gallon in your area.</li>
             <li><strong>Maintenance Frequency & Cost:</strong> Estimates for regular services like oil changes and tire rotations.</li>
             <li><strong>Other Annual Costs:</strong> A placeholder for other predictable maintenance like inspections, brakes, tires, etc.</li>
           </ul>
           <p>
             Remember that maintenance costs can vary significantly based on vehicle age, make, model, and driving conditions. 
             This calculator provides a basic estimate for common items.
           </p>
        </div>
      </div>
    </Layout>
  );
};

export default GasMaintenancePage;
