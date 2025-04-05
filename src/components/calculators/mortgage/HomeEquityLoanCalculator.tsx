import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button'; // Keep Button, might add save later
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead, // Keep if we add amortization table later
  TableHeader, // Keep if we add amortization table later
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Added Tabs
import { DollarSign, Percent, Calculator, Info, Home, Landmark, Clock, BarChart3, PieChart as PieChartIcon } from 'lucide-react'; // Added icons
import {
  Tooltip as UITooltip, // Renamed Tooltip
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast"; // Assuming useToast hook exists
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils'; // Use shared utils

const EQUITY_LOAN_DEFAULTS = {
    homeValue: 400000,
    mortgageBalance: 250000,
    loanAmount: 0, // Calculated
    interestRate: 7.5,
    loanTerm: 15,
    ltvCap: 85, // Loan-to-value cap percentage
};

const HomeEquityLoanCalculator = () => {
  const [homeValue, setHomeValue] = useState(EQUITY_LOAN_DEFAULTS.homeValue);
  const [mortgageBalance, setMortgageBalance] = useState(EQUITY_LOAN_DEFAULTS.mortgageBalance);
  const [loanAmount, setLoanAmount] = useState(EQUITY_LOAN_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(EQUITY_LOAN_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(EQUITY_LOAN_DEFAULTS.loanTerm);
  const [ltvCap, setLtvCap] = useState(EQUITY_LOAN_DEFAULTS.ltvCap); // Added LTV Cap state

  // Derived/Calculated State
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [currentEquity, setCurrentEquity] = useState(0);
  const [remainingEquity, setRemainingEquity] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]); // Explicit type
  const [activeTab, setActiveTab] = useState('propertyLoan'); // For input tabs

  // Calculate max loan amount
  useEffect(() => {
    const equity = homeValue - mortgageBalance;
    setCurrentEquity(equity);

    const maxBorrowableEquity = homeValue * (ltvCap / 100) - mortgageBalance;
    const adjustedMax = Math.max(0, Math.round(maxBorrowableEquity));
    setMaxLoanAmount(adjustedMax);

    // Adjust loan amount if it exceeds the new max
    if (loanAmount > adjustedMax) {
      setLoanAmount(adjustedMax);
    }
  }, [homeValue, mortgageBalance, ltvCap, loanAmount]); // Added loanAmount dependency

  // Calculate monthly payment and update chart data
  useEffect(() => {
    // Basic validation
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setRemainingEquity(currentEquity); // Remaining equity is just current equity if no loan
      setChartData([ // Update chart even with no loan
        { name: 'Mortgage Balance', value: mortgageBalance, color: '#ff9800' },
        { name: 'Home Equity Loan', value: 0, color: '#f44336' },
        { name: 'Remaining Equity', value: Math.max(0, homeValue - mortgageBalance), color: '#4caf50' }
      ]);
      return;
    }

    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    let payment = 0;
    if (monthlyRate > 0) {
        payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
    } else { // Handle 0% interest rate
        payment = loanAmount / numPayments;
    }

    const calculatedTotalInterest = payment * numPayments - loanAmount;
    const calculatedRemainingEquity = currentEquity - loanAmount;

    setMonthlyPayment(payment);
    setTotalInterest(Math.max(0, calculatedTotalInterest)); // Ensure interest isn't negative
    setRemainingEquity(Math.max(0, calculatedRemainingEquity)); // Ensure equity isn't negative

    // Update chart data
    setChartData([
      { name: 'Mortgage Balance', value: mortgageBalance, color: '#ff9800' }, // Orange
      { name: 'Home Equity Loan', value: loanAmount, color: '#f44336' }, // Red
      { name: 'Remaining Equity', value: Math.max(0, homeValue - mortgageBalance - loanAmount), color: '#4caf50' } // Green
    ]);
  }, [loanAmount, interestRate, loanTerm, homeValue, mortgageBalance, currentEquity]); // currentEquity added

  const handleCalculate = () => {
    // Recalculate just in case, though useEffect should handle it
    // This button might be more useful for saving/exporting later

    if (loanAmount > maxLoanAmount) {
      toast({
        title: "Loan amount exceeds maximum",
        description: `The maximum loan amount available based on ${ltvCap}% LTV is ${formatCurrency(maxLoanAmount)}.`,
        variant: "destructive"
      });
      setLoanAmount(maxLoanAmount); // Reset to max if exceeded
      return;
    }

    toast({
      title: "Calculation Updated",
      description: `Estimated monthly payment: ${formatCurrency(monthlyPayment)}`
    });
  };

  // --- Render Logic ---
  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Home className="h-6 w-6" />
          Home Equity Loan Calculator
        </CardTitle>
        <CardDescription className="text-finance-primary-foreground/90">
          Estimate payments for a fixed-rate home equity loan.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="propertyLoan">
                  <Landmark className="h-4 w-4 mr-2" /> Property & Equity
                </TabsTrigger>
                <TabsTrigger value="loanTerms">
                  <Clock className="h-4 w-4 mr-2" /> Loan Terms
                </TabsTrigger>
                 <TabsTrigger value="ltv">
                  <Percent className="h-4 w-4 mr-2" /> LTV Cap
                </TabsTrigger>
              </TabsList>

              {/* Property & Loan Tab */}
              <TabsContent value="propertyLoan" className="space-y-6">
                <Card className="border-dashed border-blue-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                      <Home className="h-5 w-5" /> Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Home Value */}
                    <div className="space-y-2">
                      <Label htmlFor="homeValue" className="flex items-center">Home Value</Label>
                      <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                          id="homeValue"
                          type="number"
                          value={homeValue}
                          onChange={(e) => setHomeValue(Number(e.target.value) || 0)}
                          className="input-field rounded-l-none"
                          min="0"
                        />
                      </div>
                      <Slider
                        value={[homeValue]}
                        onValueChange={(value) => setHomeValue(value[0])}
                        max={2000000} step={10000} className="mt-2"
                      />
                    </div>
                    {/* Mortgage Balance */}
                    <div className="space-y-2">
                      <Label htmlFor="mortgageBalance" className="flex items-center">
                        Mortgage Balance
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Current balance on your primary mortgage.</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                          id="mortgageBalance"
                          type="number"
                          value={mortgageBalance}
                          onChange={(e) => setMortgageBalance(Number(e.target.value) || 0)}
                          className="input-field rounded-l-none"
                          min="0" max={homeValue}
                        />
                      </div>
                      <Slider
                        value={[mortgageBalance]}
                        onValueChange={(value) => setMortgageBalance(value[0])}
                        max={homeValue} step={5000} className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Loan Terms Tab */}
              <TabsContent value="loanTerms" className="space-y-6">
                <Card className="border-dashed border-green-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <DollarSign className="h-5 w-5" /> Loan Amount & Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Loan Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount" className="flex items-center">
                        Loan Amount
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Desired loan amount (Max available: {formatCurrency(maxLoanAmount)})</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                          id="loanAmount"
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                          className="input-field rounded-l-none"
                          min="0" max={maxLoanAmount}
                        />
                      </div>
                      <Slider
                        value={[loanAmount]}
                        onValueChange={(value) => setLoanAmount(value[0])}
                        max={maxLoanAmount} step={1000} className="mt-2"
                        disabled={maxLoanAmount <= 0}
                      />
                    </div>
                     {/* Interest Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate</Label>
                      <div className="flex items-center">
                        <Input
                          id="interestRate"
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="1" max="18" step="0.125"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <Slider
                        value={[interestRate]}
                        onValueChange={(value) => setInterestRate(value[0])}
                        min={1} max={18} step={0.125} className="mt-2"
                      />
                    </div>
                     {/* Loan Term */}
                    <div className="space-y-2">
                      <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                      <div className="flex items-center">
                        <Input
                          id="loanTerm"
                          type="number"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="5" max="30" step="1"
                        />
                        <span className="input-suffix">years</span>
                      </div>
                      <Slider
                        value={[loanTerm]}
                        onValueChange={(value) => setLoanTerm(value[0])}
                        min={5} max={30} step={1} className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

               {/* LTV Cap Tab */}
              <TabsContent value="ltv" className="space-y-6">
                 <Card className="border-dashed border-purple-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                      <Percent className="h-5 w-5" /> Loan-to-Value (LTV) Cap
                    </CardTitle>
                     <CardDescription>Adjust the maximum percentage of your home's value that can be borrowed against.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* LTV Cap */}
                    <div className="space-y-2 max-w-xs">
                      <Label htmlFor="ltvCap" className="flex items-center">
                        LTV Cap
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Maximum combined loan-to-value ratio allowed by the lender (typically 80-85%). Affects max loan amount.</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="ltvCap"
                          type="number"
                          value={ltvCap}
                          onChange={(e) => setLtvCap(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="50" max="100" step="1"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <Slider
                        value={[ltvCap]}
                        onValueChange={(value) => setLtvCap(value[0])}
                        min={50} max={100} step={1} className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
             {/* Optional: Add Calculate button if needed, though useEffect handles updates */}
             {/* <Button onClick={handleCalculate} className="w-full mt-4">
                Update Calculation
             </Button> */}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="sticky top-6"> {/* Make summary sticky */}
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Loan Summary
                </CardTitle>
                <CardDescription>Estimated payments and equity impact.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {/* Key Payment Figures */}
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <div className="text-xs text-muted-foreground">Monthly Payment</div>
                        <div className="text-xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <div className="text-xs text-muted-foreground">Total Interest Paid</div>
                        <div className="text-xl font-bold text-orange-600">{formatCurrency(totalInterest)}</div>
                    </div>
                 </div>

                 {/* Definition List for Details */}
                 <dl className="space-y-1 text-sm border-t pt-3">
                    <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Home Value</dt>
                        <dd>{formatCurrency(homeValue)}</dd>
                    </div>
                     <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Mortgage Balance</dt>
                        <dd>{formatCurrency(mortgageBalance)}</dd>
                    </div>
                     <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Current Equity</dt>
                        <dd>{formatCurrency(currentEquity)}</dd>
                    </div>
                     <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Max Loan Amount ({ltvCap}%)</dt>
                        <dd>{formatCurrency(maxLoanAmount)}</dd>
                    </div>
                     <div className="flex justify-between py-1 font-semibold border-t mt-1 pt-1">
                        <dt>Selected Loan Amount</dt>
                        <dd>{formatCurrency(loanAmount)}</dd>
                    </div>
                     <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Total Loan Cost</dt>
                        <dd>{formatCurrency(loanAmount + totalInterest)}</dd>
                    </div>
                     <div className="flex justify-between py-1 font-semibold text-green-700">
                        <dt>Remaining Equity</dt>
                        <dd>{formatCurrency(remainingEquity)}</dd>
                    </div>
                 </dl>

                 {/* Pie Chart */}
                 {loanAmount >= 0 && homeValue > 0 && ( // Render chart if data is valid
                    <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">Home Equity Breakdown</h4>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={chartData.filter(d => d.value > 0)} // Filter out zero values for cleaner chart
                            cx="50%"
                            cy="50%"
                            innerRadius={40} // Make it a donut chart
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            >
                            {chartData.filter(d => d.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                            ))}
                            </Pie>
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                iconSize={10}
                                wrapperStyle={{ fontSize: '11px', lineHeight: '1.5' }}
                                formatter={(value, entry) => (
                                    <span className="text-gray-700">{value}: {formatCurrency(entry.payload.value)}</span>
                                )}
                             />
                            <RechartsTooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
       <CardFooter className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
            *Estimates are based on provided inputs. Actual payments may vary. Consult with a lender for specific terms.
        </p>
      </CardFooter>
    </Card>
  );
};

// Input styling classes (can be moved to global CSS)
const inputPrefixSuffixBase = "flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border";
const inputPrefixStyle = `${inputPrefixSuffixBase} border-r-0 rounded-l-md`;
const inputSuffixStyle = `${inputPrefixSuffixBase} border-l-0 rounded-r-md`;
const inputFieldStyle = "flex-1 min-w-0 rounded-none"; // Adjust rounding as needed

// Add these styles to your global CSS or component-specific CSS:
/*
.input-prefix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-r-0 rounded-l-md; }
.input-suffix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-l-0 rounded-r-md; }
.input-field { @apply flex-1 min-w-0 rounded-none; }
*/


export default HomeEquityLoanCalculator;
