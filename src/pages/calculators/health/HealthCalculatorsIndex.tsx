
import { Calculator, Activity, Scale, Salad, ArrowRight, ChevronRight, Heart, HeartPulse } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from 'react-router-dom';

const HEALTH_CALCULATORS = [
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index based on height and weight',
    icon: Scale,
    status: 'active',
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using various methods',
    icon: HeartPulse,
    status: 'active',
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie Calculator',
    description: 'Determine your daily calorie needs based on activity level and goals',
    icon: Activity,
    status: 'active',
    featured: true,
  },
  {
    id: 'macro-calculator',
    name: 'Macronutrient Calculator',
    description: 'Calculate optimal protein, carb, and fat intake for your goals',
    icon: Salad,
    status: 'active',
  },
  {
    id: 'protein-calculator',
    name: 'Protein Calculator',
    description: 'Determine your daily protein requirements based on weight and activity',
    icon: Heart,
    status: 'active',
  },
];

const HealthCalculatorsIndex = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Health</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Health Calculators</h1>
            <p className="text-xl text-white/90">
              Nutrition and fitness tools to help monitor and improve your health
            </p>
          </div>
        </div>
      </div>
      
      {/* Calculators List */}
      <div className="container py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">Our collection of health and nutrition calculators</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTH_CALCULATORS.map((calculator) => (
            <Card key={calculator.id} className={`overflow-hidden ${calculator.featured ? 'border-blue-200 shadow-md' : ''}`}>
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-2">
                  <calculator.icon className="h-6 w-6 text-finance-primary" />
                </div>
                <CardTitle className="text-xl flex items-center">
                  {calculator.name}
                  {calculator.featured && (
                    <span className="ml-2 bg-finance-accent/20 text-finance-accent text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-1 flex justify-end">
                {calculator.status === 'active' ? (
                  <Link to={`/calculators/health/${calculator.id}`}>
                    <Button className="inline-flex">
                      Use Calculator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="inline-flex">
                    Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Additional Information */}
        <div className="mt-16 bg-white p-8 rounded-lg border shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">Why Monitor Your Health Metrics?</h2>
            <p className="text-muted-foreground mb-8">
              Understanding your body's metrics helps you make informed decisions about your health, fitness, and nutrition.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor changes in your body composition and nutritional needs over time
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Salad className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-medium mb-2">Optimize Nutrition</h3>
                <p className="text-muted-foreground text-sm">
                  Tailor your diet to meet your specific needs for energy and performance
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-medium mb-2">Set Realistic Goals</h3>
                <p className="text-muted-foreground text-sm">
                  Create achievable targets based on your unique body metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Info Section */}
      <div className="bg-white py-12 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Health Calculator Disclaimer</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="mb-4">
                Our health calculators provide estimates based on widely accepted formulas, but please keep in mind:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Results are estimates that may not account for individual variations</li>
                <li>These calculators are not a substitute for professional medical advice</li>
                <li>Consult with healthcare providers before making significant changes to diet or exercise</li>
                <li>If you have medical conditions, pregnant, or nursing, consult a healthcare professional</li>
              </ul>
              <div className="mt-4 px-4 py-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p><strong>Important:</strong> Our calculators are for informational purposes only. They do not replace the advice, diagnosis, or treatment from qualified health professionals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthCalculatorsIndex;
