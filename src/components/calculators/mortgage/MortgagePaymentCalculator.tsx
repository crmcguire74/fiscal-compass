import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar
} from 'recharts';
import { Home, Download, Save, Info } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'mortgage-payment';

const MORTGAGE_DEFAULTS = {
  homePrice: 350000,
  downPayment: 70000,
  downPaymentPercent: 20,
  loanAmount: 280000,
  interestRate: 6.5,
  loanTerm: 30,
  loanType: 'fixed',
  armType: '5/1',
  armInitialRate: 5.5,
  armAdjustmentRate: 2.0,
  armRateCap: 8.5,
  propertyTaxRate: 1.2,
  homeInsurance: 1200,
  pmi: 0.5,
  includePmi: true,
  includePropertyTax: true,
  includeHomeInsurance: true
};

const MortgagePaymentCalculator = () => {
  const { toast } = useToast();
  const [homePrice, setHomePrice] = useState(MORTGAGE_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(MORTGAGE_DEFAULTS.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(MORTGAGE_DEFAULTS.downPaymentPercent);
  const [loanAmount, setLoanAmount] = useState(MORTGAGE_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(MORTGAGE_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(MORTGAGE_DEFAULTS.loanTerm);
  const [loanType, setLoanType] = useState<'fixed' | 'arm'>(MORTGAGE_DEFAULTS.loanType as 'fixed' | 'arm');
  const [armType, setArmType] = useState(MORTGAGE_DEFAULTS.armType);
  const [armInitialRate, setArmInitialRate] = useState(MORTGAGE_DEFAULTS.armInitialRate);
  const [armAdjustmentRate, setArmAdjustmentRate] = useState(MORTGAGE_DEFAULTS.armAdjustmentRate);
  const [armRateCap, setArmRateCap] = useState(MORTGAGE_DEFAULTS.armRateCap);
  const [propertyTaxRate, setPropertyTaxRate] = useState(MORTGAGE_DEFAULTS.propertyTaxRate);
  const [homeInsurance, setHomeInsurance] = useState(MORTGAGE_DEFAULTS.homeInsurance);
  const [pmi, setPmi] = useState(MORTGAGE_DEFAULTS.pmi);
  const [includePmi, setIncludePmi] = useState(MORTGAGE_DEFAULTS.includePmi);
  const [includePropertyTax, setIncludePropertyTax] = useState(MORTGAGE_DEFAULTS.includePropertyTax);
  const [includeHomeInsurance, setIncludeHomeInsurance] = useState(MORTGAGE_DEFAULTS.includeHomeInsurance);
  
  const [activeTab, setActiveTab] = useState('payment');
  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);

  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setHomePrice(savedData.homePrice || MORTGAGE_DEFAULTS.homePrice);
      setDownPayment(savedData.downPayment || MORTGAGE_DEFAULTS.downPayment);
      setDownPaymentPercent(savedData.downPaymentPercent || MORTGAGE_DEFAULTS.downPaymentPercent);
      setInterestRate(savedData.interestRate || MORTGAGE_DEFAULTS.interestRate);
      setLoanTerm(savedData.loanTerm || MORTGAGE_DEFAULTS.loanTerm);
      setLoanType(savedData.loanType || MORTGAGE_DEFAULTS.loanType);
      setArmType(savedData.armType || MORTGAGE_DEFAULTS.armType);
      setArmInitialRate(savedData.armInitialRate || MORTGAGE_DEFAULTS.armInitialRate);
      setArmAdjustmentRate(savedData.armAdjustmentRate || MORTGAGE_DEFAULTS.armAdjustmentRate);
      setArmRateCap(savedData.armRateCap || MORTGAGE_DEFAULTS.armRateCap);
      setPropertyTaxRate(savedData.propertyTaxRate || MORTGAGE_DEFAULTS.propertyTaxRate);
      setHomeInsurance(savedData.homeInsurance || MORTGAGE_DEFAULTS.homeInsurance);
      setPmi(savedData.pmi || MORTGAGE_DEFAULTS.pmi);
      setIncludePmi(savedData.includePmi ?? MORTGAGE_DEFAULTS.includePmi);
      setIncludePropertyTax(savedData.includePropertyTax ?? MORTGAGE_DEFAULTS.includePropertyTax);
      setIncludeHomeInsurance(savedData.includeHomeInsurance ?? MORTGAGE_DEFAULTS.includeHomeInsurance);
      setDataStored(true);
    }
  }, []);

  useEffect(() => {
    const newDownPaymentPercent = (downPayment / homePrice) * 100;
    setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    
    const newLoanAmount = homePrice - downPayment;
    setLoanAmount(newLoanAmount);
    
    if (newDownPaymentPercent >= 20 && includePmi) {
      setIncludePmi(false);
    } else if (newDownPaymentPercent < 20 && !includePmi) {
      setIncludePmi(true);
    }
  }, [homePrice, downPayment]);

  const handleDownPaymentPercentChange = (newPercentage: number) => {
    setDownPaymentPercent(newPercentage);
    const newDownPayment = (homePrice * newPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  useEffect(() => {
    calculateMortgage();
  }, [
    loanAmount, interestRate, loanTerm, 
    propertyTaxRate, homeInsurance, pmi, 
    includePmi, includePropertyTax, includeHomeInsurance, 
    loanType, armInitialRate, armAdjustmentRate, armRateCap, armType
  ]);

  const calculateMortgage = () => {
    const monthlyRate = loanType === 'fixed' 
      ? interestRate / 100 / 12
      : armInitialRate / 100 / 12;
    
    const numberOfPayments = loanTerm * 12;
    
    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      principalAndInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }
    
    const monthlyPropertyTax = includePropertyTax ? (homePrice * (propertyTaxRate / 100)) / 12 : 0;
    
    const monthlyHomeInsurance = includeHomeInsurance ? homeInsurance / 12 : 0;
    
    const monthlyPmi = includePmi && downPaymentPercent < 20 ? (loanAmount * (pmi / 100)) / 12 : 0;
    
    const totalMonthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPmi;
    
    const loanToValueRatio = (loanAmount / homePrice) * 100;
    
    const amortizationSchedule = generateAmortizationSchedule(
      loanAmount, 
      monthlyRate, 
      numberOfPayments, 
      principalAndInterest, 
      loanType === 'arm' ? {
        initialRate: armInitialRate / 100 / 12,
        adjustmentRate: armAdjustmentRate / 100 / 12,
        adjustmentPeriod: parseInt(armType.split('/')[0], 10) * 12,
        adjustmentFrequency: parseInt(armType.split('/')[1], 10) * 12,
        rateCap: armRateCap / 100 / 12
      } : undefined
    );
    
    setResults({
      principalAndInterest,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyPmi,
      totalMonthlyPayment,
      loanToValueRatio,
      totalInterestPaid: amortizationSchedule[amortizationSchedule.length - 1].totalInterestPaid,
      totalCostOfLoan: loanAmount + amortizationSchedule[amortizationSchedule.length - 1].totalInterestPaid
    });
    
    setAmortizationData(amortizationSchedule);
  };

  const generateAmortizationSchedule = (
    principal: number,
    initialMonthlyRate: number,
    totalPayments: number,
    initialMonthlyPayment: number,
    armOptions?: {
      initialRate: number;
      adjustmentRate: number;
      adjustmentPeriod: number;
      adjustmentFrequency: number;
      rateCap: number;
    }
  ) => {
    let balance = principal;
    let schedule = [];
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let currentRate = initialMonthlyRate;
    let currentPayment = initialMonthlyPayment;

    for (let paymentNumber = 1; paymentNumber <= totalPayments; paymentNumber++) {
      if (armOptions && paymentNumber > armOptions.adjustmentPeriod && 
          (paymentNumber - armOptions.adjustmentPeriod) % armOptions.adjustmentFrequency === 0) {
        
        currentRate = Math.min(currentRate + armOptions.adjustmentRate, armOptions.rateCap);
        
        const remainingPayments = totalPayments - paymentNumber + 1;
        if (currentRate > 0 && balance > 0) {
          currentPayment = balance * (currentRate * Math.pow(1 + currentRate, remainingPayments)) / 
                          (Math.pow(1 + currentRate, remainingPayments) - 1);
        } else {
          currentPayment = balance / remainingPayments;
        }
      }
      
      const interestPayment = balance * currentRate;
      
      const principalPayment = currentPayment - interestPayment;
      
      totalPrincipalPaid += principalPayment;
      totalInterestPaid += interestPayment;
      balance -= principalPayment;

      const isArmAdjustmentPoint = armOptions && 
          (paymentNumber === armOptions.adjustmentPeriod || 
           (paymentNumber > armOptions.adjustmentPeriod && 
            (paymentNumber - armOptions.adjustmentPeriod) % armOptions.adjustmentFrequency === 0));
            
      if (paymentNumber % 12 === 0 || paymentNumber === 1 || paymentNumber === totalPayments || isArmAdjustmentPoint) {
        schedule.push({
          paymentNumber,
          year: Math.ceil(paymentNumber / 12),
          currentRate: currentRate * 12 * 100,
          principalPayment,
          interestPayment,
          monthlyPayment: currentPayment,
          totalPrincipalPaid,
          totalInterestPaid,
          remainingBalance: balance > 0 ? balance : 0
        });
      }
    }

    return schedule;
  };

  const handleSaveData = () => {
    const dataToSave = {
      homePrice,
      downPayment,
      downPaymentPercent,
      interestRate,
      loanTerm,
      loanType,
      armType,
      armInitialRate,
      armAdjustmentRate, 
      armRateCap,
      propertyTaxRate,
      homeInsurance,
      pmi,
      includePmi,
      includePropertyTax,
      includeHomeInsurance,
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your mortgage calculator data has been saved locally.",
    });
  };

  const handleDownloadCSV = () => {
    if (!amortizationData.length) return;
    
    let csvHeader = "Payment Number,Year,";
    if (loanType === 'arm') {
      csvHeader += "Interest Rate,";
    }
    csvHeader += "Principal Payment,Interest Payment,Monthly Payment,Total Principal Paid,Total Interest Paid,Remaining Balance\n";
    
    let csvContent = csvHeader;
    amortizationData.forEach((paymentData) => {
      let row = `${paymentData.paymentNumber},${paymentData.year},`;
      if (loanType === 'arm') {
        row += `${paymentData.currentRate.toFixed(3)}%,`;
      }
      row += `${paymentData.principalPayment.toFixed(2)},${paymentData.interestPayment.toFixed(2)},${paymentData.monthlyPayment.toFixed(2)},${paymentData.totalPrincipalPaid.toFixed(2)},${paymentData.totalInterestPaid.toFixed(2)},${paymentData.remainingBalance.toFixed(2)}\n`;
      csvContent += row;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mortgage-amortization-schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPieChartData = () => {
    if (!results) return [];
    
    const data = [
      {
        name: 'Principal & Interest',
        value: results.principalAndInterest,
        color: '#1e40af'
      }
    ];
    
    if (results.monthlyPropertyTax > 0) {
      data.push({
        name: 'Property Tax',
        value: results.monthlyPropertyTax,
        color: '#3b82f6'
      });
    }
    
    if (results.monthlyHomeInsurance > 0) {
      data.push({
        name: 'Home Insurance',
        value: results.monthlyHomeInsurance,
        color: '#60a5fa'
      });
    }
    
    if (results.monthlyPmi > 0) {
      data.push({
        name: 'PMI',
        value: results.monthlyPmi,
        color: '#93c5fd'
      });
    }
    
    return data;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">Year {label}</p>
          <p className="text-sm text-blue-700">
            Remaining Balance: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getArmDescription = () => {
    const initialPeriod = parseInt(armType.split('/')[0], 10);
    const adjustmentFrequency = parseInt(armType.split('/')[1], 10);
    
    return `${initialPeriod} years fixed at ${armInitialRate}%, then adjusts every ${adjustmentFrequency} year(s) by up to ${armAdjustmentRate}% (capped at ${armRateCap}%)`;
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Home className="h-6 w-6" />
              Mortgage Payment Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculate your monthly mortgage payment including principal, interest, taxes, and insurance
            </CardDescription>
          </div>
          {dataStored && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Data Saved Locally
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="homePrice" className="calculator-label">Home Price</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The total purchase price of the home.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="downPayment" className="calculator-label">Down Payment</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you'll pay upfront. Usually 3-20% of the home price.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                    max={homePrice}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="downPaymentPercent" className="calculator-label">Down Payment Percentage</Label>
                <span className="text-sm font-medium">{downPaymentPercent}%</span>
              </div>
              <Slider
                id="downPaymentPercent"
                value={[downPaymentPercent]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={(value) => handleDownPaymentPercentChange(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>20%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanType" className="calculator-label">Loan Type</Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Fixed-rate mortgages maintain the same interest rate for the entire loan term. Adjustable-rate mortgages (ARMs) have an initial fixed period, then adjust periodically.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Select
                value={loanType}
                onValueChange={(value: 'fixed' | 'arm') => setLoanType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Rate</SelectItem>
                  <SelectItem value="arm">Adjustable Rate (ARM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {loanType === 'fixed' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="interestRate" className="calculator-label">Interest Rate (%)</Label>
                  <span className="text-sm font-medium">{interestRate}%</span>
                </div>
                <Slider
                  id="interestRate"
                  value={[interestRate]}
                  min={0}
                  max={15}
                  step={0.125}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label htmlFor="armType" className="calculator-label">ARM Type</Label>
                  <Select
                    value={armType}
                    onValueChange={setArmType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ARM type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3/1">3/1 ARM</SelectItem>
                      <SelectItem value="5/1">5/1 ARM</SelectItem>
                      <SelectItem value="7/1">7/1 ARM</SelectItem>
                      <SelectItem value="10/1">10/1 ARM</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {armType.split('/')[0]} years fixed, then adjusts every {armType.split('/')[1]} year(s)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="armInitialRate" className="calculator-label">Initial Rate (%)</Label>
                    <Input
                      id="armInitialRate"
                      type="number"
                      value={armInitialRate}
                      onChange={(e) => setArmInitialRate(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={15}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="armAdjustmentRate" className="calculator-label">Adjustment (%)</Label>
                    <Input
                      id="armAdjustmentRate"
                      type="number"
                      value={armAdjustmentRate}
                      onChange={(e) => setArmAdjustmentRate(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="armRateCap" className="calculator-label">Rate Cap (%)</Label>
                    <Input
                      id="armRateCap"
                      type="number"
                      value={armRateCap}
                      onChange={(e) => setArmRateCap(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanTerm" className="calculator-label">Loan Term (Years)</Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">The length of time you have to repay the loan. Common terms are 15 or 30 years.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Select
                value={loanTerm.toString()}
                onValueChange={(value) => setLoanTerm(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 years</SelectItem>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="30">30 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Additional Costs</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeTaxes" 
                    checked={includePropertyTax}
                    onCheckedChange={setIncludePropertyTax}
                  />
                  <Label htmlFor="includeTaxes">Include Property Taxes</Label>
                </div>
                {includePropertyTax && (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="propertyTaxRate"
                      type="number"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                      className="w-16 h-8 text-sm"
                      step={0.1}
                      min={0}
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeInsurance" 
                    checked={includeHomeInsurance}
                    onCheckedChange={setIncludeHomeInsurance}
                  />
                  <Label htmlFor="includeInsurance">Include Home Insurance</Label>
                </div>
                {includeHomeInsurance && (
                  <div className="flex items-center">
                    <span className="mr-1 text-sm">$</span>
                    <Input
                      id="homeInsurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                      min={0}
                    />
                    <span className="ml-1 text-sm">/year</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includePmi" 
                    checked={includePmi && downPaymentPercent < 20}
                    onCheckedChange={setIncludePmi}
                    disabled={downPaymentPercent >= 20}
                  />
                  <Label htmlFor="includePmi" className={downPaymentPercent >= 20 ? "text-muted-foreground" : ""}>
                    Include PMI
                    {downPaymentPercent >= 20 && <span className="text-xs ml-1">(Not needed with 20%+ down)</span>}
                  </Label>
                </div>
                {includePmi && downPaymentPercent < 20 && (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="pmi"
                      type="number"
                      value={pmi}
                      onChange={(e) => setPmi(Number(e.target.value))}
                      className="w-16 h-8 text-sm"
                      step={0.05}
                      min={0}
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2 pb-4">
              <Button 
                className="w-full text-white font-medium" 
                onClick={handleSaveData}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Data Locally
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Data is saved in your browser only. No information is sent to our servers.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {results && (
              <>
                <div className="calculator-panel">
                  <h3 className="text-lg font-medium mb-3">Monthly Payment Summary</h3>
                  {loanType === 'arm' && (
                    <div className="p-2 mb-3 bg-amber-50 border border-amber-200 rounded text-sm">
                      <span className="font-medium">ARM Terms:</span> {getArmDescription()}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-center p-4 bg-finance-primary/5 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Total Monthly Payment</p>
                      <p className="text-3xl font-bold text-finance-primary mt-1">{formatCurrency(results.totalMonthlyPayment)}</p>
                      {loanType === 'arm' && (
                        <p className="text-xs text-amber-600 mt-1">Initial payment amount; will adjust over time</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <div className="p-2 bg-gray-50 rounded border">
                        <p className="text-xs text-muted-foreground">Principal & Interest</p>
                        <p className="text-lg font-semibold">{formatCurrency(results.principalAndInterest)}</p>
                      </div>
                      
                      {results.monthlyPropertyTax > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Property Tax</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.monthlyPropertyTax)}</p>
                        </div>
                      )}
                      
                      {results.monthlyHomeInsurance > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Home Insurance</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.monthlyHomeInsurance)}</p>
                        </div>
                      )}
                      
                      {results.monthlyPmi > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">PMI</p>
                          <p className="text-lg font-semibold">{formatCurrency(results.monthlyPmi)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={getPieChartData()} dataKey="value" nameKey="name" fill="#1e40af">
                        {getPieChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={amortizationData}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="monthlyPayment" stroke="#1e40af" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgagePaymentCalculator;
