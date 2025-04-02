
import { useState } from 'react';
import { ArrowRight, Calculator, ChevronRight, DollarSign, Percent } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const RoiCalculatorPage = () => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [returnAmount, setReturnAmount] = useState(15000);
  const [timeframe, setTimeframe] = useState(1); // in years
  
  // Calculate ROI metrics
  const calculateROI = () => {
    const netProfit = returnAmount - initialInvestment;
    const roi = (netProfit / initialInvestment) * 100;
    const annualizedROI = Math.pow(1 + (roi / 100), 1 / timeframe) - 1;
    
    return {
      netProfit,
      roi,
      annualizedROI: annualizedROI * 100
    };
  };
  
  const results = calculateROI();
  
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
              <Link to="/calculators/business" className="hover:text-white">Business</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>ROI Calculator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Return on Investment (ROI) Calculator</h1>
            <p className="text-xl text-white/90">
              Calculate and analyze the potential return on your business investments
            </p>
          </div>
        </div>
      </div>
      
      {/* Calculator Section */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="basic">Basic ROI</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Slider 
                          id="initialInvestment"
                          value={[initialInvestment]} 
                          onValueChange={(value) => setInitialInvestment(value[0])}
                          min={1000}
                          max={100000}
                          step={1000}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={initialInvestment} 
                          onChange={(e) => setInitialInvestment(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="returnAmount">Expected Return ($)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Slider 
                          id="returnAmount"
                          value={[returnAmount]} 
                          onValueChange={(value) => setReturnAmount(value[0])}
                          min={1000}
                          max={200000}
                          step={1000}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={returnAmount} 
                          onChange={(e) => setReturnAmount(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="timeframe">Investment Timeframe (years)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Percent className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Slider 
                          id="timeframe"
                          value={[timeframe]} 
                          onValueChange={(value) => setTimeframe(value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={timeframe} 
                          onChange={(e) => setTimeframe(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="p-6 bg-gray-50 rounded-lg border border-dashed text-center">
                    <p className="text-muted-foreground">
                      Advanced ROI options coming soon! This will include risk assessment, inflation adjustment, and more detailed projections.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="mt-6">
              <Card className="p-6 bg-blue-50/50">
                <h3 className="text-lg font-medium mb-4">How to Use This Calculator</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Enter your initial investment amount</li>
                  <li>Input the expected total return amount (total money you expect to get back)</li>
                  <li>Set the timeframe in years for your investment</li>
                  <li>The calculator will show both simple ROI and annualized ROI for comparison</li>
                </ul>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <Card className="p-6 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Results</h3>
                <Calculator className="h-5 w-5 text-finance-primary" />
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Initial Investment</p>
                  <p className="text-2xl font-semibold">${initialInvestment.toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-finance-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                  <p className="text-2xl font-semibold">${returnAmount.toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-finance-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                  <p className="text-2xl font-semibold text-finance-primary">${results.netProfit.toLocaleString()}</p>
                </div>
                
                <div className="p-5 bg-finance-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Simple ROI</p>
                  <p className="text-3xl font-bold text-finance-primary">{results.roi.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Total return on investment</p>
                </div>
                
                <div className="p-5 bg-finance-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Annualized ROI</p>
                  <p className="text-3xl font-bold text-finance-accent">{results.annualizedROI.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Average yearly return</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/calculators/business">
                  <Button variant="outline" className="w-full">
                    Explore More Business Calculators
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Explanation Section */}
      <div className="bg-white py-12 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Understanding ROI</h2>
            <div className="bg-white rounded-lg p-6 border space-y-4">
              <p>
                Return on Investment (ROI) is a performance measure used to evaluate the efficiency of an investment or compare the efficiency of different investments. ROI is calculated by dividing the net profit (or loss) of an investment by its initial cost.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Simple ROI Formula:</p>
                <p className="bg-gray-100 p-2 rounded mt-1 font-mono text-sm">ROI = (Net Profit / Initial Investment) × 100%</p>
              </div>
              <p>
                While simple ROI is useful for quick comparisons, it doesn't account for the time value of money. For investments spanning multiple years, annualized ROI provides a more accurate measure of yearly performance.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Annualized ROI Formula:</p>
                <p className="bg-gray-100 p-2 rounded mt-1 font-mono text-sm">Annualized ROI = ((1 + ROI)^(1/n) - 1) × 100%</p>
                <p className="text-sm text-muted-foreground mt-1">where n is the number of years</p>
              </div>
              <div className="mt-4 px-4 py-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p><strong>Note:</strong> ROI calculations are estimates based on the information provided. Actual returns may vary due to market conditions, unforeseen expenses, and other factors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoiCalculatorPage;
