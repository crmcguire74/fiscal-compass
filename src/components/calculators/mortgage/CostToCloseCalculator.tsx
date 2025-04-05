import { useState, useEffect } from 'react';
import { Home, Download, Save, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'cost-to-close';

// State-specific property tax rates and transfer taxes
const STATE_RATES = {
  AL: { propertyTax: 0.42, transferTax: 0.1 },
  AK: { propertyTax: 1.19, transferTax: 0 },
  AZ: { propertyTax: 0.66, transferTax: 0.1 },
  AR: { propertyTax: 0.63, transferTax: 0.33 },
  CA: { propertyTax: 0.76, transferTax: 0.11 },
  CO: { propertyTax: 0.51, transferTax: 0.01 },
  CT: { propertyTax: 2.14, transferTax: 1.25 },
  DE: { propertyTax: 0.57, transferTax: 2 },
  FL: { propertyTax: 0.89, transferTax: 0.7 },
  GA: { propertyTax: 0.92, transferTax: 0.1 },
  HI: { propertyTax: 0.28, transferTax: 0.1 },
  ID: { propertyTax: 0.69, transferTax: 0 },
  IL: { propertyTax: 2.27, transferTax: 0.1 },
  IN: { propertyTax: 0.85, transferTax: 0 },
  IA: { propertyTax: 1.53, transferTax: 0.16 },
  KS: { propertyTax: 1.4, transferTax: 0 },
  KY: { propertyTax: 0.86, transferTax: 0.1 },
  LA: { propertyTax: 0.55, transferTax: 0 },
  ME: { propertyTax: 1.36, transferTax: 0.44 },
  MD: { propertyTax: 1.09, transferTax: 0.5 },
  MA: { propertyTax: 1.22, transferTax: 0.456 },
  MI: { propertyTax: 1.54, transferTax: 0.75 },
  MN: { propertyTax: 1.12, transferTax: 0.33 },
  MS: { propertyTax: 0.81, transferTax: 0 },
  MO: { propertyTax: 0.97, transferTax: 0 },
  MT: { propertyTax: 0.84, transferTax: 0 },
  NE: { propertyTax: 1.73, transferTax: 0.225 },
  NV: { propertyTax: 0.69, transferTax: 0.51 },
  NH: { propertyTax: 2.18, transferTax: 0.75 },
  NJ: { propertyTax: 2.49, transferTax: 1 },
  NM: { propertyTax: 0.80, transferTax: 0 },
  NY: { propertyTax: 1.72, transferTax: 0.4 },
  NC: { propertyTax: 0.84, transferTax: 0.2 },
  ND: { propertyTax: 0.98, transferTax: 0 },
  OH: { propertyTax: 1.57, transferTax: 0.1 },
  OK: { propertyTax: 0.90, transferTax: 0 },
  OR: { propertyTax: 1.04, transferTax: 0.1 },
  PA: { propertyTax: 1.58, transferTax: 1 },
  RI: { propertyTax: 1.63, transferTax: 0.46 },
  SC: { propertyTax: 0.57, transferTax: 0.37 },
  SD: { propertyTax: 1.28, transferTax: 0 },
  TN: { propertyTax: 0.71, transferTax: 0.37 },
  TX: { propertyTax: 1.80, transferTax: 0 },
  UT: { propertyTax: 0.63, transferTax: 0 },
  VT: { propertyTax: 1.90, transferTax: 1.25 },
  VA: { propertyTax: 0.82, transferTax: 0.25 },
  WA: { propertyTax: 0.98, transferTax: 1.28 },
  WV: { propertyTax: 0.58, transferTax: 0.22 },
  WI: { propertyTax: 1.76, transferTax: 0.3 },
  WY: { propertyTax: 0.61, transferTax: 0 }
};

const DEFAULTS = {
  homePrice: 350000,
  downPayment: 70000,
  downPaymentPercent: 20,
  loanAmount: 280000,
  state: 'TX',
  loanOriginationFee: 1,
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
  const [loanOriginationFee, setLoanOriginationFee] = useState(DEFAULTS.loanOriginationFee);
  const [appraisalFee, setAppraisalFee] = useState(DEFAULTS.appraisalFee);
  const [homeInspectionFee, setHomeInspectionFee] = useState(DEFAULTS.homeInspectionFee);
  const [titleInsurance, setTitleInsurance] = useState(DEFAULTS.titleInsurance);
  const [escrowFee, setEscrowFee] = useState(DEFAULTS.escrowFee);
  const [monthlyReserves, setMonthlyReserves] = useState(DEFAULTS.monthlyReserves);
  const [additionalCosts, setAdditionalCosts] = useState<ClosingCost[]>([]);

  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);

  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setHomePrice(savedData.homePrice || DEFAULTS.homePrice);
      setDownPayment(savedData.downPayment || DEFAULTS.downPayment);
      setDownPaymentPercent(savedData.downPaymentPercent || DEFAULTS.downPaymentPercent);
      setState(savedData.state || DEFAULTS.state);
      setLoanOriginationFee(savedData.loanOriginationFee || DEFAULTS.loanOriginationFee);
      setAppraisalFee(savedData.appraisalFee || DEFAULTS.appraisalFee);
      setHomeInspectionFee(savedData.homeInspectionFee || DEFAULTS.homeInspectionFee);
      setTitleInsurance(savedData.titleInsurance || DEFAULTS.titleInsurance);
      setEscrowFee(savedData.escrowFee || DEFAULTS.escrowFee);
      setMonthlyReserves(savedData.monthlyReserves || DEFAULTS.monthlyReserves);
      setAdditionalCosts(savedData.additionalCosts || []);
      setDataStored(true);
    }
  }, []);

  useEffect(() => {
    const newDownPaymentPercent = (downPayment / homePrice) * 100;
    setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    
    const newLoanAmount = homePrice - downPayment;
    setLoanAmount(newLoanAmount);
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
    downPayment,
    state,
    loanOriginationFee,
    appraisalFee,
    homeInspectionFee,
    titleInsurance,
    escrowFee,
    monthlyReserves,
    additionalCosts
  ]);

  const calculateCostToClose = () => {
    // Loan origination fee
    const originationFeeAmount = (loanAmount * loanOriginationFee) / 100;

    // Get state-specific rates
    const stateRates = STATE_RATES[state as keyof typeof STATE_RATES] || { propertyTax: 0, transferTax: 0 };

    // Transfer tax
    const transferTaxAmount = (homePrice * stateRates.transferTax) / 100;

    // Monthly property tax estimate
    const annualPropertyTax = (homePrice * stateRates.propertyTax) / 100;
    const monthlyPropertyTax = annualPropertyTax / 12;

    // Monthly insurance estimate (rough estimate)
    const annualInsurance = (homePrice * 0.0035); // 0.35% of home value
    const monthlyInsurance = annualInsurance / 12;

    // Monthly HOA (placeholder - could be made configurable)
    const monthlyHOA = 0;

    // Calculate total monthly payment for reserves
    const monthlyPayment = monthlyPropertyTax + monthlyInsurance + monthlyHOA;
    const reservesAmount = monthlyPayment * monthlyReserves;

    // Additional costs total
    const additionalCostsTotal = additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);

    // Calculate totals
    const totalClosingCosts = originationFeeAmount + 
                             appraisalFee + 
                             homeInspectionFee + 
                             titleInsurance + 
                             escrowFee + 
                             transferTaxAmount + 
                             additionalCostsTotal;

    const totalCostToClose = downPayment + totalClosingCosts + reservesAmount;

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
      totalClosingCosts,
      totalCostToClose,
      monthlyPayment
    });
  };

  const handleSaveData = () => {
    const dataToSave = {
      homePrice,
      downPayment,
      downPaymentPercent,
      state,
      loanOriginationFee,
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

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Home className="h-6 w-6" />
              Cost to Close Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculate how much money you'll need to close on your home purchase
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
            {/* Home Price Input */}
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
              
              {/* Down Payment Input */}
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

            {/* Down Payment Percentage Slider */}
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
              <div className="grid grid-cols-11 text-xs text-muted-foreground">
                <span className="text-left">0%</span>
                <span className="text-center">10%</span>
                <span className="text-center">20%</span>
                <span className="text-center">30%</span>
                <span className="text-center">40%</span>
                <span className="text-center">50%</span>
                <span className="text-center">60%</span>
                <span className="text-center">70%</span>
                <span className="text-center">80%</span>
                <span className="text-center">90%</span>
                <span className="text-right">100%</span>
              </div>
            </div>

            {/* State Selection */}
            <div className="space-y-2">
              <Label htmlFor="state" className="calculator-label">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="AR">Arkansas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="CT">Connecticut</SelectItem>
                  <SelectItem value="DE">Delaware</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="HI">Hawaii</SelectItem>
                  <SelectItem value="ID">Idaho</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="IN">Indiana</SelectItem>
                  <SelectItem value="IA">Iowa</SelectItem>
                  <SelectItem value="KS">Kansas</SelectItem>
                  <SelectItem value="KY">Kentucky</SelectItem>
                  <SelectItem value="LA">Louisiana</SelectItem>
                  <SelectItem value="ME">Maine</SelectItem>
                  <SelectItem value="MD">Maryland</SelectItem>
                  <SelectItem value="MA">Massachusetts</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                  <SelectItem value="MN">Minnesota</SelectItem>
                  <SelectItem value="MS">Mississippi</SelectItem>
                  <SelectItem value="MO">Missouri</SelectItem>
                  <SelectItem value="MT">Montana</SelectItem>
                  <SelectItem value="NE">Nebraska</SelectItem>
                  <SelectItem value="NV">Nevada</SelectItem>
                  <SelectItem value="NH">New Hampshire</SelectItem>
                  <SelectItem value="NJ">New Jersey</SelectItem>
                  <SelectItem value="NM">New Mexico</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="ND">North Dakota</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="OK">Oklahoma</SelectItem>
                  <SelectItem value="OR">Oregon</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="RI">Rhode Island</SelectItem>
                  <SelectItem value="SC">South Carolina</SelectItem>
                  <SelectItem value="SD">South Dakota</SelectItem>
                  <SelectItem value="TN">Tennessee</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="UT">Utah</SelectItem>
                  <SelectItem value="VT">Vermont</SelectItem>
                  <SelectItem value="VA">Virginia</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                  <SelectItem value="WV">West Virginia</SelectItem>
                  <SelectItem value="WI">Wisconsin</SelectItem>
                  <SelectItem value="WY">Wyoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loan Origination Fee */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanOriginationFee" className="calculator-label">
                  Loan Origination Fee (%)
                </Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Typically ranges from 0.5% to 1% of the loan amount.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Input
                id="loanOriginationFee"
                type="number"
                value={loanOriginationFee}
                onChange={(e) => setLoanOriginationFee(Number(e.target.value))}
                className="calculator-input"
                min={0}
                step={0.1}
              />
            </div>

            {/* Standard Closing Costs */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Standard Closing Costs</h3>
              
              <div className="space-y-2">
                <Label htmlFor="appraisalFee">Appraisal Fee</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="appraisalFee"
                    type="number"
                    value={appraisalFee}
                    onChange={(e) => setAppraisalFee(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeInspectionFee">Home Inspection Fee</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="homeInspectionFee"
                    type="number"
                    value={homeInspectionFee}
                    onChange={(e) => setHomeInspectionFee(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleInsurance">Title Insurance</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="titleInsurance"
                    type="number"
                    value={titleInsurance}
                    onChange={(e) => setTitleInsurance(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escrowFee">Escrow Fee</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="escrowFee"
                    type="number"
                    value={escrowFee}
                    onChange={(e) => setEscrowFee(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Required Reserves */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyReserves" className="calculator-label">
                  Required Reserves (months)
                </Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Lenders typically require 2-6 months of payments in reserves.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Input
                id="monthlyReserves"
                type="number"
                value={monthlyReserves}
                onChange={(e) => setMonthlyReserves(Number(e.target.value))}
                className="calculator-input"
                min={0}
              />
            </div>

            {/* Save Data Button */}
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

          {/* Results Panel */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="calculator-panel">
                  <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
                  
                  <div className="space-y-4">
                    {/* Down Payment */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Down Payment</span>
                      <span className="font-medium">{formatCurrency(results.downPayment)}</span>
                    </div>
                    
                    {/* Closing Costs */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Closing Costs</span>
                        <span className="font-medium">{formatCurrency(results.totalClosingCosts)}</span>
                      </div>
                      <div className="pl-4 space-y-2">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Loan Origination Fee</span>
                          <span>{formatCurrency(results.originationFeeAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Appraisal Fee</span>
                          <span>{formatCurrency(results.appraisalFee)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Home Inspection</span>
                          <span>{formatCurrency(results.homeInspectionFee)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Title Insurance</span>
                          <span>{formatCurrency(results.titleInsurance)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Escrow Fee</span>
                          <span>{formatCurrency(results.escrowFee)}</span>
                        </div>
                        {results.transferTaxAmount > 0 && (
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Transfer Tax</span>
                            <span>{formatCurrency(results.transferTaxAmount)}</span>
                          </div>
                        )}
                        {results.additionalCostsTotal > 0 && (
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Additional Costs</span>
                            <span>{formatCurrency(results.additionalCostsTotal)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Required Reserves */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Required Reserves ({monthlyReserves} months)</span>
                        <span className="font-medium">{formatCurrency(results.reservesAmount)}</span>
                      </div>
                      <div className="pl-4">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Monthly Payment for Reserves</span>
                          <span>{formatCurrency(results.monthlyPayment)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold">Total Cost to Close</span>
                        <span className="text-lg font-bold text-finance-primary">
                          {formatCurrency(results.totalCostToClose)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostToCloseCalculator;
