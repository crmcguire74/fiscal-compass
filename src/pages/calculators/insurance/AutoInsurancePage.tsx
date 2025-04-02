
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Car, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AutoInsuranceCalculator from '@/components/calculators/insurance/AutoInsuranceCalculator';

const AutoInsurancePage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators/insurance" className="hover:text-white">Insurance</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Auto Insurance</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Auto Insurance Coverage Calculator</h1>
            <p className="text-xl text-white/90">
              Determine the right coverage levels and estimate your auto insurance premium
            </p>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 p-4 bg-muted rounded-lg">
            <Car className="h-8 w-8 text-primary mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Find Your Optimal Coverage</h2>
              <p className="text-muted-foreground">
                This calculator helps you estimate auto insurance costs based on your vehicle, driving history, and coverage needs.
              </p>
            </div>
          </div>
          
          <AutoInsuranceCalculator />
          
          <div className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Understanding Auto Insurance</h3>
            <div className="space-y-4">
              <p>
                Auto insurance provides financial protection against physical damage and bodily injury resulting from traffic accidents and against liability that could also arise. Here's what you need to know:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Liability coverage</span> - Protects you from costs if you injure someone or damage their property</li>
                <li><span className="font-medium">Collision coverage</span> - Pays for damage to your vehicle caused by a collision</li>
                <li><span className="font-medium">Comprehensive coverage</span> - Covers damage to your car from events like theft, fire, or natural disasters</li>
                <li><span className="font-medium">Uninsured/underinsured motorist</span> - Protects you if someone without insurance (or with insufficient insurance) hits you</li>
                <li><span className="font-medium">Medical payments</span> - Covers medical expenses for you and your passengers</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Note:</strong> This calculator provides estimates based on general rating factors. For personalized quotes, contact insurance providers directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutoInsurancePage;
