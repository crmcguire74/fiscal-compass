
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Info, Download, Plus, Minus } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/calculatorUtils";

const BABY_COST_CATEGORIES = [
  { id: "nursery", name: "Nursery & Furniture" },
  { id: "clothing", name: "Clothing & Accessories" },
  { id: "feeding", name: "Feeding Supplies" },
  { id: "diapers", name: "Diapers & Hygiene" },
  { id: "healthcare", name: "Healthcare" },
  { id: "childcare", name: "Childcare" },
  { id: "toys", name: "Toys & Entertainment" },
  { id: "travel", name: "Baby Travel Gear" },
  { id: "misc", name: "Miscellaneous" },
];

const DEFAULT_COSTS = {
  nursery: 1200,
  clothing: 600,
  feeding: 500,
  diapers: 900,
  healthcare: 1000,
  childcare: 12000,
  toys: 400,
  travel: 500,
  misc: 300,
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c"];

const BabyCostCalculator: React.FC = () => {
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [incomeReduction, setIncomeReduction] = useState(0);
  const [parentalLeave, setParentalLeave] = useState(12);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [customItems, setCustomItems] = useState<{ category: string; name: string; cost: number }[]>([]);

  // Calculate totals
  const oneTimeCosts = costs.nursery + costs.clothing + costs.travel + costs.toys;
  const monthlyCosts = costs.feeding + costs.diapers + costs.misc;
  const annualCosts = costs.healthcare + costs.childcare;
  const customCostsTotal = customItems.reduce((sum, item) => sum + item.cost, 0);
  
  const totalFirstYearCost = oneTimeCosts + (monthlyCosts * 12) + annualCosts + customCostsTotal;
  const incomeReductionAmount = (monthlyIncome * (incomeReduction / 100) * parentalLeave);
  const totalFinancialImpact = totalFirstYearCost + incomeReductionAmount;

  // Prepare chart data
  const pieChartData = [
    { name: "Nursery & Furniture", value: costs.nursery },
    { name: "Clothing & Accessories", value: costs.clothing },
    { name: "Feeding Supplies", value: costs.feeding * 12 },
    { name: "Diapers & Hygiene", value: costs.diapers * 12 },
    { name: "Healthcare", value: costs.healthcare },
    { name: "Childcare", value: costs.childcare },
    { name: "Toys & Entertainment", value: costs.toys },
    { name: "Baby Travel Gear", value: costs.travel },
    { name: "Miscellaneous", value: costs.misc * 12 },
    { name: "Income Reduction", value: incomeReductionAmount },
    ...customItems.map(item => ({ name: item.name, value: item.cost })),
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: "One-time", value: oneTimeCosts },
    { name: "Monthly (year)", value: monthlyCosts * 12 },
    { name: "Annual", value: annualCosts },
    { name: "Custom", value: customCostsTotal },
    { name: "Income Loss", value: incomeReductionAmount }
  ].filter(item => item.value > 0);

  // Add custom item
  const handleAddCustomItem = () => {
    setCustomItems([...customItems, { category: "misc", name: "New Item", cost: 100 }]);
  };

  // Remove custom item
  const handleRemoveCustomItem = (index: number) => {
    const newItems = [...customItems];
    newItems.splice(index, 1);
    setCustomItems(newItems);
  };

  // Update custom item
  const handleUpdateCustomItem = (index: number, field: string, value: string | number) => {
    const newItems = [...customItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setCustomItems(newItems);
  };

  // Handle costs change
  const handleCostChange = (category: string, value: number) => {
    setCosts({
      ...costs,
      [category]: value,
    });
  };

  // Export data
  const handleExportData = () => {
    const data = {
      costs,
      incomeReduction,
      parentalLeave,
      monthlyIncome,
      customItems,
      totalFirstYearCost,
      incomeReductionAmount,
      totalFinancialImpact,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baby-cost-calculation.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>First Year Baby Cost Estimate</span>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardTitle>
          <CardDescription>
            Estimate the first-year costs of having a baby, including essentials, ongoing expenses, and income reduction during parental leave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="expenses">
            <TabsList className="mb-6">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income Impact</TabsTrigger>
              <TabsTrigger value="custom">Custom Items</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">One-time Expenses</h3>
                  {["nursery", "clothing", "travel", "toys"].map((category) => (
                    <div key={category} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Label htmlFor={category}>
                            {BABY_COST_CATEGORIES.find(c => c.id === category)?.name}
                          </Label>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Estimated one-time cost for {BABY_COST_CATEGORIES.find(c => c.id === category)?.name.toLowerCase()}</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(costs[category])}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          id={category}
                          min={0}
                          max={category === "nursery" ? 3000 : category === "childcare" ? 24000 : 2000}
                          step={10}
                          value={[costs[category]]}
                          onValueChange={(value) => handleCostChange(category, value[0])}
                        />
                        <Input
                          type="number"
                          value={costs[category]}
                          onChange={(e) => handleCostChange(category, Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Monthly & Annual Expenses</h3>
                  {["feeding", "diapers", "misc"].map((category) => (
                    <div key={category} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Label htmlFor={category}>
                            {BABY_COST_CATEGORIES.find(c => c.id === category)?.name} (Monthly)
                          </Label>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Estimated monthly cost for {BABY_COST_CATEGORIES.find(c => c.id === category)?.name.toLowerCase()}</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(costs[category])}/mo</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          id={category}
                          min={0}
                          max={1000}
                          step={10}
                          value={[costs[category]]}
                          onValueChange={(value) => handleCostChange(category, value[0])}
                        />
                        <Input
                          type="number"
                          value={costs[category]}
                          onChange={(e) => handleCostChange(category, Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}

                  {["healthcare", "childcare"].map((category) => (
                    <div key={category} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Label htmlFor={category}>
                            {BABY_COST_CATEGORIES.find(c => c.id === category)?.name} (Annual)
                          </Label>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Estimated annual cost for {BABY_COST_CATEGORIES.find(c => c.id === category)?.name.toLowerCase()}</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(costs[category])}/yr</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          id={category}
                          min={0}
                          max={category === "childcare" ? 30000 : 5000}
                          step={100}
                          value={[costs[category]]}
                          onValueChange={(value) => handleCostChange(category, value[0])}
                        />
                        <Input
                          type="number"
                          value={costs[category]}
                          onChange={(e) => handleCostChange(category, Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Income Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="monthlyIncome" className="mb-2 block">Monthly Income Before Baby</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="incomeReduction">Income Reduction During Leave (%)</Label>
                        <span className="text-sm font-medium">{incomeReduction}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="incomeReduction"
                          min={0}
                          max={100}
                          step={5}
                          value={[incomeReduction]}
                          onValueChange={(value) => setIncomeReduction(value[0])}
                        />
                        <Input
                          type="number"
                          value={incomeReduction}
                          onChange={(e) => setIncomeReduction(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="parentalLeave">Parental Leave Duration (weeks)</Label>
                        <span className="text-sm font-medium">{parentalLeave} weeks</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="parentalLeave"
                          min={0}
                          max={52}
                          step={1}
                          value={[parentalLeave]}
                          onValueChange={(value) => setParentalLeave(value[0])}
                        />
                        <Input
                          type="number"
                          value={parentalLeave}
                          onChange={(e) => setParentalLeave(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Income Impact Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Monthly Income</span>
                      <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Leave Duration</span>
                      <span className="font-medium">{parentalLeave} weeks</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Income Loss Percentage</span>
                      <span className="font-medium">{incomeReduction}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Income Lost During Leave</span>
                      <span className="font-medium text-red-600">{formatCurrency(incomeReductionAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Custom Expenses</h3>
                  <Button onClick={handleAddCustomItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {customItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No custom items added yet. Click "Add Item" to include additional expenses.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 border-b pb-4">
                        <div className="flex-1">
                          <Label htmlFor={`custom-name-${index}`} className="mb-1 block text-xs">Item Name</Label>
                          <Input
                            id={`custom-name-${index}`}
                            value={item.name}
                            onChange={(e) => handleUpdateCustomItem(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`custom-category-${index}`} className="mb-1 block text-xs">Category</Label>
                          <select
                            id={`custom-category-${index}`}
                            value={item.category}
                            onChange={(e) => handleUpdateCustomItem(index, "category", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            {BABY_COST_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`custom-cost-${index}`} className="mb-1 block text-xs">Cost ($)</Label>
                          <Input
                            id={`custom-cost-${index}`}
                            type="number"
                            value={item.cost}
                            onChange={(e) => handleUpdateCustomItem(index, "cost", Number(e.target.value))}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCustomItem(index)}
                          className="mt-6"
                        >
                          <Minus className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {customItems.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Total Custom Expenses:</span>
                      <span>{formatCurrency(customCostsTotal)}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Expense Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span>One-time Costs</span>
                      <span className="font-medium">{formatCurrency(oneTimeCosts)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Monthly Costs (Annual)</span>
                      <span className="font-medium">{formatCurrency(monthlyCosts * 12)} <span className="text-xs text-muted-foreground">({formatCurrency(monthlyCosts)}/mo)</span></span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Annual Costs</span>
                      <span className="font-medium">{formatCurrency(annualCosts)}</span>
                    </div>
                    {customCostsTotal > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Custom Expenses</span>
                        <span className="font-medium">{formatCurrency(customCostsTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b">
                      <span>Income Reduction</span>
                      <span className="font-medium text-red-600">{formatCurrency(incomeReductionAmount)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b bg-gray-50 rounded">
                      <span className="font-bold">Total First Year Impact</span>
                      <span className="font-bold text-lg">{formatCurrency(totalFinancialImpact)}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Expense Breakdown by Type</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Expense Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tips to Save on Baby Expenses</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Consider buying secondhand items for furniture and clothing</li>
                      <li>Ask friends and family for hand-me-downs</li>
                      <li>Look for sales and use coupons for diapers and formula</li>
                      <li>Research childcare options early to find affordable solutions</li>
                      <li>Check for tax credits and benefits for families with children</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Results are estimates and may vary based on your location and lifestyle.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BabyCostCalculator;
