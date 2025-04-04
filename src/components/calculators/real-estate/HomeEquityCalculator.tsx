
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Home, MinusCircle, PlusCircle, XCircle } from 'lucide-react'; // Added icons
import { calculateHomeEquity } from '@/utils/taxUtils'; // Will need update
import { formatCurrency } from '@/utils/calculatorUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button'; // Added Button

// Interface for additional costs
interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
}

const HomeEquityCalculator = () => {
  // State for input values
  const [homeValue, setHomeValue] = useState<number>(500000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(350000);
  const [sellingPrice, setSellingPrice] = useState<number>(0); // Use 0 to default to homeValue
  const [realtorCommission, setRealtorCommission] = useState<number>(6);
  const [closingCosts, setClosingCosts] = useState<number>(2); // Percentage
  const [repairs, setRepairs] = useState<number>(0);
  const [escrowFunds, setEscrowFunds] = useState<number>(0); // Added Escrow Funds state
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]); // Added Additional Costs state
  
  // State for calculation results
  const [results, setResults] = useState<any>(null);
  // TODO: Add state for selectedState later
  
  // Calculate home equity when inputs change
  // Calculate home equity when inputs change
  useEffect(() => {
    // Use sellingPrice if > 0, otherwise use homeValue
    const effectiveSellingPrice = sellingPrice > 0 ? sellingPrice : homeValue;

    // TODO: Update calculateHomeEquity function signature in taxUtils.ts
    const calculationResults = calculateHomeEquity(
      homeValue, // Keep original home value for context if needed
      mortgageBalance,
      effectiveSellingPrice, // Pass the price used for calculation
      realtorCommission,
      closingCosts,
      repairs,
      additionalCosts, // Pass array of additional costs
      escrowFunds // Pass escrow funds
    );
    
    setResults(calculationResults);
  }, [
    homeValue,
    mortgageBalance,
    sellingPrice,
    realtorCommission,
    closingCosts,
    repairs,
    additionalCosts, // Add dependency
    escrowFunds // Add dependency
  ]);
  
  // Format data for pie chart
  const getPieChartData = () => {
    if (!results) return [];
    
    // Use selling price if provided, otherwise use home value
    const price = results.sellingPrice;
    
    return [
      { name: "Net Proceeds", value: results.netProceeds, color: "#4CAF50" },
      { name: "Mortgage Balance", value: results.mortgageBalance, color: "#FF4560" },
      { name: "Realtor Commission", value: results.realtorCommissionAmount, color: "#FFBB28" },
      { name: "Closing Costs", value: results.closingCostsAmount, color: "#00E396" }, // Teal
      { name: "Repairs", value: results.repairsAmount, color: "#775DD0" }, // Purple
      // Map additional costs to pie chart segments
      ...results.additionalCostsBreakdown.map((cost: any, index: number) => ({
        name: cost.name || `Additional Cost ${index + 1}`,
        value: cost.amount,
        color: `hsl(200, 70%, ${60 + index * 5}%)` // Varying shades of blue
      }))
    ].filter(item => item.value > 0); // Filter out zero-value items
  };

  const pieChartData = getPieChartData();

  // Format for the custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = results?.sellingPrice || 0;
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)} ({((payload[0].value / totalValue) * 100).toFixed(1)}%)</p>
        </div>
      );
    }
    return null;
  };

  // --- State Management for Additional Costs ---
  const addAdditionalCost = () => {
    setAdditionalCosts([...additionalCosts, { id: crypto.randomUUID(), name: '', amount: 0 }]);
  };

  const removeAdditionalCost = (id: string) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== id));
  };

  const updateAdditionalCost = (id: string, field: 'name' | 'amount', value: string | number) => {
    setAdditionalCosts(additionalCosts.map(cost => 
      cost.id === id ? { ...cost, [field]: field === 'amount' ? Number(value) : value } : cost
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Home Equity After Selling Costs Calculator</CardTitle>
        <CardDescription>
          Calculate how much you'll actually receive after selling your home and paying all costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="homeValue">Current Home Value</Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input 
                  id="homeValue" 
                  type="number" 
                  value={homeValue} 
                  onChange={(e) => setHomeValue(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="mortgageBalance">Mortgage Balance</Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input 
                  id="mortgageBalance" 
                  type="number" 
                  value={mortgageBalance} 
                  onChange={(e) => setMortgageBalance(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="sellingPrice">
                Expected Selling Price (if different from value)
              </Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input 
                  id="sellingPrice" 
                  type="number" 
                  value={sellingPrice} 
                  onChange={(e) => setSellingPrice(Number(e.target.value))} 
                  placeholder={homeValue.toString()}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave at 0 to use current home value
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="realtorCommission">Realtor Commission (%)</Label>
                <span>{realtorCommission}%</span>
              </div>
              <Slider
                id="realtorCommission"
                value={[realtorCommission]}
                min={0}
                max={10}
                step={0.1}
                onValueChange={(value) => setRealtorCommission(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="closingCosts">Closing Costs (%)</Label>
                <span>{closingCosts}%</span>
              </div>
              <Slider
                id="closingCosts"
                value={[closingCosts]}
                min={0}
                max={5}
                step={0.1}
                onValueChange={(value) => setClosingCosts(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="repairs">Cost of Repairs/Improvements</Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input 
                  id="repairs" 
                  type="number" 
                  value={repairs} 
                  onChange={(e) => setRepairs(Number(e.target.value))} 
                />
              </div>
            </div>

            {/* Escrow Funds Input */}
            <div>
              <Label htmlFor="escrowFunds">Funds Remaining in Escrow (Optional)</Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input 
                  id="escrowFunds" 
                  type="number" 
                  value={escrowFunds} 
                  onChange={(e) => setEscrowFunds(Number(e.target.value))} 
                />
              </div>
               <p className="text-xs text-muted-foreground mt-1">
                 Money held for taxes/insurance, often refunded after sale.
               </p>
            </div>

          </div>
        </div>

        {/* Additional Costs Section */}
        <div className="mt-6 space-y-3 border-t pt-4">
           <div className="flex justify-between items-center">
             <h3 className="text-sm font-medium">Additional Selling Costs (Optional)</h3>
             <Button variant="outline" size="sm" onClick={addAdditionalCost}>
               <PlusCircle className="h-4 w-4 mr-1" /> Add Cost
             </Button>
           </div>
           {additionalCosts.map((cost, index) => (
             <div key={cost.id} className="flex items-center space-x-2">
               <Input
                 type="text"
                 placeholder={`Cost ${index + 1} Name (e.g., Staging, Liens)`}
                 value={cost.name}
                 onChange={(e) => updateAdditionalCost(cost.id, 'name', e.target.value)}
                 className="h-8 text-sm flex-grow"
               />
               <div className="flex items-center">
                 <span className="mr-1 text-sm">$</span>
                 <Input
                   type="number"
                   value={cost.amount}
                   onChange={(e) => updateAdditionalCost(cost.id, 'amount', e.target.value)}
                   className="w-24 h-8 text-sm"
                   min={0}
                 />
               </div>
               <Button variant="ghost" size="sm" onClick={() => removeAdditionalCost(cost.id)} className="text-red-500 hover:text-red-700">
                 <XCircle className="h-4 w-4" />
               </Button>
             </div>
           ))}
         </div>
        
        {results && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Net Proceeds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(results.netProceeds)}</div>
                  <div className="text-sm text-muted-foreground">After all costs</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Equity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(results.currentEquity)}</div>
                  <div className="text-sm text-muted-foreground">Before selling</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Selling Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{formatCurrency(results.totalSellingCosts)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((results.totalSellingCosts / results.sellingPrice) * 100).toFixed(1)}% of selling price
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Sale Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Detailed Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Item</span>
                    <span className="font-semibold">Amount</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Selling Price</span>
                    <span>{formatCurrency(results.sellingPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-red-600">
                    <span>Mortgage Balance</span>
                    <span>-{formatCurrency(results.mortgageBalance)}</span>
                  </div>
                  
                  <div className="flex justify-between text-red-600">
                    <span>Realtor Commission ({realtorCommission}%)</span>
                    <span>-{formatCurrency(results.realtorCommissionAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-red-600">
                    <span>Closing Costs ({closingCosts}%)</span>
                    <span>-{formatCurrency(results.closingCostsAmount)}</span>
                  </div>
                  
                  {results.repairsAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Repairs/Improvements</span>
                      <span>-{formatCurrency(results.repairsAmount)}</span>
                    </div>
                  )}
                  
                  {/* Display Additional Costs */}
                  {results.additionalCostsBreakdown.map((cost: any, index: number) => (
                     cost.amount > 0 && (
                       <div key={index} className="flex justify-between text-red-600">
                         <span>{cost.name || `Additional Cost ${index + 1}`}</span>
                         <span>-{formatCurrency(cost.amount)}</span>
                       </div>
                     )
                  ))}

                  {/* Display Escrow Funds */}
                   {results.escrowFunds > 0 && (
                     <div className="flex justify-between text-blue-600">
                       <span>Escrow Funds Returned</span>
                       <span>+{formatCurrency(results.escrowFunds)}</span>
                     </div>
                   )}
                  
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Estimated Net Proceeds</span>
                    <span className="text-green-600">{formatCurrency(results.netProceeds)}</span>
                  </div>
                  
                  {results.profitOrLoss !== 0 && (
                    <div className={`flex justify-between ${results.profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>Profit/Loss from Current Equity</span>
                      <span>{results.profitOrLoss >= 0 ? '+' : ''}{formatCurrency(results.profitOrLoss)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <p>
          This calculator provides estimates based on the information provided and does not account for all possible costs associated with selling a home. 
          For personalized real estate advice, consult a qualified real estate professional.
        </p>
      </CardFooter>
    </Card>
  );
};

export default HomeEquityCalculator;
