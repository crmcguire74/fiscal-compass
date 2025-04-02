
import Layout from '@/components/layout/Layout';
import CollegeSavingsCalculator from '@/components/calculators/education/CollegeSavingsCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const CollegeSavingsPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/calculators/education" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Education Calculators
          </Link>
        </div>
        
        <div className="max-w-5xl mx-auto mb-6">
          <Card>
            <CollegeSavingsCalculator />
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">About College Savings</h2>
          <p className="mb-4">
            Saving for college is one of the biggest financial challenges many families face. The cost of higher education 
            continues to rise faster than general inflation, making early planning essential.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Factors That Affect Your College Savings Plan:</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Child's Age:</strong> The earlier you start saving, the more time you have for compound growth.</li>
            <li><strong>Type of Institution:</strong> Costs vary dramatically between public, private, and community colleges.</li>
            <li><strong>Expected Returns:</strong> Your investment strategy affects how quickly your savings will grow.</li>
            <li><strong>Education Inflation:</strong> College costs typically rise faster than general inflation.</li>
            <li><strong>Monthly Contribution:</strong> Consistent contributions are key to building educational savings.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">Savings Options for College:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>529 Plans:</strong> Tax-advantaged savings plans designed specifically for education expenses.</li>
            <li><strong>Coverdell ESAs:</strong> Education savings accounts with tax-free growth for qualified expenses.</li>
            <li><strong>UGMA/UTMA Accounts:</strong> Custodial accounts that transfer to the child at age of majority.</li>
            <li><strong>Roth IRAs:</strong> Retirement accounts that allow penalty-free withdrawals for education.</li>
            <li><strong>Regular Investment Accounts:</strong> Flexible but without specific tax advantages for education.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CollegeSavingsPage;
