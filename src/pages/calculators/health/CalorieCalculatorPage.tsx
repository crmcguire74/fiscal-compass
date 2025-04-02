
import Layout from '@/components/layout/Layout';
import CalorieCalculator from '@/components/calculators/health/CalorieCalculator';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const CalorieCalculatorPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-sm mb-5 text-muted-foreground">
            <Link to="/calculators" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/calculators/health" className="hover:text-primary">Health Calculators</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Calorie Calculator</span>
          </div>
          
          <CalorieCalculator />
          
          <div className="mt-12 bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Understanding Daily Calorie Needs</h2>
            
            <div className="space-y-4">
              <p>
                Calculating your daily calorie needs is essential for managing weight, building muscle, or maintaining overall health. 
                This calculator uses two widely accepted formulas to estimate your calorie requirements.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Calculation Methods:</h3>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Harris-Benedict Equation (Revised)</h4>
                  <p className="text-muted-foreground">
                    Originally published in 1919 and revised in 1984, this equation calculates BMR based on total body weight. 
                    It tends to be more accurate for people with average body compositions.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Mifflin-St Jeor Equation</h4>
                  <p className="text-muted-foreground">
                    Developed in 1990, this more recent formula is considered slightly more accurate for most people, 
                    especially those who are overweight or obese.
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Key Terms:</h3>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Basal Metabolic Rate (BMR)</h4>
                  <p className="text-muted-foreground">
                    The number of calories your body needs to perform basic life-sustaining functions while at complete rest, 
                    such as breathing, cell production, blood circulation, and maintaining body temperature.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Maintenance Calories</h4>
                  <p className="text-muted-foreground">
                    The total number of calories needed to maintain your current weight when accounting for your activity level. 
                    This is calculated by multiplying your BMR by an activity factor.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Caloric Deficit/Surplus</h4>
                  <p className="text-muted-foreground">
                    Consuming fewer calories than your maintenance level creates a deficit resulting in weight loss. 
                    Consuming more creates a surplus resulting in weight gain.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-800">Important Note:</h4>
                <p className="text-blue-700">
                  This calculator provides an estimate only. Many factors affect your actual calorie needs, including genetics, 
                  medical conditions, and the thermic effect of food. For personalized guidance, consult with a healthcare 
                  professional or registered dietitian.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Looking for related calculators?</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/calculators/health/bmi-calculator" className="inline-flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    BMI Calculator
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link to="/calculators/health/body-fat-calculator" className="inline-flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    Body Fat Calculator
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalorieCalculatorPage;
