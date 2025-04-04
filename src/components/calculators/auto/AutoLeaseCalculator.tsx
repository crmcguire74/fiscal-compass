import React, { useState, useEffect } from 'react';
import { Car, Calculator, Download, Save, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'auto-lease-calculator';

const DEFAULTS = {
  msrp: 35000,
  negotiatedPrice: 33000,
  leaseTerm: 36, // months
  moneyFactor: 0.00150, // Equivalent to 3.6% APR (MF * 2400)
  residualValuePercent: 55,
  downPayment: 2000,
  tradeInValue: 0,
  salesTaxRate: 6,
  fees: 1000, // Acquisition, disposition, etc.
};

const AutoLeaseCalculator = () => {
  const { toast } = useToast();
  const [msrp, setMsrp] = useState(DEFAULTS.msrp);
  const [negotiatedPrice, setNegotiatedPrice] = useState(DEFAULTS.negotiatedPrice);
  const [leaseTerm, setLeaseTerm] = useState(DEFAULTS.leaseTerm);
  const [moneyFactor, setMoneyFactor] = useState(DEFAULTS.moneyFactor);
  const [residualValuePercent, setResidualValuePercent] = useState(DEFAULTS.residualValuePercent);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [tradeInValue, setTradeInValue] = useState(DEFAULTS.tradeInValue);
  const [salesTaxRate, setSalesTaxRate] = useState(DEFAULTS.salesTaxRate);
  const [fees, setFees] = useState(DEFAULTS.fees);

  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setMsrp(savedData.msrp ?? DEFAULTS.msrp);
      setNegotiatedPrice(savedData.negotiatedPrice ?? DEFAULTS.negotiatedPrice);
      setLeaseTerm(savedData.leaseTerm ?? DEFAULTS.leaseTerm);
      setMoneyFactor(savedData.moneyFactor ?? DEFAULTS.moneyFactor);
      setResidualValuePercent(savedData.residualValuePercent ?? DEFAULTS.residualValuePercent);
      setDownPayment(savedData.downPayment ?? DEFAULTS.downPayment);
      setTradeInValue(savedData.tradeInValue ?? DEFAULTS.tradeInValue);
      setSalesTaxRate(savedData.salesTaxRate ?? DEFAULTS.salesTaxRate);
      setFees(savedData.fees ?? DEFAULTS.fees);
      setDataStored(true);
    }
  }, []);

  // Calculate lease details
  useEffect(() => {
    calculateLease();
  }, [
    msrp, negotiatedPrice, leaseTerm, moneyFactor, residualValuePercent, 
    downPayment, tradeInValue, salesTaxRate, fees
  ]);

  const calculateLease = () => {
    const residualValue = msrp * (residualValuePercent / 100);
    const capCost = negotiatedPrice + fees; // Capitalized Cost
    const capCostReduction = downPayment + tradeInValue;
    const adjustedCapCost = capCost - capCostReduction;
    
    // Depreciation Component
    const depreciation = adjustedCapCost - residualValue;
    const baseMonthlyDepreciation = depreciation / leaseTerm;
    
    // Finance Charge Component (Rent Charge)
    const financeCharge = (adjustedCapCost + residualValue) * moneyFactor;
    
    // Base Monthly Payment (before tax)
    const baseMonthlyPayment = baseMonthlyDepreciation + financeCharge;
    
    // Sales Tax Component (can vary by state - this is a common method)
    const monthlySalesTax = baseMonthlyPayment * (salesTaxRate / 100);
    
    // Total Monthly Payment
    const totalMonthlyPayment = baseMonthlyPayment + monthlySalesTax;
    
    // Total Lease Cost
    const totalLeaseCost = (totalMonthlyPayment * leaseTerm) + capCostReduction; // Includes down payment/trade-in

    setResults({
      monthlyDepreciation: baseMonthlyDepreciation,
      monthlyFinanceCharge: financeCharge,
      monthlySalesTax,
      totalMonthlyPayment,
      residualValue,
      adjustedCapCost,
      totalLeaseCost,
    });
  };

  // Save data
  const handleSaveData = () => {
     const dataToSave = {
       msrp,
       negotiatedPrice,
       leaseTerm,
       moneyFactor,
       residualValuePercent,
       downPayment,
       tradeInValue,
       salesTaxRate,
       fees,
       timestamp: Date.now()
     };
     saveCalculatorData(CALCULATOR_ID, dataToSave);
     setDataStored(true);
     toast({
       title: "Data Saved",
       description: "Your auto lease inputs have been saved locally.",
     });
  };

  const equivalentApr = moneyFactor * 2400;

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
         <div className="flex justify-between items-center">
           <div>
             <CardTitle className="text-2xl flex items-center gap-2">
               <Car className="h-6 w-6" />
               Auto Lease Calculator
             </CardTitle>
             <CardDescription className="text-teal-100 mt-2">
               Estimate your monthly lease payment and understand the costs involved.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="msrp">MSRP (Sticker Price)</Label>
                 <div className="flex items-center">
                   <span className="mr-2 text-sm font-medium">$</span>
                   <Input id="msrp" type="number" value={msrp} onChange={(e) => setMsrp(Number(e.target.value))} min={0} />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="negotiatedPrice">Negotiated Price</Label>
                 <div className="flex items-center">
                   <span className="mr-2 text-sm font-medium">$</span>
                   <Input id="negotiatedPrice" type="number" value={negotiatedPrice} onChange={(e) => setNegotiatedPrice(Number(e.target.value))} min={0} />
                 </div>
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="leaseTerm">Lease Term (Months)</Label>
               <Select value={leaseTerm.toString()} onValueChange={(value) => setLeaseTerm(Number(value))}>
                 <SelectTrigger id="leaseTerm">
                   <SelectValue placeholder="Select term" />
                 </SelectTrigger>
                 <SelectContent>
                   {[24, 36, 39, 48].map(term => (
                     <SelectItem key={term} value={term.toString()}>{term} months</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moneyFactor">Money Factor</Label>
                  <Input id="moneyFactor" type="number" value={moneyFactor} onChange={(e) => setMoneyFactor(Number(e.target.value))} step={0.00001} min={0} />
                  <p className="text-xs text-muted-foreground">Equivalent APR: {equivalentApr.toFixed(2)}%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residualValuePercent">Residual Value (%)</Label>
                  <div className="flex items-center">
                     <Input id="residualValuePercent" type="number" value={residualValuePercent} onChange={(e) => setResidualValuePercent(Number(e.target.value))} min={0} max={100} />
                     <span className="ml-2 text-sm font-medium">%</span>
                  </div>
                   <p className="text-xs text-muted-foreground">Percentage of MSRP</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="downPayment">Down Payment (Cap Cost Reduction)</Label>
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

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesTaxRate">Sales Tax Rate (%)</Label>
                  <Input id="salesTaxRate" type="number" value={salesTaxRate} onChange={(e) => setSalesTaxRate(Number(e.target.value))} min={0} max={20} step={0.1} />
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="fees">Fees (Acquisition, etc.)</Label>
                   <div className="flex items-center">
                     <span className="mr-2 text-sm font-medium">$</span>
                     <Input id="fees" type="number" value={fees} onChange={(e) => setFees(Number(e.target.value))} min={0} />
                   </div>
                 </div>
             </div>
             
             <Button className="w-full" onClick={handleSaveData}>
               <Save className="w-4 h-4 mr-2" /> Save Inputs
             </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="calculator-panel border rounded-lg p-6 space-y-4">
                 <h3 className="text-lg font-medium mb-4 text-center">Lease Estimate</h3>
                 
                 <div className="text-center">
                   <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                   <p className="text-4xl font-bold text-teal-600">{formatCurrency(results.totalMonthlyPayment)}</p>
                   <p className="text-xs text-muted-foreground">(Including tax)</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Monthly Depreciation</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.monthlyDepreciation)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Monthly Finance Charge</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.monthlyFinanceCharge)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Monthly Sales Tax</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.monthlySalesTax)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Total Lease Cost</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.totalLeaseCost)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded col-span-2">
                       <p className="text-xs text-muted-foreground">Residual Value at Lease End</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.residualValue)}</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoLeaseCalculator;
