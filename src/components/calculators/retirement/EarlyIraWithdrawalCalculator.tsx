import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { calculateStateIncomeTax, STATE_TAX_RATES } from '@/utils/taxUtils'; // Import state tax function and rates
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'early-ira-withdrawal-calculator';

// Default values
const DEFAULTS = {
  withdrawalAmount: 10000,
  age: 50,
  accountType: 'traditional' as const,
  federalTaxBracket: '22',
  // stateTaxRate: 5, // Replaced by selectedState
  selectedState: 'California', // Added state selection default
  hasQualifiedReason: false,
  qualifiedReason: 'none',
  payWithdrawalPenaltyFromOtherFunds: false,
  ruleOf55Applies: false,
  isSepp: false
};

// Qualified reasons for early withdrawal exemptions
const QUALIFIED_REASONS = [
  { id: 'none', name: 'None (No Exemption)', description: 'Standard early withdrawal with no exemption' },
  { id: 'first-home', name: 'First-time Home Purchase', description: 'Up to $10,000 lifetime limit' },
  { id: 'education', name: 'Higher Education Expenses', description: 'Qualified education expenses for you, spouse, children, or grandchildren' },
  { id: 'medical', name: 'Unreimbursed Medical Expenses', description: 'Medical expenses exceeding 7.5% of your AGI' },
  { id: 'health-insurance', name: 'Health Insurance Premiums', description: 'While unemployed' },
  { id: 'disability', name: 'Total and Permanent Disability', description: 'Full exemption if permanently disabled' },
  { id: 'military', name: 'Qualified Reservist Distribution', description: 'For military reservists called to active duty' },
  { id: 'birth-adoption', name: 'Birth or Adoption Expenses', description: 'Up to $5,000 per child' }
];

// Federal tax brackets for 2024 (simplified for calculator purposes)
const FEDERAL_TAX_BRACKETS = [
  { value: '10', label: '10% (Up to $11,600)' },
  { value: '12', label: '12% ($11,601 to $47,150)' },
  { value: '22', label: '22% ($47,151 to $100,525)' },
  { value: '24', label: '24% ($100,526 to $191,950)' },
  { value: '32', label: '32% ($191,951 to $243,725)' },
  { value: '35', label: '35% ($243,726 to $609,350)' },
  { value: '37', label: '37% ($609,351+)' }
];

