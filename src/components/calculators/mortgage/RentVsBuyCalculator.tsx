import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Keep for potential future use
import { Slider } from '@/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
  Home,
  Calculator,
  CircleDollarSign,
  TrendingUp,
  Building2,
  PiggyBank,
  Info,
  Percent,
  CalendarDays,
  Landmark,
  ShieldCheck,
  Wrench,
  LineChart as LineChartIcon, // Alias to avoid conflict
  Wallet,
  BarChart3, // Using a different icon for assumptions
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils'; // Use shared utils
import { calculateMonthlyMortgage } from '@/utils/calculatorUtils'; // Keep specific util if needed

// --- Constants and Defaults ---
const RENT_VS_BUY_DEFAULTS = {
  homePrice: 350000,
  downPayment: 70000,
  downPaymentPercent: 20,
  loanTerm: 30,
  interestRate: 6.5,
  propertyTaxRate: 1.2, // Use rate for consistency
  homeInsurance: 1200,
  maintenanceRate: 0.5, // Use rate of home value
  homeAppreciation: 3.5,
  monthlyRent: 2000,
  rentIncrease: 3,
  rentInsurance: 200,
  investmentReturn: 7,
  yearsToAnalyze: 10,
  closingCostsRate: 3, // Added closing costs
  sellingCostsRate: 6, // Added selling costs
};

