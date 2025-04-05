import { useState, useEffect } from 'react';
import { Home, Download, Save, Info, DollarSign, Percent, MapPin, Landmark, FileText, ShieldCheck, Scale, Banknote, CalendarDays, PlusCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Added cn utility

const CALCULATOR_ID = 'cost-to-close';

// State-specific property tax rates and transfer taxes (Keep as is)
const STATE_RATES = {
  AL: { propertyTax: 0.42, transferTax: 0.1 }, AK: { propertyTax: 1.19, transferTax: 0 }, AZ: { propertyTax: 0.66, transferTax: 0.1 },
  AR: { propertyTax: 0.63, transferTax: 0.33 }, CA: { propertyTax: 0.76, transferTax: 0.11 }, CO: { propertyTax: 0.51, transferTax: 0.01 },
  CT: { propertyTax: 2.14, transferTax: 1.25 }, DE: { propertyTax: 0.57, transferTax: 2 }, FL: { propertyTax: 0.89, transferTax: 0.7 },
  GA: { propertyTax: 0.92, transferTax: 0.1 }, HI: { propertyTax: 0.28, transferTax: 0.1 }, ID: { propertyTax: 0.69, transferTax: 0 },
  IL: { propertyTax: 2.27, transferTax: 0.1 }, IN: { propertyTax: 0.85, transferTax: 0 }, IA: { propertyTax: 1.53, transferTax: 0.16 },
  KS: { propertyTax: 1.4, transferTax: 0 }, KY: { propertyTax: 0.86, transferTax: 0.1 }, LA: { propertyTax: 0.55, transferTax: 0 },
  ME: { propertyTax: 1.36, transferTax: 0.44 }, MD: { propertyTax: 1.09, transferTax: 0.5 }, MA: { propertyTax: 1.22, transferTax: 0.456 },
  MI: { propertyTax: 1.54, transferTax: 0.75 }, MN: { propertyTax: 1.12, transferTax: 0.33 }, MS: { propertyTax: 0.81, transferTax: 0 },
  MO: { propertyTax: 0.97, transferTax: 0 }, MT: { propertyTax: 0.84, transferTax: 0 }, NE: { propertyTax: 1.73, transferTax: 0.225 },
  NV: { propertyTax: 0.69, transferTax: 0.51 }, NH: { propertyTax: 2.18, transferTax: 0.75 }, NJ: { propertyTax: 2.49, transferTax: 1 },
  NM: { propertyTax: 0.80, transferTax: 0 }, NY: { propertyTax: 1.72, transferTax: 0.4 }, NC: { propertyTax: 0.84, transferTax: 0.2 },
  ND: { propertyTax: 0.98, transferTax: 0 }, OH: { propertyTax: 1.57, transferTax: 0.1 }, OK: { propertyTax: 0.90, transferTax: 0 },
  OR: { propertyTax: 1.04, transferTax: 0.1 }, PA: { propertyTax: 1.58, transferTax: 1 }, RI: { propertyTax: 1.63, transferTax: 0.46 },
  SC: { propertyTax: 0.57, transferTax: 0.37 }, SD: { propertyTax: 1.28, transferTax: 0 }, TN: { propertyTax: 0.71, transferTax: 0.37 },
  TX: { propertyTax: 1.80, transferTax: 0 }, UT: { propertyTax: 0.63, transferTax: 0 }, VT: { propertyTax: 1.90, transferTax: 1.25 },
  VA: { propertyTax: 0.82, transferTax: 0.25 }, WA: { propertyTax: 0.98, transferTax: 1.28 }, WV: { propertyTax: 0.58, transferTax: 0.22 },
  WI: { propertyTax: 1.76, transferTax: 0.3 }, WY: { propertyTax: 0.61, transferTax: 0 }
};

const DEFAULTS = {
  homePrice: 350000,
  downPayment: 70000,
  downPaymentPercent: 20,
  loanAmount: 280000,
  state: 'TX',
  loanOriginationFeePercent: 1, // Changed to percent
  appraisalFee: 500,
  homeInspectionFee: 400,
  titleInsurance: 1000,
  escrowFee: 500,
  monthlyReserves: 6
};

interface ClosingCost {
  id: string;
  name: string;
  amount: number;
}

const CostToCloseCalculator = () => {
  const { toast } = useToast();
  const [homePrice, setHomePrice] = useState(DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULTS.downPaymentPercent);
  const [loanAmount, setLoanAmount] = useState(DEFAULTS.loanAmount);
  const [state, setState] = useState(DEFAULTS.state);
  const [loanOriginationFeePercent, setLoanOriginationFeePercent] = useState(DEFAULTS.loanOriginationFeePercent); // Renamed state
  const [appraisalFee, setAppraisalFee] = useState(DEFAULTS.appraisalFee);
  const [homeInspectionFee, setHomeInspectionFee] = useState(DEFAULTS.homeInspectionFee);
  const [titleInsurance, setTitleInsurance] = useState(DEFAULTS.titleInsurance);
  const [escrowFee, setEscrowFee] = useState(DEFAULTS.escrowFee);
  const [monthlyReserves, setMonthlyReserves] = useState(DEFAULTS.monthlyReserves);
  const [additionalCosts, setAdditionalCosts] = useState<ClosingCost[]>([]);

  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);
  const [activeTab, setActiveTab] = useState('homeLoan'); // Default tab

  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setHomePrice(savedData.homePrice || DEFAULTS.homePrice);
      setDownPayment(savedData.downPayment || DEFAULTS.downPayment);
      setDownPaymentPercent(savedData.downPaymentPercent || DEFAULTS.downPaymentPercent);
      setState(savedData.state || DEFAULTS.state);
      setLoanOriginationFeePercent(savedData.loanOriginationFeePercent || DEFAULTS.loanOriginationFeePercent); // Load renamed state
      setAppraisalFee(savedData.appraisalFee || DEFAULTS.appraisalFee);
      setHomeInspectionFee(savedData.homeInspectionFee || DEFAULTS.homeInspectionFee);
      setTitleInsurance(savedData.titleInsurance || DEFAULTS.titleInsurance);
      setEscrowFee(savedData.escrowFee || DEFAULTS.escrowFee);
      setMonthlyReserves(savedData.monthlyReserves || DEFAULTS.monthlyReserves);
      // Ensure amounts are numbers when loading additional costs
      setAdditionalCosts((savedData.additionalCosts || []).map((c: any) => ({ ...c, amount: Number(c.amount || 0) })));
      setDataStored(true);
    }
  }, []);

  useEffect(() => {
    const newLoanAmount = Math.max(0, homePrice - downPayment); // Ensure loan amount isn't negative
    setLoanAmount(newLoanAmount);
    if (homePrice > 0) {
      const newDownPaymentPercent = (downPayment / homePrice) * 100;
      setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    } else {
      setDownPaymentPercent(0);
    }
  }, [homePrice, downPayment]);

  const handleDownPaymentPercentChange = (newPercentage: number) => {
    setDownPaymentPercent(newPercentage);
    const newDownPayment = (homePrice * newPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  useEffect(() => {
    calculateCostToClose();
  }, [
    homePrice,
    downPayment, // loanAmount is derived, so downPayment is the direct dependency
    state,
    loanOriginationFeePercent, // Use renamed state
    appraisalFee,
    homeInspectionFee,
    titleInsurance,
    escrowFee,
    monthlyReserves,
    additionalCosts
  ]);

  const calculateCostToClose = () => {
     // Basic validation
    if (homePrice <= 0 || downPayment < 0) {
        setResults(null);
        return;
    }
    const currentLoanAmount = Math.max(0, homePrice - downPayment);

    // Loan origination fee
    const originationFeeAmount = (currentLoanAmount * loanOriginationFeePercent) / 100;

    // Get state-specific rates
    const stateRates = STATE_RATES[state as keyof typeof STATE_RATES] || { propertyTax: 0, transferTax: 0 };

    // Transfer tax
    const transferTaxAmount = (homePrice * stateRates.transferTax) / 100;

    // Monthly property tax estimate
    const annualPropertyTax = (homePrice * stateRates.propertyTax) / 100;
    const monthlyPropertyTax = annualPropertyTax / 12;

    // Monthly insurance estimate (rough estimate - could be an input)
    const annualInsurance = (homePrice * 0.0035); // 0.35% of home value
    const monthlyInsurance = annualInsurance / 12;

    // Monthly HOA (placeholder - could be made configurable)
    const monthlyHOA = 0;

    // Calculate total monthly payment for reserves (PITI + HOA)
    // Note: This doesn't include mortgage P&I as it's not needed for reserves calculation here
    const monthlyEscrowItems = monthlyPropertyTax + monthlyInsurance + monthlyHOA;
    const reservesAmount = monthlyEscrowItems * monthlyReserves;

    // Additional costs total
    const additionalCostsTotal = additionalCosts.reduce((sum, cost) => sum + Number(cost.amount || 0), 0); // Ensure amount is treated as number

    // Calculate totals
    const totalLoanFees = originationFeeAmount;
    const totalThirdPartyFees = appraisalFee + homeInspectionFee + titleInsurance + escrowFee;
    const totalTaxesGovtFees = transferTaxAmount; // Could add recording fees etc.
    const totalPrepaidsReserves = reservesAmount; // Could add prepaid interest, first year insurance premium etc.

    const totalClosingCosts = totalLoanFees + totalThirdPartyFees + totalTaxesGovtFees + additionalCostsTotal;

    // Total cash needed = Down Payment + Closing Costs + Reserves
    const totalCostToClose = downPayment + totalClosingCosts + totalPrepaidsReserves;

    setResults({
      downPayment,
      originationFeeAmount,
      appraisalFee,
      homeInspectionFee,
      titleInsurance,
      escrowFee,
      transferTaxAmount,
      additionalCostsTotal,
      reservesAmount,
      totalClosingCosts, // Costs excluding down payment and reserves
      totalPrepaidsReserves, // Just reserves for now
      totalCostToClose, // Grand total needed at closing
      monthlyEscrowItems, // For showing reserve calculation basis
      // Breakdown totals
      totalLoanFees,
      totalThirdPartyFees,
      totalTaxesGovtFees,
    });
  };

  const handleSaveData = () => {
    const dataToSave = {
      homePrice,
      downPayment,
      downPaymentPercent,
      state,
      loanOriginationFeePercent, // Save renamed state
      appraisalFee,
      homeInspectionFee,
      titleInsurance,
      escrowFee,
      monthlyReserves,
      additionalCosts,
      timestamp: Date.now()
    };
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);

    toast({
      title: "Data Saved",
      description: "Your cost to close calculator data has been saved locally.",
    });
  };

  // --- Additional Costs Handlers ---
  const addAdditionalCost = () => {
    setAdditionalCosts([...additionalCosts, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const updateAdditionalCost = (id: string, field: 'name' | 'amount', value: string | number) => {
    setAdditionalCosts(
      additionalCosts.map(cost =>
        cost.id === id ? { ...cost, [field]: value } : cost
      )
    );
  };

  const removeAdditionalCost = (id: string) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== id));
  };


  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
         <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                <Landmark className="h-6 w-6" />
                Cost to Close Calculator
                </CardTitle>
                <CardDescription className="text-finance-primary-foreground/90 mt-1">
                Estimate the total cash needed to complete your home purchase.
                </CardDescription>
            </div>
             {dataStored && (
                <TooltipProvider>
                    <UITooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 cursor-default">
                            <Save size={12}/> Saved
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Your inputs are saved locally in your browser.</p>
                    </TooltipContent>
                    </UITooltip>
                </TooltipProvider>
            )}
         </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="homeLoan">
                <Home className="h-4 w-4 mr-2" /> Home & Loan
                </TabsTrigger>
                <TabsTrigger value="fees">
                <FileText className="h-4 w-4 mr-2" /> Fees & Costs
                </TabsTrigger>
                <TabsTrigger value="reserves">
                <Banknote className="h-4 w-4 mr-2" /> Prepaids/Reserves
                </TabsTrigger>
            </TabsList>

            {/* Home & Loan Tab */}
            <TabsContent value="homeLoan" className="space-y-6">
                <Card className="border-dashed border-blue-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                        <DollarSign className="h-5 w-5" /> Purchase Details
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
                                <p>The initial amount paid upfront. Affects loan amount.</p>
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
                            max={homePrice}
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
                    </CardContent>
                </Card>
                 <Card className="border-dashed border-blue-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                        <MapPin className="h-5 w-5" /> Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         {/* State Selection */}
                        <div className="space-y-2 max-w-xs">
                            <Label htmlFor="state" className="flex items-center">
                                Property State
                                <TooltipProvider>
                                <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Select the state where the property is located. Affects property and transfer taxes.</p>
                                    </TooltipContent>
                                </UITooltip>
                                </TooltipProvider>
                            </Label>
                            <Select value={state} onValueChange={setState}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(STATE_RATES).map(([abbr, data]) => (
                                        <SelectItem key={abbr} value={abbr}>{abbr}</SelectItem> // Simplified display
                                    ))}
                                    {/* Add full state names later if needed */}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>

            {/* Fees & Costs Tab */}
            <TabsContent value="fees" className="space-y-6">
                 <Card className="border-dashed border-green-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <Percent className="h-5 w-5" /> Loan Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Loan Origination Fee */}
                        <div className="space-y-2 max-w-xs">
                            <Label htmlFor="loanOriginationFeePercent" className="flex items-center">
                                Loan Origination Fee
                                <TooltipProvider>
                                <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Fee charged by the lender for processing the loan, expressed as a percentage of the loan amount.</p>
                                    </TooltipContent>
                                </UITooltip>
                                </TooltipProvider>
                            </Label>
                            <div className="flex items-center">
                                <Input
                                id="loanOriginationFeePercent"
                                type="number"
                                value={loanOriginationFeePercent}
                                onChange={(e) => setLoanOriginationFeePercent(Number(e.target.value))}
                                className="rounded-r-none"
                                min="0"
                                step={0.1}
                                />
                                <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">%</span>
                            </div>
                             <Slider
                                value={[loanOriginationFeePercent]}
                                onValueChange={(value) => setLoanOriginationFeePercent(value[0])}
                                max={5} // Realistic max for origination fee %
                                step={0.1}
                                className="mt-2"
                            />
                        </div>
                    </CardContent>
                 </Card>
                 <Card className="border-dashed border-green-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <FileText className="h-5 w-5" /> Third-Party Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Appraisal Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="appraisalFee">Appraisal Fee</Label>
                            <div className="flex items-center">
                            <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                            <Input
                                id="appraisalFee"
                                type="number"
                                value={appraisalFee}
                                onChange={(e) => setAppraisalFee(Number(e.target.value))}
                                className="rounded-l-none"
                                min="0"
                            />
                            </div>
                        </div>
                        {/* Home Inspection Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="homeInspectionFee">Home Inspection Fee</Label>
                            <div className="flex items-center">
                            <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                            <Input
                                id="homeInspectionFee"
                                type="number"
                                value={homeInspectionFee}
                                onChange={(e) => setHomeInspectionFee(Number(e.target.value))}
                                className="rounded-l-none"
                                min="0"
                            />
                            </div>
                        </div>
                        {/* Title Insurance */}
                        <div className="space-y-2">
                            <Label htmlFor="titleInsurance">Title Insurance</Label>
                            <div className="flex items-center">
                            <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                            <Input
                                id="titleInsurance"
                                type="number"
                                value={titleInsurance}
                                onChange={(e) => setTitleInsurance(Number(e.target.value))}
                                className="rounded-l-none"
                                min="0"
                            />
                            </div>
                        </div>
                        {/* Escrow Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="escrowFee">Escrow Fee</Label>
                            <div className="flex items-center">
                            <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                            <Input
                                id="escrowFee"
                                type="number"
                                value={escrowFee}
                                onChange={(e) => setEscrowFee(Number(e.target.value))}
                                className="rounded-l-none"
                                min="0"
                            />
                            </div>
                        </div>
                    </CardContent>
                 </Card>
                 <Card className="border-dashed border-green-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <Scale className="h-5 w-5" /> Additional Costs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {additionalCosts.map((cost, index) => (
                            <div key={cost.id} className="flex items-center space-x-2 p-2 border rounded bg-gray-50/50">
                                <Input
                                    type="text"
                                    placeholder={`Cost #${index + 1} Name`}
                                    value={cost.name}
                                    onChange={(e) => updateAdditionalCost(cost.id, 'name', e.target.value)}
                                    className="flex-grow"
                                />
                                <div className="flex items-center">
                                    <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-r-0 rounded-l-md">$</span>
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={cost.amount}
                                        onChange={(e) => updateAdditionalCost(cost.id, 'amount', Number(e.target.value))}
                                        className="w-32 rounded-l-none"
                                        min="0"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAdditionalCost(cost.id)}
                                    className="text-red-500 hover:bg-red-100"
                                >
                                    <XCircle size={18} />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addAdditionalCost} className="mt-2">
                            <PlusCircle size={16} className="mr-2" /> Add Custom Cost
                        </Button>
                    </CardContent>
                 </Card>
            </TabsContent>

             {/* Reserves Tab */}
            <TabsContent value="reserves" className="space-y-6">
                 <Card className="border-dashed border-purple-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                        <CalendarDays className="h-5 w-5" /> Escrow Reserves
                        </CardTitle>
                         <CardDescription>
                            Lenders often require you to prepay several months of property taxes and homeowner's insurance into an escrow account at closing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Monthly Reserves */}
                        <div className="space-y-2 max-w-xs">
                            <Label htmlFor="monthlyReserves" className="flex items-center">
                                Months of Reserves
                                <TooltipProvider>
                                <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>The number of months of estimated property taxes and insurance the lender requires upfront.</p>
                                    </TooltipContent>
                                </UITooltip>
                                </TooltipProvider>
                            </Label>
                            <div className="flex items-center">
                                <Input
                                id="monthlyReserves"
                                type="number"
                                value={monthlyReserves}
                                onChange={(e) => setMonthlyReserves(Number(e.target.value))}
                                className="rounded-r-none"
                                min="0"
                                max="12"
                                />
                                <span className="text-sm text-muted-foreground p-2 bg-gray-100 border border-l-0 rounded-r-md">months</span>
                            </div>
                            <Slider
                                value={[monthlyReserves]}
                                onValueChange={(value) => setMonthlyReserves(value[0])}
                                max={12}
                                step={1}
                                className="mt-2"
                            />
                        </div>
                         {results && (
                            <p className="text-sm text-muted-foreground mt-4">
                                Based on estimated monthly property tax ({formatCurrency(results.monthlyEscrowItems - (results.monthlyEscrowItems > 0 ? (homePrice * 0.0035 / 12) : 0))}) and insurance ({formatCurrency(results.monthlyEscrowItems > 0 ? (homePrice * 0.0035 / 12) : 0)}).
                            </p>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>

        {/* --- Results Section --- */}
        {results && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-finance-primary border-b pb-2 mb-6">
              Estimated Cost to Close Summary
            </h2>

            {/* Total Cost Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow">
                <CardHeader className="text-center">
                    <CardDescription className="text-blue-800 font-medium">Total Estimated Cash Needed at Closing</CardDescription>
                    <CardTitle className="text-4xl font-bold text-blue-700">{formatCurrency(results.totalCostToClose)}</CardTitle>
                </CardHeader>
            </Card>

            {/* Breakdown Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5" /> Cost Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Use definition list for better semantics */}
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-dashed">
                            <dt className="font-medium text-gray-600">Down Payment</dt>
                            <dd className="font-semibold">{formatCurrency(results.downPayment)}</dd>
                        </div>

                        <div className="flex justify-between py-1">
                            <dt className="text-gray-600 flex items-center">
                                Loan Fees
                                <TooltipProvider>
                                    <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Fees charged directly by the lender.</p></TooltipContent>
                                    </UITooltip>
                                </TooltipProvider>
                            </dt>
                            <dd>{formatCurrency(results.totalLoanFees)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Origination Fee ({formatPercentage(loanOriginationFeePercent)})</dt>
                            <dd>{formatCurrency(results.originationFeeAmount)}</dd>
                        </div>

                        <div className="flex justify-between py-1">
                            <dt className="text-gray-600 flex items-center">
                                Third-Party Fees
                                 <TooltipProvider>
                                    <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Fees paid to other companies involved (appraiser, title company, etc.).</p></TooltipContent>
                                    </UITooltip>
                                </TooltipProvider>
                            </dt>
                            <dd>{formatCurrency(results.totalThirdPartyFees)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Appraisal Fee</dt>
                            <dd>{formatCurrency(results.appraisalFee)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Home Inspection Fee</dt>
                            <dd>{formatCurrency(results.homeInspectionFee)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Title Insurance</dt>
                            <dd>{formatCurrency(results.titleInsurance)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Escrow Fee</dt>
                            <dd>{formatCurrency(results.escrowFee)}</dd>
                        </div>

                         <div className="flex justify-between py-1">
                            <dt className="text-gray-600 flex items-center">
                                Taxes & Government Fees
                                 <TooltipProvider>
                                    <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Taxes and fees required by state/local government.</p></TooltipContent>
                                    </UITooltip>
                                </TooltipProvider>
                            </dt>
                            <dd>{formatCurrency(results.totalTaxesGovtFees)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>Transfer Tax ({formatPercentage(STATE_RATES[state as keyof typeof STATE_RATES]?.transferTax || 0)})</dt>
                            <dd>{formatCurrency(results.transferTaxAmount)}</dd>
                        </div>
                        {/* Add Recording Fees if needed */}

                        {additionalCosts.length > 0 && (
                            <>
                                <div className="flex justify-between py-1">
                                    <dt className="text-gray-600">Additional Costs</dt>
                                    <dd>{formatCurrency(results.additionalCostsTotal)}</dd>
                                </div>
                                {additionalCosts.map(cost => (
                                    <div key={cost.id} className="flex justify-between pl-4 text-xs text-gray-500">
                                        <dt>{cost.name || `Custom Cost`}</dt>
                                        <dd>{formatCurrency(cost.amount)}</dd>
                                    </div>
                                ))}
                            </>
                        )}

                         <div className="flex justify-between py-1 border-b border-dashed">
                            <dt className="font-medium text-gray-600">Total Closing Costs</dt>
                            <dd className="font-semibold">{formatCurrency(results.totalClosingCosts)}</dd>
                        </div>

                        <div className="flex justify-between py-1">
                            <dt className="text-gray-600 flex items-center">
                                Prepaids & Escrow Reserves
                                 <TooltipProvider>
                                    <UITooltip delayDuration={100}>
                                    <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Funds collected at closing for future expenses like taxes and insurance.</p></TooltipContent>
                                    </UITooltip>
                                </TooltipProvider>
                            </dt>
                            <dd>{formatCurrency(results.totalPrepaidsReserves)}</dd>
                        </div>
                         <div className="flex justify-between pl-4 text-xs text-gray-500">
                            <dt>{monthlyReserves} Months Reserves (@ {formatCurrency(results.monthlyEscrowItems)}/mo)</dt>
                            <dd>{formatCurrency(results.reservesAmount)}</dd>
                        </div>
                        {/* Add Prepaid Interest, Insurance Premium if needed */}

                        <div className="flex justify-between py-2 border-t mt-2">
                            <dt className="font-bold text-lg text-blue-700">Total Estimated Cash to Close</dt>
                            <dd className="font-bold text-lg text-blue-700">{formatCurrency(results.totalCostToClose)}</dd>
                        </div>
                    </dl>
                     <p className="text-xs text-muted-foreground mt-4">
                        *This is an estimate. Actual closing costs may vary based on your lender, location, and specific transaction details. Property tax and insurance estimates are approximate.
                    </p>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t">
        <Button variant="outline" size="sm" onClick={handleSaveData}>
          <Save size={16} className="mr-2" /> Save Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CostToCloseCalculator;
