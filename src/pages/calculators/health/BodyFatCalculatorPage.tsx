
import Layout from '@/components/layout/Layout';
import BodyFatCalculator from '@/components/calculators/health/BodyFatCalculator';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const BodyFatCalculatorPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-sm mb-5 text-muted-foreground">
            <Link to="/calculators" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/calculators/health" className="hover:text-primary">Health Calculators</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Body Fat Calculator</span>
          </div>
          
          <BodyFatCalculator />
          
          <div className="mt-12 bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Understanding Body Fat Percentage</h2>
            
            <div className="space-y-4">
              <p>
                Body fat percentage is the total mass of fat divided by total body mass. It's a more precise 
                measure of fitness than BMI because it distinguishes between fat and lean mass.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Importance of Body Fat Percentage:</h3>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Health Assessment</h4>
                  <p className="text-muted-foreground">
                    Body fat percentage helps assess health risks more accurately than weight alone. 
                    Even people with a "normal" weight can have unhealthy levels of body fat.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Fitness Tracking</h4>
                  <p className="text-muted-foreground">
                    Tracking body fat percentage is useful for athletes and fitness enthusiasts to monitor 
                    changes in body composition during training programs.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Metabolic Health</h4>
                  <p className="text-muted-foreground">
                    Body fat, especially visceral fat (fat around organs), affects hormone function and 
                    metabolism. Maintaining healthy levels can reduce risks of metabolic diseases.
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Measurement Methods:</h3>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Navy Method (Used in this calculator)</h4>
                  <p className="text-muted-foreground">
                    Uses circumference measurements from specific body parts and mathematical formulas. 
                    Reasonably accurate and accessible without special equipment.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">BMI-based Estimation</h4>
                  <p className="text-muted-foreground">
                    Uses BMI, age, and gender to estimate body fat. Less accurate but requires minimal measurements.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Professional Methods (More Accurate)</h4>
                  <p className="text-muted-foreground">
                    DEXA scans, hydrostatic weighing, air displacement plethysmography (Bod Pod), and 
                    bioelectrical impedance analysis provide more accurate measurements but require specialized equipment.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-800">Note:</h4>
                <p className="text-blue-700">
                  This calculator provides an estimate only. Individual factors like body type, muscle distribution, 
                  and measurement accuracy can affect results. For medical decisions, consult with healthcare professionals 
                  and consider more precise measurement methods.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Related Calculators</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/calculators/health/bmi-calculator" className="inline-flex items-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    BMI Calculator
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

export default BodyFatCalculatorPage;
