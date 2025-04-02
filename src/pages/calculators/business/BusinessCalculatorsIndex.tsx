import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { ArrowRight, BarChart3, TrendingUp, DollarSign, Percent, PieChart, LineChart, BarChart, Calculator, Target, Briefcase, Search, ChevronRight } from "lucide-react";

const BusinessCalculatorsIndex = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCalculators, setFilteredCalculators] = useState([]);

  const calculators = [
    {
      id: "break-even-analysis",
      title: "Break-Even Analysis Calculator",
      description: "Calculate the point at which your business will become profitable by determining the required sales volume.",
      icon: <Target className="h-8 w-8 text-primary" />,
      path: "/calculators/business/break-even-analysis",
      tags: ["break even", "profit", "sales", "volume", "costs", "revenue"]
    },
    {
      id: "roi-calculator",
      title: "ROI Calculator",
      description: "Calculate the return on investment for business projects, marketing campaigns, or equipment purchases.",
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      path: "/calculators/business/roi-calculator",
      tags: ["roi", "return", "investment", "profit", "campaign"]
    },
    {
      id: "profit-margin-calculator",
      title: "Profit Margin Calculator",
      description: "Calculate gross, operating, and net profit margins to evaluate your business's profitability.",
      icon: <Percent className="h-8 w-8 text-primary" />,
      path: "/calculators/business/profit-margin-calculator", 
      tags: ["profit", "margin", "gross", "net", "operating", "income"]
    },
    {
      id: "business-valuation",
      title: "Business Valuation Calculator",
      description: "Estimate the value of your business using multiple methods including revenue multiples, earnings multiples, and DCF.",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      path: "/calculators/business/business-valuation", 
      tags: ["valuation", "worth", "sell", "value", "company", "price"]
    },
    {
      id: "startup-costs-calculator",
      title: "Startup Costs Calculator",
      description: "Estimate the initial costs needed to launch your business, including one-time and recurring expenses.",
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      path: "/calculators/business/startup-costs-calculator",
      comingSoon: true,
      tags: ["startup", "costs", "expenses", "launch", "new business"]
    },
    {
      id: "business-loan-calculator",
      title: "Business Loan Calculator",
      description: "Calculate monthly payments, total interest, and amortization schedule for business loans and financing.",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      path: "/calculators/business/business-loan-calculator",
      comingSoon: true,
      tags: ["loan", "finance", "interest", "payment", "debt"]
    },
    {
      id: "cash-flow-calculator",
      title: "Cash Flow Projection Calculator",
      description: "Forecast your business's cash flow to ensure you have enough money to cover expenses and investments.",
      icon: <LineChart className="h-8 w-8 text-primary" />,
      path: "/calculators/business/cash-flow-calculator",
      comingSoon: true,
      tags: ["cash flow", "projection", "forecast", "liquidity"]
    },
    {
      id: "customer-acquisition-calculator",
      title: "Customer Acquisition Cost Calculator",
      description: "Calculate the cost to acquire a new customer and compare it to customer lifetime value.",
      icon: <BarChart className="h-8 w-8 text-primary" />,
      path: "/calculators/business/customer-acquisition-calculator",
      comingSoon: true,
      tags: ["cac", "customer", "acquisition", "marketing", "cost"]
    },
    {
      id: "market-sizing-calculator", 
      title: "Market Sizing Calculator",
      description: "Estimate your potential market size and market share based on industry data and target audience.",
      icon: <PieChart className="h-8 w-8 text-primary" />,
      path: "/calculators/business/market-sizing-calculator",
      comingSoon: true,
      tags: ["market", "size", "audience", "share", "tam", "sam"]
    },
    {
      id: "pricing-strategy-calculator",
      title: "Pricing Strategy Calculator",
      description: "Determine optimal product pricing based on costs, competition, and target profit margins.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      path: "/calculators/business/pricing-strategy-calculator",
      comingSoon: true,
      tags: ["pricing", "price", "strategy", "margin", "competition"]
    }
  ];

  useEffect(() => {
    filterCalculators();
  }, [searchTerm]);

  const filterCalculators = () => {
    if (!searchTerm.trim()) {
      setFilteredCalculators(calculators);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = calculators.filter(calculator => {
      return (
        calculator.title.toLowerCase().includes(term) ||
        calculator.description.toLowerCase().includes(term) ||
        calculator.tags.some(tag => tag.toLowerCase().includes(term))
      );
    });

    setFilteredCalculators(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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
              <span>Business</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Business & Entrepreneur Calculators</h1>
            <p className="text-xl text-white/90">
              Tools to help business owners and entrepreneurs make data-driven decisions
            </p>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground text-lg mb-4">
            Use these calculators to analyze financial data, evaluate business opportunities, and optimize your operations.
          </p>
          
          {/* Search bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calculators..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {filteredCalculators.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCalculators.map((calculator) => (
              <Card key={calculator.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-2">
                    {calculator.icon}
                  </div>
                  <CardTitle>{calculator.title}</CardTitle>
                  <CardDescription>{calculator.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto justify-end">
                  {calculator.comingSoon ? (
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button asChild className="hover:bg-finance-accent">
                      <Link to={calculator.path}>
                        Use Calculator <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-lg font-medium">No calculators found matching "{searchTerm}"</p>
            <p className="text-muted-foreground mt-2">Try a different search term or browse all calculators</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
              Show All Calculators
            </Button>
          </div>
        )}
        
        <div className="mt-16 bg-muted/30 p-8 rounded-lg border shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Need a Custom Business Calculator?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We're constantly adding new business calculators to help entrepreneurs make data-driven decisions. 
              If you have a suggestion for a calculator that would help your business, let us know!
            </p>
            <Button variant="outline">
              Suggest a Calculator
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessCalculatorsIndex;
