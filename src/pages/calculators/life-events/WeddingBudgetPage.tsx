
import React from "react";
import Layout from "@/components/layout/Layout";
import WeddingBudgetCalculator from "@/components/calculators/life-events/WeddingBudgetCalculator";
import { Helmet } from "react-helmet-async";  // ADD THIS
import { Link } from "react-router-dom";
import { ChevronRight, Heart } from "lucide-react";

const WeddingBudgetPage = () => {
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
              <Link to="/calculators/life-events" className="hover:text-white">Life Events</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Wedding Budget</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Wedding Budget Calculator</h1>
            <p className="text-xl text-white/90">
              Plan your wedding budget by estimating costs for each category and tracking your expenses.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <WeddingBudgetCalculator />
      </div>
    </Layout>
  );
};

export default WeddingBudgetPage;