const EarlyIraWithdrawalCalculator = () => {
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState(DEFAULTS.withdrawalAmount);
  const [age, setAge] = useState(DEFAULTS.age);
  const [accountType, setAccountType] = useState<'traditional' | 'roth'>(DEFAULTS.accountType);
  const [federalTaxBracket, setFederalTaxBracket] = useState(DEFAULTS.federalTaxBracket);
  // const [stateTaxRate, setStateTaxRate] = useState(DEFAULTS.stateTaxRate); // Replaced by selectedState
  const [selectedState, setSelectedState] = useState(DEFAULTS.selectedState); // Added state for selected state
  const [hasQualifiedReason, setHasQualifiedReason] = useState(DEFAULTS.hasQualifiedReason);
  const [qualifiedReason, setQualifiedReason] = useState(DEFAULTS.qualifiedReason);
  const [payWithdrawalPenaltyFromOtherFunds, setPayWithdrawalPenaltyFromOtherFunds] = useState(
    DEFAULTS.payWithdrawalPenaltyFromOtherFunds
  );
  const [ruleOf55Applies, setRuleOf55Applies] = useState(DEFAULTS.ruleOf55Applies);
  const [isSepp, setIsSepp] = useState(DEFAULTS.isSepp);
  
  const [dataStored, setDataStored] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setWithdrawalAmount(savedData.withdrawalAmount ?? DEFAULTS.withdrawalAmount);
      setAge(savedData.age ?? DEFAULTS.age);
      setAccountType((savedData.accountType as 'traditional' | 'roth') ?? DEFAULTS.accountType);
      setFederalTaxBracket(savedData.federalTaxBracket ?? DEFAULTS.federalTaxBracket);
      // setStateTaxRate(savedData.stateTaxRate ?? DEFAULTS.stateTaxRate); // Remove loading old state rate
      setSelectedState(savedData.selectedState ?? DEFAULTS.selectedState); // Load selected state
      setHasQualifiedReason(savedData.hasQualifiedReason ?? DEFAULTS.hasQualifiedReason);
      setQualifiedReason(savedData.qualifiedReason ?? DEFAULTS.qualifiedReason);
      setPayWithdrawalPenaltyFromOtherFunds(
        savedData.payWithdrawalPenaltyFromOtherFunds ?? DEFAULTS.payWithdrawalPenaltyFromOtherFunds
      );
      setRuleOf55Applies(savedData.ruleOf55Applies ?? DEFAULTS.ruleOf55Applies);
      setIsSepp(savedData.isSepp ?? DEFAULTS.isSepp);
      setDataStored(true);
    }
  }, []);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [
    withdrawalAmount,
    age,
    accountType,
    federalTaxBracket,
    selectedState, // Use selectedState instead of stateTaxRate
    hasQualifiedReason,
    qualifiedReason,
    payWithdrawalPenaltyFromOtherFunds,
    ruleOf55Applies,
    isSepp
  ]);

  const calculateResults = () => {
    // Base variables
    const isOver59AndHalf = age >= 59.5;
    const isRothAccountWithQualifyingContributions = accountType === 'roth' && age >= 59.5;
    const federalTaxRate = parseFloat(federalTaxBracket) / 100;
    
    // Check for early withdrawal penalty exemptions
    const isPenaltyExempt = 
      isOver59AndHalf || 
      hasQualifiedReason || 
      ruleOf55Applies || 
      isSepp;
    
    // For Roth IRAs, determine taxable portion
    // This is a simplification - in reality, Roth withdrawal taxation depends on withdrawal ordering rules
    const isTaxableWithdrawal = accountType === 'traditional' || 
      (accountType === 'roth' && !isRothAccountWithQualifyingContributions);
    
    // Calculate penalty (10% for non-exempt early withdrawals)
    const penaltyRate = (!isPenaltyExempt && age < 59.5) ? 0.1 : 0;
    const penaltyAmount = withdrawalAmount * penaltyRate;
    
    // Calculate taxes
    const federalTaxAmount = isTaxableWithdrawal ? withdrawalAmount * federalTaxRate : 0;
    // Calculate state tax using the imported function and selected state
    // Treat withdrawal amount as income for this calculation (simplification)
    const stateTaxAmount = isTaxableWithdrawal ? calculateStateIncomeTax(withdrawalAmount, selectedState) : 0; 
    const totalTaxes = federalTaxAmount + stateTaxAmount;
    
    // Calculate total cost and net amount
    let totalCost = penaltyAmount + totalTaxes;
    let netAmount = withdrawalAmount - totalCost;
    
    // If paying penalty from other funds, adjust net amount
    if (payWithdrawalPenaltyFromOtherFunds) {
      netAmount = withdrawalAmount;
      // Total cost remains the same, but doesn't reduce the withdrawal amount
    }
    
    // Calculate effective tax rate
    const effectiveTaxRate = withdrawalAmount > 0 ? (totalCost / withdrawalAmount) * 100 : 0;
    
    setResults({
      grossWithdrawal: withdrawalAmount,
      federalTax: federalTaxAmount,
      stateTax: stateTaxAmount,
      earlyWithdrawalPenalty: penaltyAmount,
      totalCost: totalCost,
      netAmount: netAmount,
      effectiveTaxRate: effectiveTaxRate,
      isPenaltyExempt: isPenaltyExempt,
      isTaxableWithdrawal: isTaxableWithdrawal
    });
  };

  // Handle saving calculator data
  const handleSaveData = () => {
    const dataToSave = {
      withdrawalAmount,
      age,
      accountType,
      federalTaxBracket,
      // stateTaxRate, // Remove old state rate
      selectedState, // Save selected state
      hasQualifiedReason,
      qualifiedReason,
      payWithdrawalPenaltyFromOtherFunds,
      ruleOf55Applies,
      isSepp,
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your early IRA withdrawal calculator data has been saved locally.",
    });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Early IRA Withdrawal Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculate the taxes and penalties on early retirement account withdrawals
            </CardDescription>
          </div>
          {dataStored && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Data Saved Locally
            </div>
          )}
        </div>
      </CardHeader>
      
      <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mt-2 px-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="info">IRA Withdrawal Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">$</span>
                    <Input
                      id="withdrawalAmount"
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Your Current Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={0}
                    max={120}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Early withdrawal penalties generally apply before age 59½
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup 
                    value={accountType} 
                    onValueChange={(value: 'traditional' | 'roth') => setAccountType(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="traditional" id="traditional" />
                      <Label htmlFor="traditional" className="cursor-pointer">Traditional IRA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="roth" id="roth" />
                      <Label htmlFor="roth" className="cursor-pointer">Roth IRA</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="federalTaxBracket">Federal Tax Bracket</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p className="text-xs">
                            Your marginal tax bracket. This is a simplified calculation since your actual tax situation may be more complex.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select 
                    value={federalTaxBracket} 
                    onValueChange={setFederalTaxBracket}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your tax bracket" />
                    </SelectTrigger>
                    <SelectContent>
                      {FEDERAL_TAX_BRACKETS.map((bracket) => (
                        <SelectItem key={bracket.value} value={bracket.value}>
                          {bracket.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                   <Label htmlFor="state">State</Label>
                   <Select value={selectedState} onValueChange={setSelectedState}>
                     <SelectTrigger id="state">
                       <SelectValue placeholder="Select state" />
                     </SelectTrigger>
                     <SelectContent>
                       {Object.keys(STATE_TAX_RATES).sort().map((stateName) => (
                         <SelectItem key={stateName} value={stateName}>
                           {stateName}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                
                <div className="space-y-2 border-t pt-4">
                  <Label>Special Circumstances</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="hasQualifiedReason" 
                        checked={hasQualifiedReason}
                        onCheckedChange={setHasQualifiedReason}
                      />
                      <Label htmlFor="hasQualifiedReason">Have a Qualified Exception Reason</Label>
                    </div>
                  </div>
                  
                  {hasQualifiedReason && (
                    <div className="ml-6 mt-2">
                      <Select 
                        value={qualifiedReason} 
                        onValueChange={setQualifiedReason}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select exception reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUALIFIED_REASONS.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id}>
                              {reason.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {QUALIFIED_REASONS.find(r => r.id === qualifiedReason)?.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="ruleOf55" 
                        checked={ruleOf55Applies}
                        onCheckedChange={setRuleOf55Applies}
                        disabled={age < 55}
                      />
                      <Label htmlFor="ruleOf55" className={age < 55 ? "text-muted-foreground" : ""}>
                        Rule of 55 Applies (401k only)
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isSepp" 
                        checked={isSepp}
                        onCheckedChange={setIsSepp}
                      />
                      <Label htmlFor="isSepp">Using SEPP (72t) Distributions</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="payPenaltyFromOtherFunds" 
                        checked={payWithdrawalPenaltyFromOtherFunds}
                        onCheckedChange={setPayWithdrawalPenaltyFromOtherFunds}
                      />
                      <Label htmlFor="payPenaltyFromOtherFunds">Pay Taxes/Penalties From Other Funds</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full text-white font-medium" 
                onClick={handleSaveData}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Inputs Locally
              </Button>
            </div>
            
            {/* Results Section */}
            <div className="space-y-6">
              {results && (
                <div className="space-y-6">
                  <div className="bg-finance-primary/10 rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Withdrawal Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Gross Withdrawal</p>
                        <p className="text-xl font-semibold">{formatCurrency(results.grossWithdrawal)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Net Amount Received</p>
                        <p className="text-xl font-semibold">{formatCurrency(results.netAmount)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Taxes & Penalties</p>
                        <p className="text-xl font-semibold">{formatCurrency(results.totalCost)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
                        <p className="text-xl font-semibold">{results.effectiveTaxRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detailed Breakdown</h3>
                    
                    <div className="bg-gray-50 rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Federal Income Tax:</span>
                        <span className="font-medium">{formatCurrency(results.federalTax)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {results.isTaxableWithdrawal 
                          ? `Based on ${federalTaxBracket}% tax bracket` 
                          : "Not applicable for qualified Roth distributions"}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>State Income Tax ({selectedState}):</span>
                        <span className="font-medium">{formatCurrency(results.stateTax)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {results.isTaxableWithdrawal 
                          ? `Calculated based on ${selectedState} tax rules (simplified)` 
                          : "Not applicable for qualified Roth distributions"}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Early Withdrawal Penalty (10%):</span>
                        <span className="font-medium">{formatCurrency(results.earlyWithdrawalPenalty)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {results.isPenaltyExempt 
                          ? "Exempt from early withdrawal penalty" 
                          : "10% penalty applies to withdrawals before age 59½"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes specific to the user's scenario */}
                  <div className="bg-gray-50 rounded-lg border p-4 text-sm">
                    <h4 className="font-medium mb-2">Notes on Your Scenario:</h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {age < 59.5 && !results.isPenaltyExempt && (
                        <li>Early withdrawal penalty applies because you're under age 59½ without qualifying for an exception.</li>
                      )}
                      
                      {results.isPenaltyExempt && (
                        <li>You're exempt from the 10% early withdrawal penalty due to {
                          age >= 59.5 ? "being age 59½ or older" :
                          hasQualifiedReason ? "qualifying for an exception" :
                          ruleOf55Applies ? "the Rule of 55" :
                          isSepp ? "using SEPP (72t) distributions" : ""
                        }.</li>
                      )}
                      
                      {accountType === 'roth' && age >= 59.5 && (
                        <li>Qualified Roth IRA distributions are completely tax-free.</li>
                      )}
                      
                      {accountType === 'roth' && age < 59.5 && !results.isPenaltyExempt && (
                        <li>For Roth IRAs, you can withdraw contributions (but not earnings) at any time without taxes or penalties. This calculator assumes you're withdrawing earnings.</li>
                      )}
                      
                      {payWithdrawalPenaltyFromOtherFunds && (
                        <li>You've chosen to pay taxes and penalties from other funds, so they won't reduce your withdrawal amount.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">IRA Withdrawal Rules (2024)</h3>
              <p className="text-muted-foreground">Understanding the rules and penalties for IRA withdrawals can help you make informed decisions about your retirement savings.</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Traditional IRA Rules</h4>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Taxation</h5>
                <p>Withdrawals from Traditional IRAs are generally taxed as ordinary income at your current tax bracket. This applies to both principal and earnings.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Early Withdrawal Penalty</h5>
                <p>Withdrawals before age 59½ are typically subject to a 10% early withdrawal penalty in addition to regular income taxes, unless you qualify for an exception.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Required Minimum Distributions (RMDs)</h5>
                <p>You must begin taking RMDs by April 1 following the year you turn 73 (for those born between 1951-1959) or 75 (for those born in 1960 or later).</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Roth IRA Rules</h4>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Contribution Withdrawals</h5>
                <p>You can withdraw your original Roth IRA contributions at any time, tax and penalty-free, regardless of age.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Earnings Withdrawals</h5>
                <p>Earnings can be withdrawn tax and penalty-free if your Roth account is at least 5 years old AND you're at least 59½, disabled, using up to $10,000 for a first-time home purchase, or withdrawals are made by your beneficiary after your death.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">No Required Minimum Distributions</h5>
                <p>Roth IRAs aren't subject to RMDs during the account owner's lifetime.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Early Withdrawal Penalty Exceptions</h4>
              <p className="text-sm text-muted-foreground mb-2">The following exceptions may apply to both Traditional and Roth IRAs:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">First-Time Home Purchase</h5>
                  <p className="text-sm">Up to $10,000 lifetime limit (per person) for a first-time home purchase.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Higher Education Expenses</h5>
                  <p className="text-sm">Qualified expenses for yourself, spouse, children, or grandchildren.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Medical Expenses</h5>
                  <p className="text-sm">Unreimbursed medical expenses exceeding 7.5% of your adjusted gross income.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Health Insurance Premiums</h5>
                  <p className="text-sm">While unemployed for at least 12 weeks.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Disability</h5>
                  <p className="text-sm">If you become totally and permanently disabled.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Death</h5>
                  <p className="text-sm">Distributions to your beneficiary or estate after your death.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">Birth or Adoption</h5>
                  <p className="text-sm">Up to $5,000 within one year of birth or adoption of a child.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border p-4">
                  <h5 className="font-medium mb-1">IRS Levy</h5>
                  <p className="text-sm">Payments due to an IRS tax levy.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Special Withdrawal Options</h4>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Rule of 55</h5>
                <p className="mb-2">If you leave your job in or after the year you turn 55, you can withdraw from that employer's 401(k) or 403(b) plan without the 10% early withdrawal penalty.</p>
                <p className="text-sm text-muted-foreground">Note: This applies to 401(k)/403(b) plans, not IRAs. However, it's included in this calculator for comparison purposes.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border p-4">
                <h5 className="font-medium mb-2">Substantially Equal Periodic Payments (SEPP/72t)</h5>
                <p>You can avoid the 10% penalty by taking a series of substantially equal periodic payments based on your life expectancy. These payments must continue for 5 years or until you reach age 59½, whichever is longer.</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-700 mb-2">
                <Info className="h-5 w-5" />
                Important Disclaimer
              </h4>
              <p className="text-sm text-blue-700">This calculator provides estimates based on the information you provide and current tax laws. Tax rules are complex and subject to change. For personalized advice, consult with a qualified tax professional or financial advisor.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-gray-50 border-t p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-black mb-1">Calculator Limitations</p>
            <p>This calculator provides a simplified estimate of potential taxes and penalties. Actual results may vary based on your complete tax situation, including other income, deductions, and tax credits. State tax treatment of retirement account withdrawals varies by state.</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EarlyIraWithdrawalCalculator;
