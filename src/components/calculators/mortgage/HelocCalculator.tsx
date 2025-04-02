
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Percent, Calculator, Info, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const HelocCalculator = () => {
  const [homeValue, setHomeValue] = useState(400000);
  const [mortgageBalance, setMortgageBalance] = useState(250000);
  const [creditLineAmount, setCreditLineAmount] = useState(0);
  const [initialWithdrawal, setInitialWithdrawal] = useState(0);
  const [currentInterestRate, setCurrentInterestRate] = useState(8.5);
  const [rateIncreasePerYear, setRateIncreasePerYear] = useState(0.25);
  const [drawPeriod, setDrawPeriod] = useState(10);
  const [repaymentPeriod, setRepaymentPeriod] = useState(20);
  const [maxCreditLine, setMaxCreditLine] = useState(0);
  const [currentEquity, setCurrentEquity] = useState(0);
  const [interestOnlyPayment, setInterestOnlyPayment] = useState(0);
  const [repaymentPayment, setRepaymentPayment] = useState(0);
  const [projectionData, setProjectionData] = useState([]);

  // Calculate max credit line amount (typically 80-85% of home value minus mortgage balance)
  useEffect(() => {
    const equity = homeValue - mortgageBalance;
    setCurrentEquity(equity);
    
    // Max HELOC is typically 80-85% of home value minus current mortgage
    const maxBorrowableEquity = homeValue * 0.85 - mortgageBalance;
    const adjustedMax = Math.max(0, maxBorrowableEquity);
    setMaxCreditLine(adjustedMax);
    
    // Set initial credit line amount to 50% of max if not already set
    if (creditLineAmount === 0 && adjustedMax > 0) {
      setCreditLineAmount(Math.round(adjustedMax / 2));
      setInitialWithdrawal(Math.round(adjustedMax / 4));
    } else if (creditLineAmount > adjustedMax) {
      setCreditLineAmount(adjustedMax);
    }
    
    if (initialWithdrawal > creditLineAmount) {
      setInitialWithdrawal(creditLineAmount);
    }
  }, [homeValue, mortgageBalance]);

  // Calculate payments and projections
  useEffect(() => {
    if (creditLineAmount <= 0 || currentInterestRate <= 0) {
      setInterestOnlyPayment(0);
      setRepaymentPayment(0);
      setProjectionData([]);
      return;
    }

    // Calculate interest-only payment during draw period
    const monthlyRate = currentInterestRate / 100 / 12;
    const interestOnly = initialWithdrawal * monthlyRate;
    setInterestOnlyPayment(interestOnly);
    
    // Calculate full repayment (principal + interest) after draw period
    const totalMonths = repaymentPeriod * 12;
    const repayment = (initialWithdrawal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
    setRepaymentPayment(repayment);
    
    // Generate projection data
    generateProjectionData();
  }, [creditLineAmount, initialWithdrawal, currentInterestRate, rateIncreasePerYear, drawPeriod, repaymentPeriod]);

  const generateProjectionData = () => {
    const projData = [];
    let balance = initialWithdrawal;
    let rate = currentInterestRate;
    const totalYears = drawPeriod + repaymentPeriod;
    
    // For each year
    for (let year = 0; year <= totalYears; year++) {
      // Initial year shows just the withdrawal
      if (year === 0) {
        projData.push({
          year,
          balance,
          payment: 0,
          rate,
          phase: 'Initial'
        });
        continue;
      }
      
      // During draw period - interest only payments
      if (year <= drawPeriod) {
        const annualInterest = balance * (rate / 100);
        const annualPayment = annualInterest;
        
        projData.push({
          year,
          balance,
          payment: annualPayment / 12, // Monthly payment
          rate,
          phase: 'Draw Period',
          totalInterest: annualInterest
        });
        
        // Increase rate for next year
        rate = Math.min(18, rate + rateIncreasePerYear);
      } 
      // During repayment period - principal + interest
      else {
        const remainingYears = totalYears - year + 1;
        const remainingMonths = remainingYears * 12;
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -remainingMonths));
        const annualPayment = monthlyPayment * 12;
        const annualInterest = balance * (rate / 100);
        const annualPrincipal = annualPayment - annualInterest;
        
        balance = Math.max(0, balance - annualPrincipal);
        
        projData.push({
          year,
          balance,
          payment: monthlyPayment,
          rate,
          phase: 'Repayment Period',
          totalInterest: annualInterest
        });
        
        // Increase rate for next year
        rate = Math.min(18, rate + rateIncreasePerYear);
      }
    }
    
    setProjectionData(projData);
  };

  const handleCalculate = () => {
    if (creditLineAmount > maxCreditLine) {
      toast({
        title: "Credit line exceeds maximum",
        description: `The maximum credit line available is $${maxCreditLine.toLocaleString()}`,
        variant: "destructive"
      });
      setCreditLineAmount(maxCreditLine);
      return;
    }

    if (initialWithdrawal > creditLineAmount) {
      toast({
        title: "Withdrawal exceeds credit line",
        description: `The initial withdrawal cannot exceed your total credit line`,
        variant: "destructive"
      });
      setInitialWithdrawal(creditLineAmount);
      return;
    }

    generateProjectionData();
    
    toast({
      title: "Calculation Complete",
      description: `Your estimated interest-only payment is $${interestOnlyPayment.toFixed(2)} per month`
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">HELOC Calculator</h1>
        <p className="text-muted-foreground">
          Calculate payments and project costs for a Home Equity Line of Credit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Enter details about your home's value and current mortgage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="homeValue">Home Value</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(homeValue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="homeValue"
                    min={100000}
                    max={2000000}
                    step={5000}
                    value={[homeValue]}
                    onValueChange={(values) => setHomeValue(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  value={homeValue}
                  onChange={(e) => setHomeValue(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="mortgageBalance">
                    <span className="flex items-center gap-1">
                      Mortgage Balance
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>The current balance on your primary mortgage.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(mortgageBalance)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="mortgageBalance"
                    min={0}
                    max={homeValue}
                    step={5000}
                    value={[mortgageBalance]}
                    onValueChange={(values) => setMortgageBalance(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  value={mortgageBalance}
                  onChange={(e) => setMortgageBalance(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HELOC Details</CardTitle>
              <CardDescription>
                Enter credit line details and interest rate information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creditLineAmount">
                    <span className="flex items-center gap-1">
                      Credit Line Amount
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Maximum available: {formatCurrency(maxCreditLine)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(creditLineAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="creditLineAmount"
                    min={0}
                    max={maxCreditLine}
                    step={1000}
                    value={[creditLineAmount]}
                    onValueChange={(values) => setCreditLineAmount(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  value={creditLineAmount}
                  onChange={(e) => setCreditLineAmount(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="initialWithdrawal">
                    <span className="flex items-center gap-1">
                      Initial Withdrawal
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Amount you'll borrow at the start</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(initialWithdrawal)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="initialWithdrawal"
                    min={0}
                    max={creditLineAmount}
                    step={1000}
                    value={[initialWithdrawal]}
                    onValueChange={(values) => setInitialWithdrawal(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  value={initialWithdrawal}
                  onChange={(e) => setInitialWithdrawal(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="currentInterestRate">Current Interest Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{currentInterestRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="currentInterestRate"
                    min={1}
                    max={18}
                    step={0.125}
                    value={[currentInterestRate]}
                    onValueChange={(values) => setCurrentInterestRate(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  step="0.125"
                  value={currentInterestRate}
                  onChange={(e) => setCurrentInterestRate(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rateIncreasePerYear">
                    <span className="flex items-center gap-1">
                      Annual Rate Increase (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Estimated annual increase in interest rate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </Label>
                  <span className="text-sm text-muted-foreground">{rateIncreasePerYear}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="rateIncreasePerYear"
                    min={0}
                    max={2}
                    step={0.05}
                    value={[rateIncreasePerYear]}
                    onValueChange={(values) => setRateIncreasePerYear(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  step="0.05"
                  value={rateIncreasePerYear}
                  onChange={(e) => setRateIncreasePerYear(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="drawPeriod">Draw Period (Years)</Label>
                    <span className="text-sm text-muted-foreground">{drawPeriod} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="drawPeriod"
                      min={5}
                      max={15}
                      step={1}
                      value={[drawPeriod]}
                      onValueChange={(values) => setDrawPeriod(values[0])}
                    />
                  </div>
                  <Input
                    type="number"
                    min={5}
                    max={15}
                    step={1}
                    value={drawPeriod}
                    onChange={(e) => setDrawPeriod(parseInt(e.target.value) || 5)}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="repaymentPeriod">Repayment Period (Years)</Label>
                    <span className="text-sm text-muted-foreground">{repaymentPeriod} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="repaymentPeriod"
                      min={10}
                      max={20}
                      step={5}
                      value={[repaymentPeriod]}
                      onValueChange={(values) => setRepaymentPeriod(values[0])}
                    />
                  </div>
                  <Input
                    type="number"
                    min={10}
                    max={20}
                    step={5}
                    value={repaymentPeriod}
                    onChange={(e) => setRepaymentPeriod(parseInt(e.target.value) || 10)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full mt-4">
                Calculate
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HELOC Summary</CardTitle>
              <CardDescription>Estimated payments and timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Interest-Only Payment</div>
                  <div className="text-2xl font-bold">{formatCurrency(interestOnlyPayment)}</div>
                  <div className="text-xs text-muted-foreground">During draw period</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Full Payment</div>
                  <div className="text-2xl font-bold">{formatCurrency(repaymentPayment)}</div>
                  <div className="text-xs text-muted-foreground">During repayment period</div>
                </div>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Home Value</TableCell>
                    <TableCell className="text-right">{formatCurrency(homeValue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Current Mortgage</TableCell>
                    <TableCell className="text-right">{formatCurrency(mortgageBalance)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Current Equity</TableCell>
                    <TableCell className="text-right">{formatCurrency(currentEquity)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Credit Line Amount</TableCell>
                    <TableCell className="text-right">{formatCurrency(creditLineAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Initial Withdrawal</TableCell>
                    <TableCell className="text-right">{formatCurrency(initialWithdrawal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total HELOC Term</TableCell>
                    <TableCell className="text-right">{drawPeriod + repaymentPeriod} years</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {projectionData.length > 0 && (
                <Tabs defaultValue="chart" className="mt-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="chart" className="flex-1">Chart</TabsTrigger>
                    <TabsTrigger value="table" className="flex-1">Table</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="mt-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                          <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Line type="monotone" dataKey="balance" stroke="#4f46e5" name="Balance" />
                          <Line type="monotone" dataKey="payment" stroke="#f59e0b" name="Monthly Payment" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="table" className="mt-4">
                    <div className="max-h-[250px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead>Phase</TableHead>
                            <TableHead>Interest Rate</TableHead>
                            <TableHead>Monthly Payment</TableHead>
                            <TableHead>Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectionData.map((data) => (
                            <TableRow key={data.year}>
                              <TableCell>{data.year}</TableCell>
                              <TableCell>{data.phase}</TableCell>
                              <TableCell>{data.rate.toFixed(2)}%</TableCell>
                              <TableCell>{formatCurrency(data.payment)}</TableCell>
                              <TableCell>{formatCurrency(data.balance)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelocCalculator;
