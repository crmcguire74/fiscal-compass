import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Home, MinusCircle, PlusCircle, XCircle, DollarSign, Percent, Wrench, Landmark, Calculator, Info, BarChart3, PieChart as PieChartIcon } from 'lucide-react'; // Added icons
import { calculateHomeEquity } from '@/utils/taxUtils'; // Assuming this util exists and works as expected
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Added Tabs
import {
  Tooltip as UITooltip, // Renamed Tooltip
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Interface for additional costs
interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
}

const EQUITY_DEFAULTS = {
    homeValue: 500000,
    mortgageBalance: 350000,
    sellingPrice: 0, // Default to homeValue
    realtorCommission: 6,
    closingCostsPercent: 2, // Renamed for clarity
    repairs: 0,
    escrowFunds: 0,
};

const HomeEquityCalculator = () => {
  // State for input values
  const [homeValue, setHomeValue] = useState<number>(EQUITY_DEFAULTS.homeValue);
  const [mortgageBalance, setMortgageBalance] = useState<number>(EQUITY_DEFAULTS.mortgageBalance);
  const [sellingPrice, setSellingPrice] = useState<number>(EQUITY_DEFAULTS.sellingPrice);
  const [realtorCommission, setRealtorCommission] = useState<number>(EQUITY_DEFAULTS.realtorCommission);
  const [closingCostsPercent, setClosingCostsPercent] = useState<number>(EQUITY_DEFAULTS.closingCostsPercent); // Renamed state
  const [repairs, setRepairs] = useState<number>(EQUITY_DEFAULTS.repairs);
  const [escrowFunds, setEscrowFunds] = useState<number>(EQUITY_DEFAULTS.escrowFunds);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);

  // State for calculation results
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('propertyInfo'); // For input tabs

  // Calculate home equity when inputs change
  useEffect(() => {
    const effectiveSellingPrice = sellingPrice > 0 ? sellingPrice : homeValue;

    // Ensure calculateHomeEquity exists and handles the parameters correctly
    // Assuming it returns an object like:
    // { netProceeds, currentEquity, totalSellingCosts, sellingPrice (used),
    //   mortgageBalance, realtorCommissionAmount, closingCostsAmount,
    //   repairsAmount, additionalCostsBreakdown, escrowFunds, profitOrLoss }
    try {
        const calculationResults = calculateHomeEquity(
            homeValue,
            mortgageBalance,
            effectiveSellingPrice,
            realtorCommission,
            closingCostsPercent, // Pass percentage
            repairs,
            additionalCosts,
            escrowFunds
        );
        setResults(calculationResults);
    } catch (error) {
        console.error("Error calculating home equity:", error);
        // Handle error state if needed, maybe set results to null or an error object
        setResults(null);
    }

  }, [
    homeValue,
    mortgageBalance,
    sellingPrice,
    realtorCommission,
    closingCostsPercent, // Use renamed state
    repairs,
    additionalCosts,
    escrowFunds
  ]);

  // Format data for pie chart
  const getPieChartData = () => {
    if (!results || !results.sellingPrice || results.sellingPrice <= 0) return [];

    const data = [
      { name: "Net Proceeds", value: results.netProceeds, color: "#4CAF50" }, // Green
      { name: "Mortgage", value: results.mortgageBalance, color: "#FF6384" }, // Pink/Red
      { name: "Commission", value: results.realtorCommissionAmount, color: "#FFCE56" }, // Yellow
      { name: "Closing Costs", value: results.closingCostsAmount, color: "#36A2EB" }, // Blue
      { name: "Repairs", value: results.repairsAmount, color: "#9966FF" }, // Purple
      ...results.additionalCostsBreakdown.map((cost: any, index: number) => ({
        name: cost.name || `Other Cost ${index + 1}`,
        value: cost.amount,
        color: `hsl(210, 50%, ${60 + index * 5}%)` // Shades of blue/grey
      }))
    ];

    // Filter out items with zero or negative value, except net proceeds if it's negative
    return data.filter(item => item.value > 0 || (item.name === "Net Proceeds" && item.value <= 0));
  };

  const pieChartData = getPieChartData();

  // Format for the custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = results?.sellingPrice || 1; // Avoid division by zero
      const percent = ((payload[0].value / totalValue) * 100);
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)} ({percent > 0.1 ? percent.toFixed(1) : '<0.1'}%)</p>
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
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Home className="h-6 w-6" />
          Home Sale Net Proceeds Calculator
        </CardTitle>
        <CardDescription className="text-finance-primary-foreground/90">
          Estimate your net proceeds after selling your home and paying costs.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Input Section */}
          <div className="md:col-span-2 space-y-6">
             <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="propertyInfo">
                    <Landmark className="h-4 w-4 mr-2" /> Property Info
                    </TabsTrigger>
                    <TabsTrigger value="sellingCosts">
                    <Percent className="h-4 w-4 mr-2" /> Selling Costs
                    </TabsTrigger>
                    <TabsTrigger value="adjustments">
                    <Wrench className="h-4 w-4 mr-2" /> Adjustments
                    </TabsTrigger>
                </TabsList>

                {/* Property Info Tab */}
                <TabsContent value="propertyInfo" className="space-y-6">
                    <Card className="border-dashed border-blue-300">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                            <Home className="h-5 w-5" /> Property Value & Debt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Home Value */}
                            <div className="space-y-2">
                            <Label htmlFor="homeValue">Current Home Value</Label>
                            <div className="flex items-center">
                                <span className="input-prefix">$</span>
                                <Input
                                id="homeValue"
                                type="number"
                                value={homeValue}
                                onChange={(e) => setHomeValue(Number(e.target.value) || 0)}
                                className="input-field rounded-l-none" min="0"
                                />
                            </div>
                            <Slider value={[homeValue]} onValueChange={(v) => setHomeValue(v[0])} max={2000000} step={10000} className="mt-2"/>
                            </div>
                            {/* Mortgage Balance */}
                            <div className="space-y-2">
                            <Label htmlFor="mortgageBalance">Mortgage Balance</Label>
                            <div className="flex items-center">
                                <span className="input-prefix">$</span>
                                <Input
                                id="mortgageBalance"
                                type="number"
                                value={mortgageBalance}
                                onChange={(e) => setMortgageBalance(Number(e.target.value) || 0)}
                                className="input-field rounded-l-none" min="0" max={homeValue}
                                />
                            </div>
                             <Slider value={[mortgageBalance]} onValueChange={(v) => setMortgageBalance(v[0])} max={homeValue} step={5000} className="mt-2"/>
                            </div>
                             {/* Selling Price */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="sellingPrice" className="flex items-center">
                                    Expected Selling Price
                                    <TooltipProvider>
                                        <UITooltip delayDuration={100}>
                                        <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Enter the price you expect to sell for. Leave at 0 to use the Current Home Value.</p></TooltipContent>
                                        </UITooltip>
                                    </TooltipProvider>
                                </Label>
                                <div className="flex items-center">
                                    <span className="input-prefix">$</span>
                                    <Input
                                    id="sellingPrice"
                                    type="number"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                                    className="input-field rounded-l-none" min="0"
                                    placeholder={`Defaults to ${formatCurrency(homeValue)}`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 {/* Selling Costs Tab */}
                <TabsContent value="sellingCosts" className="space-y-6">
                     <Card className="border-dashed border-green-300">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                            <Percent className="h-5 w-5" /> Commissions & Closing Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Realtor Commission */}
                            <div className="space-y-2">
                                <Label htmlFor="realtorCommission">Realtor Commission</Label>
                                <div className="flex items-center">
                                    <Input
                                    id="realtorCommission"
                                    type="number" value={realtorCommission}
                                    onChange={(e) => setRealtorCommission(Number(e.target.value) || 0)}
                                    className="input-field rounded-r-none" min="0" max="10" step="0.1"
                                    />
                                    <span className="input-suffix">%</span>
                                </div>
                                <Slider value={[realtorCommission]} onValueChange={(v) => setRealtorCommission(v[0])} max={10} step={0.1} className="mt-2"/>
                            </div>
                             {/* Closing Costs */}
                            <div className="space-y-2">
                                <Label htmlFor="closingCostsPercent">Seller Closing Costs</Label>
                                <div className="flex items-center">
                                    <Input
                                    id="closingCostsPercent"
                                    type="number" value={closingCostsPercent}
                                    onChange={(e) => setClosingCostsPercent(Number(e.target.value) || 0)}
                                    className="input-field rounded-r-none" min="0" max="10" step="0.1"
                                    />
                                    <span className="input-suffix">%</span>
                                </div>
                                <Slider value={[closingCostsPercent]} onValueChange={(v) => setClosingCostsPercent(v[0])} max={10} step={0.1} className="mt-2"/>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 {/* Adjustments Tab */}
                <TabsContent value="adjustments" className="space-y-6">
                     <Card className="border-dashed border-purple-300">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                            <Wrench className="h-5 w-5" /> Repairs & Other Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {/* Repairs */}
                            <div className="space-y-2">
                                <Label htmlFor="repairs">Cost of Repairs/Improvements</Label>
                                <div className="flex items-center">
                                    <span className="input-prefix">$</span>
                                    <Input
                                    id="repairs"
                                    type="number" value={repairs}
                                    onChange={(e) => setRepairs(Number(e.target.value) || 0)}
                                    className="input-field rounded-l-none" min="0"
                                    />
                                </div>
                            </div>
                             {/* Escrow Funds */}
                            <div className="space-y-2">
                                <Label htmlFor="escrowFunds" className="flex items-center">
                                    Funds Remaining in Escrow (Optional)
                                    <TooltipProvider>
                                        <UITooltip delayDuration={100}>
                                        <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Money held for taxes/insurance, often refunded after sale. Adds to net proceeds.</p></TooltipContent>
                                        </UITooltip>
                                    </TooltipProvider>
                                </Label>
                                <div className="flex items-center">
                                    <span className="input-prefix">$</span>
                                    <Input
                                    id="escrowFunds"
                                    type="number" value={escrowFunds}
                                    onChange={(e) => setEscrowFunds(Number(e.target.value) || 0)}
                                    className="input-field rounded-l-none" min="0"
                                    />
                                </div>
                            </div>
                             {/* Additional Costs Section */}
                            <div className="space-y-3 border-t pt-4">
                                <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">Additional Selling Costs</h3>
                                <Button variant="outline" size="sm" onClick={addAdditionalCost}>
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add Cost
                                </Button>
                                </div>
                                {additionalCosts.map((cost) => (
                                <div key={cost.id} className="flex items-center space-x-2">
                                    <Input
                                    type="text"
                                    placeholder={`Cost Name (e.g., Staging)`}
                                    value={cost.name}
                                    onChange={(e) => updateAdditionalCost(cost.id, 'name', e.target.value)}
                                    className="h-9 text-sm flex-grow"
                                    />
                                    <div className="flex items-center">
                                    <span className="input-prefix h-9">$</span>
                                    <Input
                                        type="number" value={cost.amount}
                                        onChange={(e) => updateAdditionalCost(cost.id, 'amount', e.target.value)}
                                        className="input-field rounded-l-none w-28 h-9 text-sm" min={0}
                                    />
                                    </div>
                                    <TooltipProvider>
                                        <UITooltip delayDuration={100}>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => removeAdditionalCost(cost.id)} className="text-red-500 hover:bg-red-100 h-9 w-9">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Remove Cost</p></TooltipContent>
                                        </UITooltip>
                                    </TooltipProvider>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
             </Tabs>
          </div>

          {/* Results Section */}
          <div className="md:col-span-1 space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Sale Summary
                </CardTitle>
                 <CardDescription>Estimated outcome of your home sale.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {/* Key Figures */}
                 <div className="grid grid-cols-1 gap-3 text-center">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xs text-green-800 font-medium uppercase tracking-wider">Net Proceeds</div>
                        <div className="text-2xl font-bold text-green-700">{results ? formatCurrency(results.netProceeds) : '$0.00'}</div>
                    </div>
                     <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs text-blue-800 font-medium uppercase tracking-wider">Current Equity</div>
                        <div className="text-lg font-semibold text-blue-700">{results ? formatCurrency(results.currentEquity) : '$0.00'}</div>
                    </div>
                     <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-xs text-orange-800 font-medium uppercase tracking-wider">Total Selling Costs</div>
                        <div className="text-lg font-semibold text-orange-700">{results ? formatCurrency(results.totalSellingCosts) : '$0.00'}</div>
                         {results && results.sellingPrice > 0 && (
                            <div className="text-xs text-orange-600">({formatPercentage(results.totalSellingCosts / results.sellingPrice * 100)} of Sale Price)</div>
                         )}
                    </div>
                 </div>

                 {/* Pie Chart */}
                 {results && pieChartData.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">Sale Price Allocation</h4>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value" nameKey="name"
                                cx="50%" cy="50%"
                                innerRadius={50} outerRadius={80}
                                paddingAngle={2}
                            >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color}/>
                            ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', lineHeight: '1.4' }}/>
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                 )}

                 {/* Detailed Breakdown (Optional - could be a separate section/modal) */}
                 {results && (
                    <details className="text-xs border-t pt-3 mt-3">
                        <summary className="cursor-pointer text-muted-foreground hover:text-primary">View Detailed Breakdown</summary>
                        <dl className="mt-2 space-y-1">
                             <div className="flex justify-between">
                                <dt>Selling Price</dt>
                                <dd>{formatCurrency(results.sellingPrice)}</dd>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <dt>Mortgage Balance</dt>
                                <dd>-{formatCurrency(results.mortgageBalance)}</dd>
                            </div>
                             <div className="flex justify-between text-red-600">
                                <dt>Commission ({formatPercentage(realtorCommission)})</dt>
                                <dd>-{formatCurrency(results.realtorCommissionAmount)}</dd>
                            </div>
                             <div className="flex justify-between text-red-600">
                                <dt>Closing Costs ({formatPercentage(closingCostsPercent)})</dt>
                                <dd>-{formatCurrency(results.closingCostsAmount)}</dd>
                            </div>
                             {results.repairsAmount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <dt>Repairs</dt>
                                    <dd>-{formatCurrency(results.repairsAmount)}</dd>
                                </div>
                             )}
                             {results.additionalCostsBreakdown.map((cost: any, index: number) => (
                                cost.amount > 0 && (
                                    <div key={index} className="flex justify-between text-red-600">
                                    <dt>{cost.name || `Other Cost ${index + 1}`}</dt>
                                    <dd>-{formatCurrency(cost.amount)}</dd>
                                    </div>
                                )
                             ))}
                             {results.escrowFunds > 0 && (
                                <div className="flex justify-between text-blue-600">
                                    <dt>Escrow Funds Returned</dt>
                                    <dd>+{formatCurrency(results.escrowFunds)}</dd>
                                </div>
                             )}
                             <div className="flex justify-between border-t pt-1 mt-1 font-bold">
                                <dt>Net Proceeds</dt>
                                <dd className="text-green-600">{formatCurrency(results.netProceeds)}</dd>
                            </div>
                        </dl>
                    </details>
                 )}

              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        <p>
          *Estimates only. Actual costs depend on market conditions, negotiations, location, and specific services used. Consult with real estate and financial professionals.
        </p>
      </CardFooter>
    </Card>
  );
};

// Input styling classes
const inputPrefixSuffixBase = "flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border h-10"; // Match input height
const inputPrefixStyle = `${inputPrefixSuffixBase} border-r-0 rounded-l-md`;
const inputSuffixStyle = `${inputPrefixSuffixBase} border-l-0 rounded-r-md`;
const inputFieldStyle = "flex-1 min-w-0 rounded-none h-10"; // Match input height

// Add these styles to your global CSS or component-specific CSS:
/*
.input-prefix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-r-0 rounded-l-md h-10; }
.input-suffix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-l-0 rounded-r-md h-10; }
.input-field { @apply flex-1 min-w-0 rounded-none h-10; }
*/

export default HomeEquityCalculator;