const RentVsBuyCalculator: React.FC = () => {
  // --- State Management ---
  const [homePrice, setHomePrice] = useState(RENT_VS_BUY_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(RENT_VS_BUY_DEFAULTS.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(RENT_VS_BUY_DEFAULTS.downPaymentPercent);
  const [loanTerm, setLoanTerm] = useState(RENT_VS_BUY_DEFAULTS.loanTerm);
  const [interestRate, setInterestRate] = useState(RENT_VS_BUY_DEFAULTS.interestRate);
  const [propertyTaxRate, setPropertyTaxRate] = useState(RENT_VS_BUY_DEFAULTS.propertyTaxRate);
  const [homeInsurance, setHomeInsurance] = useState(RENT_VS_BUY_DEFAULTS.homeInsurance);
  const [maintenanceRate, setMaintenanceRate] = useState(RENT_VS_BUY_DEFAULTS.maintenanceRate);
  const [homeAppreciation, setHomeAppreciation] = useState(RENT_VS_BUY_DEFAULTS.homeAppreciation);
  const [monthlyRent, setMonthlyRent] = useState(RENT_VS_BUY_DEFAULTS.monthlyRent);
  const [rentIncrease, setRentIncrease] = useState(RENT_VS_BUY_DEFAULTS.rentIncrease);
  const [rentInsurance, setRentInsurance] = useState(RENT_VS_BUY_DEFAULTS.rentInsurance);
  const [investmentReturn, setInvestmentReturn] = useState(RENT_VS_BUY_DEFAULTS.investmentReturn);
  const [yearsToAnalyze, setYearsToAnalyze] = useState(RENT_VS_BUY_DEFAULTS.yearsToAnalyze);
  const [closingCostsRate, setClosingCostsRate] = useState(RENT_VS_BUY_DEFAULTS.closingCostsRate);
  const [sellingCostsRate, setSellingCostsRate] = useState(RENT_VS_BUY_DEFAULTS.sellingCostsRate);

  // Derived state
  const [loanAmount, setLoanAmount] = useState(RENT_VS_BUY_DEFAULTS.homePrice - RENT_VS_BUY_DEFAULTS.downPayment);

  // Results state
  const [results, setResults] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('buying'); // Default tab

  // --- Effects ---
  // Update loan amount and down payment percentage when home price or down payment changes
  useEffect(() => {
    const newLoanAmount = homePrice - downPayment;
    setLoanAmount(newLoanAmount);
    if (homePrice > 0) {
      const newDownPaymentPercent = (downPayment / homePrice) * 100;
      setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    } else {
      setDownPaymentPercent(0);
    }
  }, [homePrice, downPayment]);

  // Handle down payment percentage changes
  const handleDownPaymentPercentChange = (newPercentage: number) => {
    setDownPaymentPercent(newPercentage);
    const newDownPayment = (homePrice * newPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  // Recalculate when any input changes
  useEffect(() => {
    calculateComparison();
  }, [
    homePrice, downPayment, loanTerm, interestRate, propertyTaxRate,
    homeInsurance, maintenanceRate, homeAppreciation, monthlyRent,
    rentIncrease, rentInsurance, investmentReturn, yearsToAnalyze,
    closingCostsRate, sellingCostsRate // Added dependencies
  ]);

  // --- Calculation Logic ---
  const calculateComparison = () => {
    // Basic validation
    if (homePrice <= 0 || downPayment < 0 || loanTerm <= 0 || interestRate < 0 || yearsToAnalyze <= 0) {
        setResults(null);
        setChartData([]);
        return;
    }

    const currentLoanAmount = homePrice - downPayment;
    if (currentLoanAmount <= 0) {
        // Handle case where down payment covers full price (or more)
        // This scenario might need specific handling, e.g., no mortgage payment
        // For now, let's assume a loan is always taken if buying
    }

    const monthlyMortgage = calculateMonthlyMortgage(currentLoanAmount, interestRate, loanTerm);
    // Move annual tax/maintenance calculation inside the loop
    const annualMaintenance = homePrice * (maintenanceRate / 100);

    const data = [];
    let buyerNetWorth = downPayment - (homePrice * (closingCostsRate / 100)); // Start with equity minus closing costs
    let buyerEquity = downPayment; // Initialize buyer equity before the loop
    let renterNetWorth = downPayment; // Renter invests the down payment amount
    let currentRent = monthlyRent;
    let houseValue = homePrice;
    let loanBalance = currentLoanAmount;
    let totalBuyerCosts = homePrice * (closingCostsRate / 100); // Initial cost
    let totalRenterCosts = 0;
    let cumulativeBuyerSavings = 0; // Track potential savings if buyer invested difference
    let cumulativeRenterSavings = downPayment; // Renter starts with down payment invested

    // Year 0 data point (initial state)
    data.push({
        year: 0,
        houseValue: Math.round(houseValue),
        buyerEquity: Math.round(downPayment), // Initial equity is down payment
        buyerNetWorth: Math.round(buyerNetWorth),
        renterNetWorth: Math.round(renterNetWorth),
        buyerCosts: Math.round(totalBuyerCosts),
        renterCosts: Math.round(totalRenterCosts),
        loanBalance: Math.round(loanBalance),
    });

    for (let year = 1; year <= yearsToAnalyze; year++) {
        // --- Update house value first for the current year ---
        if (year > 0) { // No appreciation in year 0
             houseValue *= (1 + homeAppreciation / 100);
        }

        // --- Annual Costs (calculated based on current year's house value) ---
        const annualPropertyTax = houseValue * (propertyTaxRate / 100); // Use current houseValue
        const annualMaintenance = houseValue * (maintenanceRate / 100); // Use current houseValue
        const annualMortgagePayment = monthlyMortgage * 12;
        const annualInterestPaid = calculateAnnualInterestPaid(loanBalance, interestRate);
        const annualPrincipalPaid = annualMortgagePayment - annualInterestPaid;

        const buyerAnnualHousingCosts = annualInterestPaid + annualPropertyTax + homeInsurance + annualMaintenance; // Now uses year-specific tax/maint
        const renterAnnualHousingCosts = currentRent * 12 + rentInsurance;

        totalBuyerCosts += buyerAnnualHousingCosts; // Accumulate only non-recoverable costs (interest, tax, ins, maint)
        totalRenterCosts += renterAnnualHousingCosts;

        // --- Asset/Investment Growth ---
        // houseValue appreciation moved to the beginning of the loop for year > 0
        loanBalance -= annualPrincipalPaid;
        if (loanBalance < 0) loanBalance = 0; // Ensure balance doesn't go negative

        buyerEquity = houseValue - loanBalance; // Update buyerEquity declared outside the loop

        // Renter invests the initial down payment + the difference in annual costs
        const annualCostDifference = buyerAnnualHousingCosts - renterAnnualHousingCosts;
        // Renter also invests the principal portion the buyer paid
        const renterInvestmentContribution = annualCostDifference + annualPrincipalPaid;

        cumulativeRenterSavings = cumulativeRenterSavings * (1 + investmentReturn / 100) + renterInvestmentContribution;
        renterNetWorth = cumulativeRenterSavings;

        // Buyer's net worth includes equity, minus selling costs if sold at end of year
        // For the chart, we usually show equity build-up, not necessarily immediate sale value
        buyerNetWorth = buyerEquity; // Simplified for chart clarity

        data.push({
            year,
            houseValue: Math.round(houseValue),
            buyerEquity: Math.round(buyerEquity),
            buyerNetWorth: Math.round(buyerNetWorth), // Net worth based on equity
            renterNetWorth: Math.round(renterNetWorth),
            buyerCosts: Math.round(totalBuyerCosts), // Cumulative non-recoverable costs
            renterCosts: Math.round(totalRenterCosts),
            loanBalance: Math.round(loanBalance),
        });

        // Update rent for next year
        currentRent *= (1 + rentIncrease / 100);
    }

    // Calculate final results including potential selling costs for buyer
    const finalSellingCosts = houseValue * (sellingCostsRate / 100);
    const finalBuyerNetWorthAfterSelling = buyerEquity - finalSellingCosts;

    setChartData(data);
    // For the summary display, calculate the final year's monthly tax/maintenance
    const finalAnnualPropertyTax = houseValue * (propertyTaxRate / 100);
    const finalAnnualMaintenance = houseValue * (maintenanceRate / 100);

    setResults({
        monthlyMortgage,
        monthlyPropertyTax: finalAnnualPropertyTax / 12, // Use final year's value for display
        monthlyHomeInsurance: homeInsurance / 12, // Assuming insurance is fixed annual amount
        monthlyMaintenance: finalAnnualMaintenance / 12, // Use final year's value for display
        totalBuyerMonthly: monthlyMortgage + (finalAnnualPropertyTax / 12) + (homeInsurance / 12) + (finalAnnualMaintenance / 12),
        totalRenterMonthly: monthlyRent + (rentInsurance / 12), // Initial monthly rent cost
        totalBuyerCosts, // Cumulative non-recoverable costs over the period
        totalRenterCosts, // Cumulative rent + insurance over the period
        finalBuyerNetWorth: buyerNetWorth, // Equity at end of period
        finalRenterNetWorth: renterNetWorth, // Renter's investment value at end of period
        finalHouseValue: houseValue,
        finalBuyerEquity: buyerEquity,
        finalSellingCosts,
        finalBuyerNetWorthAfterSelling,
        breakEvenYear: findBreakEvenYear(data), // Find when buyer net worth surpasses renter
    });
  };

  // Helper to calculate annual interest for a given balance and rate
  const calculateAnnualInterestPaid = (balance: number, rate: number): number => {
      if (balance <= 0) return 0;
      const monthlyRate = (rate / 100) / 12;
      let interestPaid = 0;
      let currentBalance = balance;
      const monthlyPayment = calculateMonthlyMortgage(balance, rate, loanTerm); // Approx payment for this year

      for (let i = 0; i < 12; i++) {
          const interestForMonth = currentBalance * monthlyRate;
          interestPaid += interestForMonth;
          const principalForMonth = monthlyPayment - interestForMonth;
          currentBalance -= principalForMonth;
          if (currentBalance <= 0) break; // Stop if loan paid off mid-year
      }
      return interestPaid;
  };

  // Helper to find break-even year
  const findBreakEvenYear = (data: any[]): number | string => {
      for (let i = 1; i < data.length; i++) {
          // Using equity as the primary comparison metric for "owning" advantage
          if (data[i].buyerEquity > data[i].renterNetWorth) {
              return data[i].year;
          }
      }
      return "Never (within analysis period)";
  };


  // --- Render Logic ---
  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Home className="h-6 w-6" />
          Rent vs. Buy Calculator
        </CardTitle>
        <CardDescription className="text-finance-primary-foreground/90">
          Compare the financial implications of renting versus buying a home over time.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="buying">
              <Home className="h-4 w-4 mr-2" /> Buying
            </TabsTrigger>
            <TabsTrigger value="renting">
              <Building2 className="h-4 w-4 mr-2" /> Renting
            </TabsTrigger>
            <TabsTrigger value="assumptions">
              <BarChart3 className="h-4 w-4 mr-2" /> Assumptions
            </TabsTrigger>
          </TabsList>

          {/* Buying Inputs Tab */}
          <TabsContent value="buying" className="space-y-6">
            <Card className="border-dashed border-blue-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                  <Landmark className="h-5 w-5" /> Home & Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home Price */}
                <div className="space-y-2">
                  <Label htmlFor="homePrice" className="flex items-center">
                    Home Price
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The purchase price of the home.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                    <Input
                      id="homePrice"
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="rounded-l-none"
                      min="0"
                    />
                  </div>
                  <Slider
                    value={[homePrice]}
                    onValueChange={(value) => setHomePrice(value[0])}
                    max={1500000}
                    step={10000}
                    className="mt-2"
                  />
                </div>

                {/* Down Payment */}
                <div className="space-y-2">
                  <Label htmlFor="downPayment" className="flex items-center">
                    Down Payment
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The initial amount paid upfront. Affects loan amount and potentially PMI.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="rounded-none"
                      min="0"
                      max={homePrice} // Cannot put down more than home price
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">
                      ({formatPercentage(downPaymentPercent)})
                    </span>
                  </div>
                  <Slider
                    value={[downPaymentPercent]}
                    onValueChange={(value) => handleDownPaymentPercentChange(value[0])}
                    max={100}
                    step={0.5}
                    className="mt-2"
                  />
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="flex items-center">
                    Interest Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The annual interest rate for the mortgage loan.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      step={0.125}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    max={15}
                    step={0.125}
                    className="mt-2"
                  />
                </div>

                {/* Loan Term */}
                <div className="space-y-2">
                  <Label htmlFor="loanTerm" className="flex items-center">
                    Loan Term
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The duration of the mortgage loan in years.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="rounded-r-none"
                      min="1"
                      max="40"
                    />
                     <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">years</span>
                  </div>
                   <Slider
                    value={[loanTerm]}
                    onValueChange={(value) => setLoanTerm(value[0])}
                    max={40}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-blue-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                  <CircleDollarSign className="h-5 w-5" /> Ongoing Buying Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Property Tax Rate */}
                 <div className="space-y-2">
                  <Label htmlFor="propertyTaxRate" className="flex items-center">
                    Property Tax Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual property tax as a percentage of home value.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="propertyTaxRate"
                      type="number"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                      step={0.05}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>

                {/* Home Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="homeInsurance" className="flex items-center">
                    Annual Home Insurance
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated annual cost for homeowner's insurance.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                     <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                    <Input
                      id="homeInsurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      className="rounded-l-none"
                      min="0"
                    />
                  </div>
                </div>

                {/* Maintenance Rate */}
                <div className="space-y-2">
                  <Label htmlFor="maintenanceRate" className="flex items-center">
                    Annual Maintenance Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated annual maintenance/repairs as a percentage of home value.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="maintenanceRate"
                      type="number"
                      value={maintenanceRate}
                      onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Renting Inputs Tab */}
          <TabsContent value="renting" className="space-y-6">
             <Card className="border-dashed border-green-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <Wallet className="h-5 w-5" /> Renting Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Rent */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent" className="flex items-center">
                    Initial Monthly Rent
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The starting monthly rent payment.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                    <Input
                      id="monthlyRent"
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="rounded-l-none"
                      min="0"
                    />
                  </div>
                </div>

                {/* Renter's Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="rentInsurance" className="flex items-center">
                    Annual Renter's Insurance
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated annual cost for renter's insurance.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                    <Input
                      id="rentInsurance"
                      type="number"
                      value={rentInsurance}
                      onChange={(e) => setRentInsurance(Number(e.target.value))}
                      className="rounded-l-none"
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assumptions Tab */}
          <TabsContent value="assumptions" className="space-y-6">
             <Card className="border-dashed border-purple-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                  <TrendingUp className="h-5 w-5" /> Growth & Timeframe
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Home Appreciation Rate */}
                <div className="space-y-2">
                  <Label htmlFor="homeAppreciation" className="flex items-center">
                    Home Appreciation Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual increase in home value.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="homeAppreciation"
                      type="number"
                      value={homeAppreciation}
                      onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>

                {/* Annual Rent Increase */}
                <div className="space-y-2">
                  <Label htmlFor="rentIncrease" className="flex items-center">
                    Annual Rent Increase
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual percentage increase in rent.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="rentIncrease"
                      type="number"
                      value={rentIncrease}
                      onChange={(e) => setRentIncrease(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>

                {/* Investment Return Rate */}
                <div className="space-y-2">
                  <Label htmlFor="investmentReturn" className="flex items-center">
                    Investment Return Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual return rate if the down payment and cost differences were invested.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="investmentReturn"
                      type="number"
                      value={investmentReturn}
                      onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-purple-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                  <CalendarDays className="h-5 w-5" /> Analysis Period & Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Years to Analyze */}
                <div className="space-y-2">
                  <Label htmlFor="yearsToAnalyze" className="flex items-center">
                    Years to Analyze
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The number of years to compare renting vs. buying.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="yearsToAnalyze"
                      type="number"
                      value={yearsToAnalyze}
                      onChange={(e) => setYearsToAnalyze(Number(e.target.value))}
                      min={1}
                      max={50}
                      className="rounded-r-none"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">years</span>
                  </div>
                  <Slider
                    value={[yearsToAnalyze]}
                    onValueChange={(value) => setYearsToAnalyze(value[0])}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Closing Costs Rate */}
                <div className="space-y-2">
                  <Label htmlFor="closingCostsRate" className="flex items-center">
                    Closing Costs Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>One-time costs associated with buying a home (e.g., appraisal, title insurance) as a percentage of home price.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="closingCostsRate"
                      type="number"
                      value={closingCostsRate}
                      onChange={(e) => setClosingCostsRate(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>

                {/* Selling Costs Rate */}
                <div className="space-y-2">
                  <Label htmlFor="sellingCostsRate" className="flex items-center">
                    Selling Costs Rate
                    <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Costs associated with selling the home (e.g., agent commissions) as a percentage of the final home value.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="sellingCostsRate"
                      type="number"
                      value={sellingCostsRate}
                      onChange={(e) => setSellingCostsRate(Number(e.target.value))}
                      step={0.1}
                      className="rounded-r-none"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* --- Results Section --- */}
        {results && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-finance-primary border-b pb-2 mb-6">
              Comparison Results after {yearsToAnalyze} Years
            </h2>

            {/* Key Metrics Summary */}
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                  <PiggyBank className="h-5 w-5" /> Financial Outcome Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">Buyer Net Worth (After Selling Costs)</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.finalBuyerNetWorthAfterSelling)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">Renter Net Worth (Investments)</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(results.finalRenterNetWorth)}</p>
                </div>
                 <div className="p-4 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">Break-Even Year (Equity)</p>
                  <p className="text-2xl font-bold text-purple-600">{results.breakEvenYear}</p>
                   <TooltipProvider>
                      <UITooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help inline-block align-middle" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The year when the buyer's home equity surpasses the renter's accumulated investments.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> Initial Monthly Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 text-blue-700">Buying Costs (PITI + Maint.)</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between"><span>Mortgage (P&I):</span> <span>{formatCurrency(results.monthlyMortgage)}</span></li>
                    <li className="flex justify-between"><span>Property Tax:</span> <span>{formatCurrency(results.monthlyPropertyTax)}</span></li>
                    <li className="flex justify-between"><span>Home Insurance:</span> <span>{formatCurrency(results.monthlyHomeInsurance)}</span></li>
                    <li className="flex justify-between"><span>Maintenance:</span> <span>{formatCurrency(results.monthlyMaintenance)}</span></li>
                    <li className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total Monthly:</span> <span>{formatCurrency(results.totalBuyerMonthly)}</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">Renting Costs</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between"><span>Monthly Rent:</span> <span>{formatCurrency(monthlyRent)}</span></li>
                    <li className="flex justify-between"><span>Renter's Insurance:</span> <span>{formatCurrency(rentInsurance / 12)}</span></li>
                    <li className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total Monthly:</span> <span>{formatCurrency(results.totalRenterMonthly)}</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Net Worth Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" /> Net Worth Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        label={{ value: 'Net Worth', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle' } }}
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        width={70}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatCurrency(value), name === 'buyerNetWorth' ? 'Buyer Net Worth (Equity)' : 'Renter Net Worth (Investments)']}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                        itemStyle={{ padding: '2px 0' }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="buyerNetWorth" // Plotting equity for buyer
                        name="Buyer Net Worth (Equity)"
                        stroke="#3b82f6" // Blue
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="renterNetWorth"
                        name="Renter Net Worth (Investments)"
                        stroke="#16a34a" // Green
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

             {/* Detailed Breakdown Table (Optional - can add later if needed) */}

          </div>
        )}
      </CardContent>
      {/* CardFooter can be added later for save/export buttons */}
      {/* <CardFooter className="flex justify-end pt-4 border-t">
        <Button variant="outline" size="sm">Save Results</Button>
      </CardFooter> */}
    </Card>
  );
};

export default RentVsBuyCalculator;
