import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/utils/calculatorUtils';
import { ArrowRight, Calculator, PencilRuler, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  data: any[];
  salesTarget: number;
  profitTarget: number;
}

const BreakEvenAnalysisCalculator = () => {
  const [fixedCosts, setFixedCosts] = useState<number>(5000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(15);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number>(25);
  const [salesTarget, setSalesTarget] = useState<number>(1000);
  const [profitTarget, setProfitTarget] = useState<number>(10000);
  
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('input');
  
  const calculateBreakEven = () => {
    if (sellingPricePerUnit <= variableCostPerUnit) {
      toast({
        title: "Invalid Input",
        description: "Selling price must be greater than variable cost per unit.",
        variant: "destructive"
      });
      return;
    }
    
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
    
    const profitTargetUnits = (fixedCosts + profitTarget) / contributionMargin;
    
    const data = [];
    const maxUnits = Math.max(breakEvenUnits * 2, salesTarget, profitTargetUnits) * 1.1;
    
    const steps = 10;
    const unitStep = maxUnits / steps;
    
    for (let i = 0; i <= steps; i++) {
      const units = unitStep * i;
      const revenue = units * sellingPricePerUnit;
      const variableCosts = units * variableCostPerUnit;
      const totalCosts = fixedCosts + variableCosts;
      const profit = revenue - totalCosts;
      
      data.push({
        units: Math.round(units),
        revenue,
        totalCosts,
        profit,
        profitStatus: profit >= 0 ? 'Profit' : 'Loss'
      });
    }
    
    setResult({
      breakEvenUnits,
      breakEvenRevenue,
      data,
      salesTarget,
      profitTarget
    });
    
    setActiveTab('results');
  };
  
  const resetCalculator = () => {
    setFixedCosts(5000);
    setVariableCostPerUnit(15);
    setSellingPricePerUnit(25);
    setSalesTarget(1000);
    setProfitTarget(10000);
    setResult(null);
    setActiveTab('input');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateBreakEven();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Break-Even Analysis Calculator</CardTitle>
        <CardDescription>
          Calculate how many units you need to sell to cover your costs and start making a profit
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="input" className="flex items-center">
              <PencilRuler className="mr-2 h-4 w-4" />
              Input Data
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!result} className="flex items-center">
              <Calculator className="mr-2 h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="chart" disabled={!result} className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Break-Even Chart
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fixedCosts" className="text-base font-medium">
                    Total Fixed Costs
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="fixedCosts"
                      type="number"
                      min="0"
                      step="100"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    All costs that don't change regardless of how many units you produce
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="variableCostPerUnit" className="text-base font-medium">
                    Variable Cost Per Unit
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="variableCostPerUnit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={variableCostPerUnit}
                      onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cost that changes with each additional unit produced
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="sellingPricePerUnit" className="text-base font-medium">
                    Selling Price Per Unit
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="sellingPricePerUnit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={sellingPricePerUnit}
                      onChange={(e) => setSellingPricePerUnit(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    The price at which you sell each unit
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="salesTarget" className="text-base font-medium">
                    Sales Target (Units)
                  </Label>
                  <Input
                    id="salesTarget"
                    type="number"
                    min="0"
                    step="10"
                    value={salesTarget}
                    onChange={(e) => setSalesTarget(parseFloat(e.target.value) || 0)}
                    onKeyPress={handleKeyPress}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your target number of units to sell
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="profitTarget" className="text-base font-medium">
                    Profit Target ($)
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="profitTarget"
                      type="number"
                      min="0"
                      step="1000"
                      value={profitTarget}
                      onChange={(e) => setProfitTarget(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your target profit amount
                  </p>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Contribution Margin: ${(sellingPricePerUnit - variableCostPerUnit).toFixed(2)} per unit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contribution Margin Ratio: {((sellingPricePerUnit - variableCostPerUnit) / sellingPricePerUnit * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={calculateBreakEven} 
                className="w-full sm:w-auto bg-finance-primary hover:bg-finance-primary/90"
              >
                Calculate Break-Even Point
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={resetCalculator}
                className="w-full sm:w-auto"
              >
                Reset Calculator
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {result && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Break-Even Point</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Units:</span>
                          <span className="font-medium">{Math.ceil(result.breakEvenUnits).toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{formatCurrency(result.breakEvenRevenue)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Profit Target Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">To reach {formatCurrency(result.profitTarget)}:</span>
                          <span className="font-medium">
                            {Math.ceil((fixedCosts + profitTarget) / (sellingPricePerUnit - variableCostPerUnit)).toLocaleString()} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sales target profit:</span>
                          <span className="font-medium">
                            {formatCurrency(salesTarget * sellingPricePerUnit - (fixedCosts + salesTarget * variableCostPerUnit))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Key Insights</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      You need to sell <strong>{Math.ceil(result.breakEvenUnits).toLocaleString()} units</strong> to cover all costs.
                    </li>
                    <li>
                      Each unit contributes <strong>${(sellingPricePerUnit - variableCostPerUnit).toFixed(2)}</strong> toward covering fixed costs.
                    </li>
                    <li>
                      After selling {Math.ceil(result.breakEvenUnits).toLocaleString()} units, each additional unit generates <strong>${(sellingPricePerUnit - variableCostPerUnit).toFixed(2)}</strong> in profit.
                    </li>
                    {salesTarget < result.breakEvenUnits ? (
                      <li className="text-destructive">
                        Your sales target of {salesTarget.toLocaleString()} units is below the break-even point. You'll need to sell more to make a profit.
                      </li>
                    ) : (
                      <li className="text-success">
                        Your sales target of {salesTarget.toLocaleString()} units is above the break-even point, generating a profit of {formatCurrency(salesTarget * sellingPricePerUnit - (fixedCosts + salesTarget * variableCostPerUnit))}.
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => setActiveTab('chart')} 
                    className="w-full sm:w-auto flex items-center"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Break-Even Chart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('input')}
                    className="w-full sm:w-auto"
                  >
                    Edit Inputs
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="chart" className="space-y-6">
            {result && (
              <>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="units" label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                        labelFormatter={(value) => `Units: ${value}`}
                      />
                      <Legend />
                      <ReferenceLine
                        x={Math.ceil(result.breakEvenUnits)}
                        stroke="#000"
                        strokeDasharray="3 3"
                        label={{ value: 'Break-Even', position: 'top' }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue" 
                        fill="#4f46e5" 
                      />
                      <Bar 
                        dataKey="totalCosts" 
                        name="Total Costs" 
                        fill="#64748b" 
                      />
                      <Bar 
                        dataKey="profit" 
                        name="Profit/Loss" 
                        fill="#0ea5e9"
                        stroke="#0ea5e9"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Chart Analysis</h3>
                    <p className="text-muted-foreground">
                      The break-even point occurs where the revenue line crosses the total cost line, at approximately {Math.ceil(result.breakEvenUnits).toLocaleString()} units. 
                      After this point, you start generating profit.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Fixed Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">{formatCurrency(fixedCosts)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Contribution Margin</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">${(sellingPricePerUnit - variableCostPerUnit).toFixed(2)}/unit</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Break-Even Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">{formatCurrency(result.breakEvenRevenue)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('input')}
                    className="w-full sm:w-auto"
                  >
                    Edit Inputs
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('results')}
                    className="w-full sm:w-auto"
                  >
                    Back to Results
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex flex-col items-start">
        <h3 className="text-base font-medium mb-2">About Break-Even Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Break-even analysis helps you determine when your business will become profitable by calculating the point where total revenue equals total costs. 
          This calculation is crucial for business planning, pricing decisions, and evaluating new products or investments.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BreakEvenAnalysisCalculator;
