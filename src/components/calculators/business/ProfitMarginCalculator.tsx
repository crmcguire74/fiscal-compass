
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ProfitMarginCalculator = () => {
  const [revenue, setRevenue] = useState<number>(100000);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState<number>(60000);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(20000);
  const [taxes, setTaxes] = useState<number>(5000);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [operatingProfit, setOperatingProfit] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [grossMargin, setGrossMargin] = useState<number>(0);
  const [operatingMargin, setOperatingMargin] = useState<number>(0);
  const [netMargin, setNetMargin] = useState<number>(0);
  
  const [pieData, setPieData] = useState<any[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    if (revenue <= 0) {
      return;
    }
    
    calculateProfitMargins();
  }, [revenue, costOfGoodsSold, operatingExpenses, taxes, otherExpenses]);
  
  const calculateProfitMargins = () => {
    const gross = revenue - costOfGoodsSold;
    const operating = gross - operatingExpenses;
    const net = operating - taxes - otherExpenses;
    
    setGrossProfit(gross);
    setOperatingProfit(operating);
    setNetProfit(net);
    
    setGrossMargin((gross / revenue) * 100);
    setOperatingMargin((operating / revenue) * 100);
    setNetMargin((net / revenue) * 100);
    
    // Update chart data
    updateChartData(gross, operatingExpenses, taxes, otherExpenses, net);
  };
  
  const updateChartData = (
    gross: number, 
    opEx: number, 
    tax: number, 
    other: number, 
    net: number
  ) => {
    // For the revenue breakdown pie chart
    const data = [
      { name: 'COGS', value: costOfGoodsSold },
      { name: 'Operating Expenses', value: opEx },
      { name: 'Taxes', value: tax },
      { name: 'Other Expenses', value: other },
      { name: 'Net Profit', value: net > 0 ? net : 0 },
    ];
    
    setPieData(data);
    
    // For the cost breakdown pie chart
    const costs = [
      { name: 'COGS', value: costOfGoodsSold },
      { name: 'Operating Expenses', value: opEx },
      { name: 'Taxes', value: tax },
      { name: 'Other Expenses', value: other },
    ];
    
    setCostBreakdown(costs);
  };
  
  const handleCalculate = () => {
    calculateProfitMargins();
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPercentage = (value: number): string => {
    return value.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit Margin Calculator</CardTitle>
          <CardDescription>
            Calculate gross, operating, and net profit margins to evaluate your business's profitability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="revenue">Revenue (Sales)</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Total income from sales before any expenses</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="costOfGoodsSold">Cost of Goods Sold (COGS)</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Direct costs attributable to the production of goods sold (materials, labor, etc.)</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="costOfGoodsSold"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={costOfGoodsSold}
                    onChange={(e) => setCostOfGoodsSold(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="operatingExpenses">Operating Expenses</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Expenses related to business operations (rent, utilities, salaries, etc.)</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="operatingExpenses"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="taxes">Taxes</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Business income taxes and other tax expenses</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="taxes"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={taxes}
                    onChange={(e) => setTaxes(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otherExpenses">Other Expenses</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Interest, one-time expenses, non-operating costs, etc.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="otherExpenses"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="mt-6 w-full md:w-auto" 
            onClick={handleCalculate}
          >
            Calculate Profit Margins
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit Margin Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Gross Profit Margin</h3>
              <p className="text-3xl font-bold text-primary">{formatPercentage(grossMargin)}</p>
              <div className="text-sm mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Profit:</span>
                  <span className="font-medium">{formatCurrency(grossProfit)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-medium">{formatCurrency(revenue)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Operating Profit Margin</h3>
              <p className="text-3xl font-bold text-primary">{formatPercentage(operatingMargin)}</p>
              <div className="text-sm mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operating Profit:</span>
                  <span className="font-medium">{formatCurrency(operatingProfit)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-medium">{formatCurrency(revenue)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Net Profit Margin</h3>
              <p className="text-3xl font-bold text-primary">{formatPercentage(netMargin)}</p>
              <div className="text-sm mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Profit:</span>
                  <span className="font-medium">{formatCurrency(netProfit)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-medium">{formatCurrency(revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {revenue <= 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-medium">Error: Invalid revenue amount</p>
              <p className="text-sm mt-1">Revenue must be greater than zero to calculate profit margins.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Profit Margin Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
              <TabsTrigger value="costs">Cost Structure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                This chart shows how your revenue is distributed across costs and profit
              </p>
            </TabsContent>
            
            <TabsContent value="costs" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                This chart shows the breakdown of your total costs by category
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Profit Margins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Gross Profit Margin</h3>
              <p className="text-muted-foreground text-sm">
                Gross profit margin measures the efficiency of your production and pricing. It is calculated as (Revenue - Cost of Goods Sold) / Revenue.
                A higher gross margin indicates better efficiency in converting raw materials into income.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Operating Profit Margin</h3>
              <p className="text-muted-foreground text-sm">
                Operating profit margin measures the profitability of your core business operations. It is calculated as (Gross Profit - Operating Expenses) / Revenue.
                This shows how well you manage your operating costs.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Net Profit Margin</h3>
              <p className="text-muted-foreground text-sm">
                Net profit margin is the bottom line percentage of profit generated from total revenue. It is calculated as Net Profit / Revenue.
                This is the final profitability metric after all expenses are considered.
              </p>
            </div>
            
            <div className="pt-2">
              <h3 className="font-medium mb-1">Industry Comparisons</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Profit margins vary widely by industry. For reference:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Retail: Typically 2-5% net profit margin</li>
                <li>Food Service: Often 3-9% net profit margin</li>
                <li>Software/Technology: Can reach 15-25% net profit margin</li>
                <li>Manufacturing: Usually 5-12% net profit margin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitMarginCalculator;
