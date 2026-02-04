
import Layout from '@/components/layout/Layout';
import BmiCalculator from '@/components/calculators/health/BmiCalculator';
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const BmiCalculatorPage = () => {
  return (
    <Layout>
      <Helmet>
            <title>BMI Calculator | Body Mass Index Calculator | Fiscal Compass</title>
            <meta name="description" content="Calculate your BMI and see where you fall on the weight classification scale. Understand limitations of BMI measurement." />
      </Helmet>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-sm mb-5 text-muted-foreground">
            <Link to="/calculators" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/calculators/health" className="hover:text-primary">Health Calculators</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>BMI Calculator</span>
          </div>
          
          <BmiCalculator />
          
          <div className="mt-12 bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Understanding BMI</h2>
            
            <div className="space-y-4">
              <p>
                Body Mass Index (BMI) is a numerical value calculated from your weight and height. 
                It provides a simple way to categorize individuals as underweight, normal weight, 
                overweight, or obese based on tissue mass (muscle, fat, and bone).
              </p>
              
              <h3 className="text-lg font-medium mt-4">BMI Categories for Adults:</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left">BMI Range</th>
                      <th className="border px-4 py-2 text-left">Category</th>
                      <th className="border px-4 py-2 text-left">Health Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Below 18.5</td>
                      <td className="border px-4 py-2">Underweight</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Moderate</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-2">18.5 – 24.9</td>
                      <td className="border px-4 py-2">Normal weight</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Low</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">25.0 – 29.9</td>
                      <td className="border px-4 py-2">Overweight</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Increased</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-2">30.0 – 34.9</td>
                      <td className="border px-4 py-2">Obesity (Class 1)</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">High</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">35.0 – 39.9</td>
                      <td className="border px-4 py-2">Obesity (Class 2)</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Very High</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-4 py-2">40.0 and above</td>
                      <td className="border px-4 py-2">Obesity (Class 3)</td>
                      <td className="border px-4 py-2">
                        <span className="px-2 py-1 rounded-full bg-red-200 text-red-800 text-xs">Extremely High</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Limitations of BMI:</h3>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Doesn't account for body composition</span> - 
                  BMI doesn't distinguish between muscle and fat, potentially misclassifying muscular individuals.
                </li>
                <li>
                  <span className="font-medium">Doesn't consider fat distribution</span> - 
                  Where you carry fat (especially around the abdomen) can be more important than your BMI.
                </li>
                <li>
                  <span className="font-medium">May not be applicable to all ethnic groups</span> - 
                  Different ethnic groups may have different associations between BMI and health risks.
                </li>
                <li>
                  <span className="font-medium">Not suitable for children, pregnant women, or elderly</span> - 
                  Special BMI considerations apply to these groups.
                </li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-800">Note:</h4>
                <p className="text-blue-700">
                  BMI is a screening tool, not a diagnostic one. It should be used alongside other health assessments. 
                  For a more complete health evaluation, consult with healthcare professionals who can consider other 
                  factors like waist circumference, body composition, blood pressure, and blood glucose levels.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Try our other health calculators</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/calculators/health/body-fat-calculator" className="inline-flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    Body Fat Calculator
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link to="/calculators/health/calorie-calculator" className="inline-flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    Calorie Calculator
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

export default BmiCalculatorPage;
