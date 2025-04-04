import React, { useState, useEffect } from 'react';
import { Car, Calculator, Download, Save, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';
// TODO: Add amortization chart imports if needed (LineChart, etc.)

const CALCULATOR_ID = 'auto-loan-calculator';

const DEFAULTS = {
  vehiclePrice: 30000,
  downPayment: 5000,
  tradeInValue: 2000,
  salesTaxRate: 6,
  loanTerm: 60, // months
  interestRate: 7.5,
};

const AutoLoanCalculator = () => {
  const { toast } = useToast();
  const [vehiclePrice, setVehiclePrice] = useState(DEFAULTS.vehiclePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [tradeInValue, setTradeInValue] = useState(DEFAULTS.tradeInValue);
  const [salesTaxRate, setSalesTaxRate] = useState(DEFAULTS.salesTaxRate);
  const [loanTerm, setLoanTerm] = useState(DEFAULTS.loanTerm);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  
  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);
  // TODO: Add state for amortization data if implementing chart

  // Load saved data
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setVehiclePrice(savedData.vehiclePrice ?? DEFAULTS.vehiclePrice);
      setDownPayment(savedData.downPayment ?? DEFAULTS.downPayment);
      setTradeInValue(savedData.tradeInValue ?? DEFAULTS.tradeInValue);
      setSalesTaxRate(savedData.salesTaxRate ?? DEFAULTS.salesTaxRate);
      setLoanTerm(savedData.loanTerm ?? DEFAULTS.loanTerm);
      setInterestRate(savedData.interestRate ?? DEFAULTS.interestRate);
      setDataStored(true);
    }
  }, []);

  // Calculate loan details
  useEffect(() => {
    calculateLoan();
  }, [vehiclePrice, downPayment, tradeInValue, salesTaxRate, loanTerm, interestRate]);

  const calculateLoan = () => {
    const taxableAmount = Math.max(0, vehiclePrice - tradeInValue);
    const salesTaxAmount = taxableAmount * (salesTaxRate / 100);
    const totalLoanAmount = Math.max(0, vehiclePrice + salesTaxAmount - downPayment - tradeInValue);
    
    const monthlyInterestRate = interestRate / 100 / 12;
    let monthlyPayment = 0;

    if (totalLoanAmount <= 0) {
       monthlyPayment = 0;
    } else if (monthlyInterestRate > 0) {
      monthlyPayment = totalLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / 
                       (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    } else if (loanTerm > 0) {
      monthlyPayment = totalLoanAmount / loanTerm;
    }

    const totalPaid = monthlyPayment * loanTerm;
    const totalInterest = Math.max(0, totalPaid - totalLoanAmount);

    setResults({
      totalLoanAmount,
      salesTaxAmount,
      monthlyPayment,
      totalInterest,
      totalPaid,
    });
    
    // TODO: Generate amortization schedule if needed
  };

  // Save data
  const handleSaveData = () => {
     const dataToSave = {
       vehiclePrice,
       downPayment,
       tradeInValue,
       salesTaxRate,
       loanTerm,
       interestRate,
       timestamp: Date.now()
     };
     saveCalculatorData(CALCULATOR_ID, dataToSave);
     setDataStored(true);
     toast({
       title: "Data Saved",
       description: "Your auto loan inputs have been saved locally.",
     });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
         <div className="flex justify-between items-center">
           <div>
             <CardTitle className="text-2xl flex items-center gap-2">
               <Car className="h-6 w-6" />
               Auto Loan Calculator
             </CardTitle>
             <CardDescription className="text-blue-100 mt-2">
               Estimate your monthly car payment and total loan cost.
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
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vehiclePrice">Vehicle Price</Label>
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">$</span>
                <Input id="vehiclePrice" type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(Number(e.target.value))} min={0} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="downPayment">Down Payment</Label>
                 <div className="flex items-center">
                   <span className="mr-2 text-sm font-medium">$</span>
                   <Input id="downPayment" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} min={0} />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="tradeInValue">Trade-in Value</Label>
                 <div className="flex items-center">
                   <span className="mr-2 text-sm font-medium">$</span>
                   <Input id="tradeInValue" type="number" value={tradeInValue} onChange={(e) => setTradeInValue(Number(e.target.value))} min={0} />
                 </div>
               </div>
            </div>

             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label htmlFor="salesTaxRate">Sales Tax Rate (%)</Label>
                 <span className="text-sm font-medium">{salesTaxRate}%</span>
               </div>
               <Slider
                 id="salesTaxRate"
                 value={[salesTaxRate]}
                 min={0}
                 max={15}
                 step={0.1}
                 onValueChange={(value) => setSalesTaxRate(value[0])}
                 className="py-2"
               />
             </div>

             <div className="space-y-2">
               <Label htmlFor="loanTerm">Loan Term (Months)</Label>
               <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                 <SelectTrigger id="loanTerm">
                   <SelectValue placeholder="Select term" />
                 </SelectTrigger>
                 <SelectContent>
                   {[24, 36, 48, 60, 72, 84].map(term => (
                     <SelectItem key={term} value={term.toString()}>{term} months</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label htmlFor="interestRate">Interest Rate (APR %)</Label>
                 <span className="text-sm font-medium">{interestRate}%</span>
               </div>
               <Slider
                 id="interestRate"
                 value={[interestRate]}
                 min={0}
                 max={25}
                 step={0.1}
                 onValueChange={(value) => setInterestRate(value[0])}
                 className="py-2"
               />
             </div>
             
             <Button className="w-full" onClick={handleSaveData}>
               <Save className="w-4 h-4 mr-2" /> Save Inputs
             </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="calculator-panel border rounded-lg p-6 space-y-4">
                 <h3 className="text-lg font-medium mb-4 text-center">Loan Estimate</h3>
                 
                 <div className="text-center">
                   <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                   <p className="text-4xl font-bold text-blue-600">{formatCurrency(results.monthlyPayment)}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Total Loan Amount</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.totalLoanAmount)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Sales Tax Paid</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.salesTaxAmount)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Total Interest Paid</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.totalInterest)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Total Cost (Loan + Interest)</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.totalPaid)}</p>
                    </div>
                 </div>
                 {/* TODO: Add Amortization Chart/Table if desired */}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoLoanCalculator;
