
import Layout from '@/components/layout/Layout';
import RetirementCalculator from '@/components/calculators/retirement/RetirementCalculator';

const RetirementSavingsPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <RetirementCalculator />
          
          <div className="mt-12 bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Understanding Retirement Planning</h2>
            
            <div className="space-y-4">
              <p>
                Planning for retirement is one of the most important financial steps you can take. This calculator helps you 
                estimate how your retirement savings will grow over time and how much income you might have during retirement.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key retirement planning factors:</h3>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Start Early</h4>
                  <p className="text-muted-foreground">
                    The earlier you begin saving, the more time your money has to grow through compounding.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Consistent Contributions</h4>
                  <p className="text-muted-foreground">
                    Regular contributions to your retirement accounts, even small ones, add up significantly over time.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Investment Returns</h4>
                  <p className="text-muted-foreground">
                    Higher returns can dramatically increase your savings, but typically come with higher risk.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Withdrawal Rate</h4>
                  <p className="text-muted-foreground">
                    The 4% rule is a common guideline, suggesting you can withdraw 4% of your retirement savings annually 
                    with minimal risk of running out of money.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Inflation</h4>
                  <p className="text-muted-foreground">
                    Inflation erodes purchasing power over time, meaning you'll need more money in the future to maintain 
                    your standard of living.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Social Security</h4>
                  <p className="text-muted-foreground">
                    Social Security benefits provide an important income source in retirement, but typically replace only 
                    about 40% of pre-retirement income.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RetirementSavingsPage;
