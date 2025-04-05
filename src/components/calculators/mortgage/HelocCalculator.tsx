import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { DollarSign, Percent, Calculator, Info, Clock, Home, Landmark, TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react'; // Added icons
import {
  Tooltip as UITooltip, // Renamed Tooltip to UITooltip
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast"; // Assuming useToast hook exists
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils'; // Use shared utils

const HELOC_DEFAULTS = {
    homeValue: 400000,
    mortgageBalance: 250000,
    creditLineAmount: 0, // Will be calculated
    initialWithdrawal: 0, // Will be calculated
    currentInterestRate: 8.5,
    rateIncreasePerYear: 0.25,
    drawPeriod: 10,
    repaymentPeriod: 20,
    ltvCap: 85, // Loan-to-value cap percentage
};

const HelocCalculator = () => {
  const [homeValue, setHomeValue] = useState(HELOC_DEFAULTS.homeValue);
  const [mortgageBalance, setMortgageBalance] = useState(HELOC_DEFAULTS.mortgageBalance);
  const [creditLineAmount, setCreditLineAmount] = useState(HELOC_DEFAULTS.creditLineAmount);
  const [initialWithdrawal, setInitialWithdrawal] = useState(HELOC_DEFAULTS.initialWithdrawal);
  const [currentInterestRate, setCurrentInterestRate] = useState(HELOC_DEFAULTS.currentInterestRate);
  const [rateIncreasePerYear, setRateIncreasePerYear] = useState(HELOC_DEFAULTS.rateIncreasePerYear);
  const [drawPeriod, setDrawPeriod] = useState(HELOC_DEFAULTS.drawPeriod);
  const [repaymentPeriod, setRepaymentPeriod] = useState(HELOC_DEFAULTS.repaymentPeriod);
  const [ltvCap, setLtvCap] = useState(HELOC_DEFAULTS.ltvCap); // Added LTV Cap state

  // Derived/Calculated State
  const [maxCreditLine, setMaxCreditLine] = useState(0);
  const [currentEquity, setCurrentEquity] = useState(0);
  const [interestOnlyPayment, setInterestOnlyPayment] = useState(0);
  const [repaymentPayment, setRepaymentPayment] = useState(0);
  const [projectionData, setProjectionData] = useState<any[]>([]); // Explicit type
  const [activeTab, setActiveTab] = useState('propertyLoan'); // For input tabs

  // Calculate max credit line amount
  useEffect(() => {
    const equity = homeValue - mortgageBalance;
    setCurrentEquity(equity);

    const maxBorrowableEquity = homeValue * (ltvCap / 100) - mortgageBalance;
    const adjustedMax = Math.max(0, Math.round(maxBorrowableEquity));
    setMaxCreditLine(adjustedMax);

    // Adjust credit line if it exceeds the new max
    if (creditLineAmount > adjustedMax) {
      setCreditLineAmount(adjustedMax);
    }
     // Adjust initial withdrawal if it exceeds the new credit line amount
    if (initialWithdrawal > creditLineAmount && creditLineAmount <= adjustedMax) {
        setInitialWithdrawal(creditLineAmount);
    } else if (initialWithdrawal > adjustedMax) {
         setInitialWithdrawal(adjustedMax);
    }

  }, [homeValue, mortgageBalance, ltvCap, creditLineAmount, initialWithdrawal]); // Added dependencies

  // Calculate payments and projections
  useEffect(() => {
    // Basic validation
    if (initialWithdrawal <= 0 || currentInterestRate <= 0 || repaymentPeriod <= 0) {
      setInterestOnlyPayment(0);
      setRepaymentPayment(0);
      setProjectionData([]);
      return;
    }

    // Calculate interest-only payment during draw period (based on initial withdrawal)
    const monthlyRateInitial = currentInterestRate / 100 / 12;
    const interestOnly = initialWithdrawal * monthlyRateInitial;
    setInterestOnlyPayment(interestOnly);

    // Calculate full repayment (principal + interest) after draw period
    // Use the initial withdrawal amount as the principal for the repayment phase calculation
    // The rate used here should ideally be the rate at the *start* of the repayment period,
    // but for simplicity, we'll use the initial rate. A more complex projection handles rate changes.
    const totalRepaymentMonths = repaymentPeriod * 12;
    let repayment = 0;
    if (totalRepaymentMonths > 0 && monthlyRateInitial > 0) {
        repayment = (initialWithdrawal * monthlyRateInitial) / (1 - Math.pow(1 + monthlyRateInitial, -totalRepaymentMonths));
    } else if (totalRepaymentMonths > 0) {
        repayment = initialWithdrawal / totalRepaymentMonths; // Handle 0% rate
    }
    setRepaymentPayment(repayment);

    // Generate projection data
    generateProjectionData();
  }, [initialWithdrawal, currentInterestRate, rateIncreasePerYear, drawPeriod, repaymentPeriod]); // Removed creditLineAmount as direct dependency for payment calc

  const generateProjectionData = () => {
    const projData: any[] = []; // Explicit type
    let balance = initialWithdrawal;
    let rate = currentInterestRate;
    const totalYears = drawPeriod + repaymentPeriod;
    let cumulativeInterest = 0;

    if (initialWithdrawal <= 0) {
        setProjectionData([]);
        return;
    }

    // Year 0: Initial state
    projData.push({
        year: 0,
        balance: Math.round(balance),
        payment: 0,
        rate: rate.toFixed(2),
        phase: 'Start',
        interestPaid: 0,
        principalPaid: 0,
        cumulativeInterest: 0,
    });

    for (let year = 1; year <= totalYears; year++) {
        let annualInterestPaid = 0;
        let annualPrincipalPaid = 0;
        let monthlyPayment = 0;
        const startOfYearBalance = balance;

        // During draw period - interest only payments assumed on current balance
        if (year <= drawPeriod) {
            const monthlyRate = rate / 100 / 12;
            monthlyPayment = startOfYearBalance * monthlyRate; // Interest-only
            annualInterestPaid = monthlyPayment * 12;
            annualPrincipalPaid = 0; // No principal paid during draw period in this model
            balance = startOfYearBalance; // Balance doesn't decrease unless extra payments made (not modeled here)
            cumulativeInterest += annualInterestPaid;

            projData.push({
                year,
                balance: Math.round(balance),
                payment: monthlyPayment.toFixed(2),
                rate: rate.toFixed(2),
                phase: 'Draw',
                interestPaid: Math.round(annualInterestPaid),
                principalPaid: Math.round(annualPrincipalPaid),
                cumulativeInterest: Math.round(cumulativeInterest),
            });

            // Increase rate for next year (at end of current year)
            rate = Math.min(18, rate + rateIncreasePerYear); // Cap rate at 18%
        }
        // During repayment period - principal + interest
        else {
            const repaymentYearsRemaining = drawPeriod + repaymentPeriod - year + 1;
            const repaymentMonthsRemaining = repaymentYearsRemaining * 12;
            const monthlyRate = rate / 100 / 12;

            if (balance <= 0) { // If balance already paid off
                 monthlyPayment = 0;
                 annualInterestPaid = 0;
                 annualPrincipalPaid = 0;
            } else if (monthlyRate > 0) {
                monthlyPayment = (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -repaymentMonthsRemaining));
            } else { // Handle 0% rate during repayment
                monthlyPayment = balance / repaymentMonthsRemaining;
            }

            let tempBalance = balance;
            annualInterestPaid = 0;
            annualPrincipalPaid = 0;
            // Calculate annual amounts by simulating 12 months
            for (let month = 0; month < 12; month++) {
                if (tempBalance <= 0) break;
                const interestForMonth = tempBalance * monthlyRate;
                let principalForMonth = monthlyPayment - interestForMonth;

                // Adjust final payment
                if (tempBalance - principalForMonth < 0) {
                    principalForMonth = tempBalance;
                    monthlyPayment = interestForMonth + principalForMonth; // Adjust last month's payment
                }

                annualInterestPaid += interestForMonth;
                annualPrincipalPaid += principalForMonth;
                tempBalance -= principalForMonth;
            }
            balance = Math.max(0, tempBalance); // Update year-end balance
            cumulativeInterest += annualInterestPaid;

            projData.push({
                year,
                balance: Math.round(balance),
                payment: monthlyPayment.toFixed(2), // Show the calculated monthly P&I payment
                rate: rate.toFixed(2),
                phase: 'Repayment',
                interestPaid: Math.round(annualInterestPaid),
                principalPaid: Math.round(annualPrincipalPaid),
                cumulativeInterest: Math.round(cumulativeInterest),
            });

             // Increase rate for next year (at end of current year)
            rate = Math.min(18, rate + rateIncreasePerYear); // Cap rate at 18%

            if (balance <= 0) break; // Stop projection if paid off
        }
    }

    setProjectionData(projData);
  };

  // --- Render Logic ---
  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Home className="h-6 w-6" />
          HELOC Calculator
        </CardTitle>
        <CardDescription className="text-finance-primary-foreground/90">
          Estimate payments and project costs for a Home Equity Line of Credit.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="propertyLoan">
                  <Landmark className="h-4 w-4 mr-2" /> Property & Loan
                </TabsTrigger>
                <TabsTrigger value="helocTerms">
                  <Clock className="h-4 w-4 mr-2" /> HELOC Terms
                </TabsTrigger>
                <TabsTrigger value="rates">
                  <TrendingUp className="h-4 w-4 mr-2" /> Rates
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
                <Card className="border-dashed border-blue-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                      <Percent className="h-5 w-5" /> Loan-to-Value (LTV) Cap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* LTV Cap */}
                    <div className="space-y-2 max-w-xs">
                      <Label htmlFor="ltvCap" className="flex items-center">
                        LTV Cap
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Maximum combined loan-to-value ratio allowed by the lender (typically 80-85%).</p></TooltipContent>
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

              {/* HELOC Terms Tab */}
              <TabsContent value="helocTerms" className="space-y-6">
                <Card className="border-dashed border-green-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <DollarSign className="h-5 w-5" /> Credit Line & Withdrawal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Credit Line Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="creditLineAmount" className="flex items-center">
                        Credit Line Amount
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Requested HELOC amount (Max available: {formatCurrency(maxCreditLine)})</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                          id="creditLineAmount"
                          type="number"
                          value={creditLineAmount}
                          onChange={(e) => setCreditLineAmount(Number(e.target.value) || 0)}
                          className="input-field rounded-l-none"
                          min="0" max={maxCreditLine}
                        />
                      </div>
                      <Slider
                        value={[creditLineAmount]}
                        onValueChange={(value) => setCreditLineAmount(value[0])}
                        max={maxCreditLine} step={1000} className="mt-2"
                        disabled={maxCreditLine <= 0}
                      />
                    </div>
                    {/* Initial Withdrawal */}
                    <div className="space-y-2">
                      <Label htmlFor="initialWithdrawal" className="flex items-center">
                        Initial Withdrawal
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Amount you plan to borrow immediately.</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                          id="initialWithdrawal"
                          type="number"
                          value={initialWithdrawal}
                          onChange={(e) => setInitialWithdrawal(Number(e.target.value) || 0)}
                          className="input-field rounded-l-none"
                          min="0" max={creditLineAmount}
                        />
                      </div>
                      <Slider
                        value={[initialWithdrawal]}
                        onValueChange={(value) => setInitialWithdrawal(value[0])}
                        max={creditLineAmount} step={1000} className="mt-2"
                        disabled={creditLineAmount <= 0}
                      />
                    </div>
                  </CardContent>
                </Card>
                 <Card className="border-dashed border-green-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <Clock className="h-5 w-5" /> Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Draw Period */}
                    <div className="space-y-2">
                      <Label htmlFor="drawPeriod">Draw Period (Years)</Label>
                      <div className="flex items-center">
                        <Input
                          id="drawPeriod"
                          type="number"
                          value={drawPeriod}
                          onChange={(e) => setDrawPeriod(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="1" max="15" step="1"
                        />
                        <span className="input-suffix">years</span>
                      </div>
                      <Slider
                        value={[drawPeriod]}
                        onValueChange={(value) => setDrawPeriod(value[0])}
                        min={1} max={15} step={1} className="mt-2"
                      />
                    </div>
                    {/* Repayment Period */}
                    <div className="space-y-2">
                      <Label htmlFor="repaymentPeriod">Repayment Period (Years)</Label>
                      <div className="flex items-center">
                        <Input
                          id="repaymentPeriod"
                          type="number"
                          value={repaymentPeriod}
                          onChange={(e) => setRepaymentPeriod(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="5" max="30" step="1"
                        />
                        <span className="input-suffix">years</span>
                      </div>
                      <Slider
                        value={[repaymentPeriod]}
                        onValueChange={(value) => setRepaymentPeriod(value[0])}
                        min={5} max={30} step={1} className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rates Tab */}
              <TabsContent value="rates" className="space-y-6">
                <Card className="border-dashed border-purple-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                      <Percent className="h-5 w-5" /> Interest Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Interest Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="currentInterestRate">Starting Interest Rate</Label>
                      <div className="flex items-center">
                        <Input
                          id="currentInterestRate"
                          type="number"
                          value={currentInterestRate}
                          onChange={(e) => setCurrentInterestRate(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="1" max="18" step="0.125"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <Slider
                        value={[currentInterestRate]}
                        onValueChange={(value) => setCurrentInterestRate(value[0])}
                        min={1} max={18} step={0.125} className="mt-2"
                      />
                    </div>
                    {/* Annual Rate Increase */}
                    <div className="space-y-2">
                      <Label htmlFor="rateIncreasePerYear" className="flex items-center">
                        Est. Annual Rate Increase
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Estimated average increase per year (HELOC rates are variable).</p></TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="rateIncreasePerYear"
                          type="number"
                          value={rateIncreasePerYear}
                          onChange={(e) => setRateIncreasePerYear(Number(e.target.value) || 0)}
                          className="input-field rounded-r-none"
                          min="0" max="3" step="0.05"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                      <Slider
                        value={[rateIncreasePerYear]}
                        onValueChange={(value) => setRateIncreasePerYear(value[0])}
                        min={0} max={3} step={0.05} className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="sticky top-6"> {/* Make summary sticky */}
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> HELOC Summary
                </CardTitle>
                <CardDescription>Estimated payments and available credit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <dl className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Home Value</dt>
                        <dd>{formatCurrency(homeValue)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Mortgage Balance</dt>
                        <dd>{formatCurrency(mortgageBalance)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Home Equity</dt>
                        <dd>{formatCurrency(currentEquity)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Max Available HELOC ({ltvCap}%)</dt>
                        <dd className="font-semibold">{formatCurrency(maxCreditLine)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Selected Credit Line</dt>
                        <dd className="font-semibold">{formatCurrency(creditLineAmount)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Initial Withdrawal</dt>
                        <dd className="font-semibold">{formatCurrency(initialWithdrawal)}</dd>
                    </div>
                     <div className="flex justify-between py-1 border-b">
                        <dt className="text-muted-foreground">Est. Interest-Only Payment</dt>
                        <dd className="font-semibold text-orange-600">{formatCurrency(interestOnlyPayment)} / mo</dd>
                    </div>
                     <div className="flex justify-between py-1">
                        <dt className="text-muted-foreground">Est. Repayment Payment (P&I)</dt>
                        <dd className="font-semibold text-red-600">{formatCurrency(repaymentPayment)} / mo</dd>
                    </div>
                 </dl>
              </CardContent>
            </Card>

            {/* Projections Card */}
             {projectionData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5" /> Payment & Balance Projection
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="chart">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="chart">Chart</TabsTrigger>
                                <TabsTrigger value="table">Table</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chart" className="mt-4">
                                <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={projectionData} margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                    <YAxis yAxisId="left" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10 }} />
                                    <RechartsTooltip
                                        formatter={(value: number, name: string) => {
                                            if (name === 'balance') return formatCurrency(value);
                                            if (name === 'rate') return `${value}%`;
                                            if (name === 'payment') return formatCurrency(value);
                                            return value;
                                        }}
                                        labelFormatter={(label) => `Year ${label}`}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="balance" name="Balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    <Line yAxisId="right" type="monotone" dataKey="rate" name="Rate" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    {/* <Line yAxisId="left" type="monotone" dataKey="payment" name="Monthly Payment" stroke="#16a34a" strokeWidth={2} dot={false} /> */}
                                    </LineChart>
                                </ResponsiveContainer>
                                </div>
                            </TabsContent>
                            <TabsContent value="table" className="mt-4">
                                <div className="max-h-[300px] overflow-auto border rounded-md">
                                <Table className="text-xs">
                                    <TableHeader className="sticky top-0 bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-2 py-1">Year</TableHead>
                                        <TableHead className="px-2 py-1 text-right">Balance</TableHead>
                                        <TableHead className="px-2 py-1 text-right">Payment</TableHead>
                                        <TableHead className="px-2 py-1 text-right">Rate</TableHead>
                                        <TableHead className="px-2 py-1">Phase</TableHead>
                                        <TableHead className="px-2 py-1 text-right">Interest</TableHead>
                                        <TableHead className="px-2 py-1 text-right">Principal</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {projectionData.map((data) => (
                                        <TableRow key={data.year}>
                                        <TableCell className="px-2 py-1 font-medium">{data.year}</TableCell>
                                        <TableCell className="px-2 py-1 text-right">{formatCurrency(data.balance)}</TableCell>
                                        <TableCell className="px-2 py-1 text-right">{data.year > 0 ? formatCurrency(data.payment) : '-'}</TableCell>
                                        <TableCell className="px-2 py-1 text-right">{data.rate}%</TableCell>
                                        <TableCell className="px-2 py-1">{data.phase}</TableCell>
                                        <TableCell className="px-2 py-1 text-right">{formatCurrency(data.interestPaid)}</TableCell>
                                        <TableCell className="px-2 py-1 text-right">{formatCurrency(data.principalPaid)}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        {/* Footer can contain save/export buttons later */}
        <p className="text-xs text-muted-foreground">
            *Estimates are based on provided inputs and simplified assumptions. Actual payments and rates may vary. Consult with a financial advisor.
        </p>
      </CardFooter>
    </Card>
  );
};

// CSS-in-JS for input styling (can be moved to a CSS file)
const inputPrefixSuffixBase = "text-sm text-muted-foreground p-2 bg-gray-100 border";
const inputPrefixStyle = `${inputPrefixSuffixBase} border-r-0 rounded-l-md`;
const inputSuffixStyle = `${inputPrefixSuffixBase} border-l-0 rounded-r-md`;
const inputFieldStyle = "flex-1 min-w-0"; // Ensure input field takes up space

// Add these styles to your global CSS or component-specific CSS:
/*
.input-prefix { @apply text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md; }
.input-suffix { @apply text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md; }
.input-field { @apply flex-1 min-w-0; }
*/


export default HelocCalculator;
