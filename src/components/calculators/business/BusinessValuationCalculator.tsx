
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info, AlertCircle } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BusinessValuationCalculator = () => {
  // Financial inputs
  const [annualRevenue, setAnnualRevenue] = useState<number>(1000000);
  const [annualProfit, setAnnualProfit] = useState<number>(200000);
  const [netAssetValue, setNetAssetValue] = useState<number>(500000);
  const [cashFlow, setCashFlow] = useState<number>(250000);
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [discountRate, setDiscountRate] = useState<number>(15);
  
  // Industry and business characteristics
  const [industry, setIndustry] = useState<string>("retail");
  const [businessAge, setBusinessAge] = useState<number>(5);
  const [businessRisk, setBusinessRisk] = useState<string>("medium");
  
  // Valuation results
  const [revenueMultipleValue, setRevenueMultipleValue] = useState<number>(0);
  const [earningsMultipleValue, setEarningsMultipleValue] = useState<number>(0);
  const [assetValue, setAssetValue] = useState<number>(0);
  const [discountedCashFlowValue, setDiscountedCashFlowValue] = useState<number>(0);
  const [averageValue, setAverageValue] = useState<number>(0);
  const [valuationMethod, setValuationMethod] = useState<string>("all");
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Industry specific multipliers
  const industryMultipliers = {
    retail: { revenue: 0.5, earnings: 4 },
    manufacturing: { revenue: 0.8, earnings: 5 },
    service: { revenue: 0.6, earnings: 3 },
    technology: { revenue: 2, earnings: 10 },
    restaurant: { revenue: 0.4, earnings: 3 },
    healthcare: { revenue: 1, earnings: 6 },
    construction: { revenue: 0.5, earnings: 3.5 },
    professional: { revenue: 0.9, earnings: 4.5 },
    ecommerce: { revenue: 1.5, earnings: 8 },
    other: { revenue: 0.7, earnings: 4 }
  };
  
  // Risk adjustments
  const riskAdjustments = {
    low: 1.2,
    medium: 1.0,
    high: 0.8
  };
  
  // Age adjustments
  const getAgeAdjustment = (age: number): number => {
    if (age < 2) return 0.7;
    if (age < 5) return 0.9;
    if (age < 10) return 1.0;
    return 1.1;
  };
  
  useEffect(() => {
    calculateValuation();
  }, [
    annualRevenue, 
    annualProfit, 
    netAssetValue, 
    cashFlow, 
    growthRate, 
    discountRate, 
    industry, 
    businessAge, 
    businessRisk
  ]);
  
  const calculateValuation = () => {
    // Get multipliers and adjustments
    const multipliers = industryMultipliers[industry] || industryMultipliers.other;
    const riskAdjustment = riskAdjustments[businessRisk] || 1.0;
    const ageAdjustment = getAgeAdjustment(businessAge);
    
    // Revenue multiple method
    const revenueValue = annualRevenue * multipliers.revenue * riskAdjustment * ageAdjustment;
    setRevenueMultipleValue(revenueValue);
    
    // Earnings multiple method
    const earningsValue = annualProfit * multipliers.earnings * riskAdjustment * ageAdjustment;
    setEarningsMultipleValue(earningsValue);
    
    // Asset-based method
    setAssetValue(netAssetValue);
    
    // Discounted Cash Flow method (simplified)
    const dcfValue = calculateDCF(cashFlow, growthRate, discountRate);
    setDiscountedCashFlowValue(dcfValue);
    
    // Calculate average (depending on selected method)
    calculateAverageValue(revenueValue, earningsValue, netAssetValue, dcfValue);
    
    // Update chart data
    updateChartData(revenueValue, earningsValue, netAssetValue, dcfValue);
  };
  
  const calculateDCF = (currentCashFlow: number, growth: number, discount: number): number => {
    let totalValue = 0;
    const projectionYears = 5;
    
    // Project cash flows for 5 years
    for (let year = 1; year <= projectionYears; year++) {
      const projectedCashFlow = currentCashFlow * Math.pow(1 + growth / 100, year);
      const discountFactor = Math.pow(1 + discount / 100, year);
      totalValue += projectedCashFlow / discountFactor;
    }
    
    // Terminal value (Gordon Growth Model) - assuming growth stabilizes at half the growth rate
    const terminalGrowthRate = Math.min(growth / 2, 3); // Cap at 3%
    const yearFiveCashFlow = currentCashFlow * Math.pow(1 + growth / 100, projectionYears);
    const terminalValue = yearFiveCashFlow * (1 + terminalGrowthRate / 100) / (discount / 100 - terminalGrowthRate / 100);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discount / 100, projectionYears);
    
    return totalValue + discountedTerminalValue;
  };
  
  const calculateAverageValue = (revenue: number, earnings: number, asset: number, dcf: number) => {
    let sum = 0;
    let count = 0;
    
    switch (valuationMethod) {
      case "all":
        sum = revenue + earnings + asset + dcf;
        count = 4;
        break;
      case "revenue":
        setAverageValue(revenue);
        return;
      case "earnings":
        setAverageValue(earnings);
        return;
      case "asset":
        setAverageValue(asset);
        return;
      case "dcf":
        setAverageValue(dcf);
        return;
      case "market":
        sum = revenue + earnings;
        count = 2;
        break;
    }
    
    setAverageValue(sum / count);
  };
  
  const updateChartData = (revenue: number, earnings: number, asset: number, dcf: number) => {
    const data = [
      { name: 'Revenue Multiple', value: revenue },
      { name: 'Earnings Multiple', value: earnings },
      { name: 'Asset Value', value: asset },
      { name: 'DCF', value: dcf },
      { name: 'Average', value: averageValue }
    ];
    
    setChartData(data);
  };
  
  const handleValuationMethodChange = (value: string) => {
    setValuationMethod(value);
    calculateAverageValue(revenueMultipleValue, earningsMultipleValue, assetValue, discountedCashFlowValue);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Valuation Calculator</CardTitle>
          <CardDescription>
            Estimate the value of a business using multiple valuation methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="financial">Financial Data</TabsTrigger>
              <TabsTrigger value="business">Business Characteristics</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Total annual sales before expenses</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="annualRevenue"
                      type="number"
                      min="0"
                      step="10000"
                      className="pl-7"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="annualProfit">Annual Profit (EBITDA)</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Earnings Before Interest, Taxes, Depreciation, and Amortization</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="annualProfit"
                      type="number"
                      min="0"
                      step="10000"
                      className="pl-7"
                      value={annualProfit}
                      onChange={(e) => setAnnualProfit(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="netAssetValue">Net Asset Value</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Total assets minus total liabilities</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="netAssetValue"
                      type="number"
                      min="0"
                      step="10000"
                      className="pl-7"
                      value={netAssetValue}
                      onChange={(e) => setNetAssetValue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cashFlow">Annual Free Cash Flow</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Cash available after operational expenses and investments</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="cashFlow"
                      type="number"
                      min="0"
                      step="10000"
                      className="pl-7"
                      value={cashFlow}
                      onChange={(e) => setCashFlow(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="technology">Technology/Software</SelectItem>
                      <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="professional">Professional Services</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="businessAge">Years in Business</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Age of the business impacts valuation (older = more established)</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="businessAge"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={businessAge}
                    onChange={(e) => setBusinessAge(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Business Risk Level</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Higher risk businesses typically have lower valuations</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup value={businessRisk} onValueChange={setBusinessRisk} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="risk-low" />
                      <Label htmlFor="risk-low">Low Risk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="risk-medium" />
                      <Label htmlFor="risk-medium">Medium Risk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="risk-high" />
                      <Label htmlFor="risk-high">High Risk</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assumptions" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="growthRate">Annual Growth Rate (%)</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Expected annual growth rate for cash flows (used in DCF method)</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="growthRate"
                      type="number"
                      min="-10"
                      max="30"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discountRate">Discount Rate (%)</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Required rate of return (higher for riskier businesses)</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="discountRate"
                      type="number"
                      min="5"
                      max="30"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  These assumptions significantly impact valuation estimates, especially for the Discounted Cash Flow method. 
                  Consider consulting with a financial professional for accurate business valuations.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <Button className="mt-6 w-full md:w-auto" onClick={calculateValuation}>
            Calculate Business Valuation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Valuation Results</span>
            <Select value={valuationMethod} onValueChange={handleValuationMethodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods (average)</SelectItem>
                <SelectItem value="revenue">Revenue multiple only</SelectItem>
                <SelectItem value="earnings">Earnings multiple only</SelectItem>
                <SelectItem value="asset">Asset-based only</SelectItem>
                <SelectItem value="dcf">DCF only</SelectItem>
                <SelectItem value="market">Market-based (average)</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-1">Estimated Business Value</h3>
              <p className="text-4xl font-bold text-primary">{formatCurrency(averageValue)}</p>
              <p className="text-sm text-muted-foreground mt-2">Based on selected valuation method(s)</p>
            </div>
            
            <Separator />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue Multiple</h3>
                <p className="text-xl font-bold">{formatCurrency(revenueMultipleValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(revenueMultipleValue / annualRevenue).toFixed(2)}x Revenue
                </p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Earnings Multiple</h3>
                <p className="text-xl font-bold">{formatCurrency(earningsMultipleValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(earningsMultipleValue / annualProfit).toFixed(2)}x EBITDA
                </p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Asset-Based Value</h3>
                <p className="text-xl font-bold">{formatCurrency(assetValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on net assets
                </p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Discounted Cash Flow</h3>
                <p className="text-xl font-bold">{formatCurrency(discountedCashFlowValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  5-year projection with terminal value
                </p>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} 
                    tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`} 
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Business Valuation Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Revenue Multiple Method</h3>
            <p className="text-muted-foreground text-sm">
              Values a business based on a multiple of its annual revenue. This method is often used when a company isn't profitable yet but has strong revenue. Multiples vary by industry, typically ranging from 0.5x to 3x annual revenue.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Earnings Multiple Method</h3>
            <p className="text-muted-foreground text-sm">
              Uses a multiple of the company's EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization). This is a common method for profitable businesses, with multiples typically ranging from 3x to 12x EBITDA depending on industry and growth potential.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Asset-Based Method</h3>
            <p className="text-muted-foreground text-sm">
              Values a business based on its net assets (total assets minus total liabilities). This method works well for asset-heavy businesses but may undervalue companies with significant intangible assets or growth potential.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Discounted Cash Flow (DCF) Method</h3>
            <p className="text-muted-foreground text-sm">
              Projects future cash flows and discounts them back to present value using a discount rate that reflects risk. This method is considered more sophisticated and is particularly useful for businesses with predictable cash flows and growth rates.
            </p>
          </div>
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This calculator provides estimates only and should not replace professional business valuation services. Many factors can impact a business's value, including market conditions, competitive landscape, proprietary technology, customer concentration, and quality of management.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessValuationCalculator;
