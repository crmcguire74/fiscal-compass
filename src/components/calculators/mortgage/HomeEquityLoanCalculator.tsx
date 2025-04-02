
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Percent, Calculator, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const HomeEquityLoanCalculator = () => {
  const [homeValue, setHomeValue] = useState(400000);
  const [mortgageBalance, setMortgageBalance] = useState(250000);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(15);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [currentEquity, setCurrentEquity] = useState(0);
  const [remainingEquity, setRemainingEquity] = useState(0);
  const [chartData, setChartData] = useState([]);

  // Calculate max loan amount (typically 80-85% of home value minus mortgage balance)
  useEffect(() => {
    const equity = homeValue - mortgageBalance;
    setCurrentEquity(equity);
    
    // Max loan is typically 80-85% of home value minus current mortgage
    const maxBorrowableEquity = homeValue * 0.85 - mortgageBalance;
    const adjustedMax = Math.max(0, maxBorrowableEquity);
    setMaxLoanAmount(adjustedMax);
    
    // Set initial loan amount to 50% of max if not already set
    if (loanAmount === 0 && adjustedMax > 0) {
      setLoanAmount(Math.round(adjustedMax / 2));
    } else if (loanAmount > adjustedMax) {
      setLoanAmount(adjustedMax);
    }
  }, [homeValue, mortgageBalance]);

  // Calculate monthly payment and update chart data whenever inputs change
  useEffect(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      return;
    }

    // Calculate monthly payment using the loan formula
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
    
    setMonthlyPayment(payment);
    setTotalInterest(payment * numPayments - loanAmount);
    setRemainingEquity(currentEquity - loanAmount);
    
    // Update chart data
    setChartData([
      { name: 'Mortgage Balance', value: mortgageBalance, color: '#ff9800' },
      { name: 'Home Equity Loan', value: loanAmount, color: '#f44336' },
      { name: 'Remaining Equity', value: Math.max(0, homeValue - mortgageBalance - loanAmount), color: '#4caf50' }
    ]);
  }, [loanAmount, interestRate, loanTerm, homeValue, mortgageBalance, currentEquity]);

  const handleCalculate = () => {
    if (loanAmount > maxLoanAmount) {
      toast({
        title: "Loan amount exceeds maximum",
        description: `The maximum loan amount available is $${maxLoanAmount.toLocaleString()}`,
        variant: "destructive"
      });
      setLoanAmount(maxLoanAmount);
      return;
    }

    toast({
      title: "Calculation Complete",
      description: `Your estimated monthly payment is $${monthlyPayment.toFixed(2)}`
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Home Equity Loan Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your home equity loan payment and see how much you can borrow.
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
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>
                Enter your desired loan terms and amount.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loanAmount">
                    <span className="flex items-center gap-1">
                      Loan Amount
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Maximum available: {formatCurrency(maxLoanAmount)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="loanAmount"
                    min={0}
                    max={maxLoanAmount}
                    step={1000}
                    value={[loanAmount]}
                    onValueChange={(values) => setLoanAmount(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{interestRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="interestRate"
                    min={1}
                    max={15}
                    step={0.125}
                    value={[interestRate]}
                    onValueChange={(values) => setInterestRate(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                  <span className="text-sm text-muted-foreground">{loanTerm} years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="loanTerm"
                    min={5}
                    max={30}
                    step={5}
                    value={[loanTerm]}
                    onValueChange={(values) => setLoanTerm(values[0])}
                  />
                </div>
                <Input
                  type="number"
                  min={5}
                  max={30}
                  step={5}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value) || 5)}
                  className="mt-2"
                />
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
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  <div className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Interest</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
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
                    <TableCell className="font-medium">Loan Amount</TableCell>
                    <TableCell className="text-right">{formatCurrency(loanAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Remaining Equity</TableCell>
                    <TableCell className="text-right">{formatCurrency(remainingEquity)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Cost of Loan</TableCell>
                    <TableCell className="text-right">{formatCurrency(loanAmount + totalInterest)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {loanAmount > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Home Equity Breakdown</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" />
                        <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeEquityLoanCalculator;
