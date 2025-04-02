
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calculator, DollarSign, HelpCircle, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'retirement-calculator';

// Default values
const RETIREMENT_DEFAULTS = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  annualContribution: 6000,
  annualReturnRate: 7,
  inflationRate: 2.5,
  withdrawalRate: 4,
  socialSecurityBenefit: 1500,
  includeInflation: true,
  includeSocialSecurity: true,
};

interface ProjectionData {
  age: number;
  year: number;
  savingsWithoutInflation: number;
  savingsWithInflation: number;
  annualContribution: number;
  annualReturn: number;
}

const RetirementCalculator = () => {
  const { toast } = useToast();
  const [currentAge, setCurrentAge] = useState(RETIREMENT_DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(RETIREMENT_DEFAULTS.retirementAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(RETIREMENT_DEFAULTS.lifeExpectancy);
  const [currentSavings, setCurrentSavings] = useState(RETIREMENT_DEFAULTS.currentSavings);
  const [annualContribution, setAnnualContribution] = useState(RETIREMENT_DEFAULTS.annualContribution);
  const [annualReturnRate, setAnnualReturnRate] = useState(RETIREMENT_DEFAULTS.annualReturnRate);
  const [inflationRate, setInflationRate] = useState(RETIREMENT_DEFAULTS.inflationRate);
  const [withdrawalRate, setWithdrawalRate] = useState(RETIREMENT_DEFAULTS.withdrawalRate);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(RETIREMENT_DEFAULTS.socialSecurityBenefit);
  const [includeInflation, setIncludeInflation] = useState(RETIREMENT_DEFAULTS.includeInflation);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState(RETIREMENT_DEFAULTS.includeSocialSecurity);
  
  const [activeTab, setActiveTab] = useState('projection');
  const [dataStored, setDataStored] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setCurrentAge(savedData.currentAge ?? RETIREMENT_DEFAULTS.currentAge);
      setRetirementAge(savedData.retirementAge ?? RETIREMENT_DEFAULTS.retirementAge);
      setLifeExpectancy(savedData.lifeExpectancy ?? RETIREMENT_DEFAULTS.lifeExpectancy);
      setCurrentSavings(savedData.currentSavings ?? RETIREMENT_DEFAULTS.currentSavings);
      setAnnualContribution(savedData.annualContribution ?? RETIREMENT_DEFAULTS.annualContribution);
      setAnnualReturnRate(savedData.annualReturnRate ?? RETIREMENT_DEFAULTS.annualReturnRate);
      setInflationRate(savedData.inflationRate ?? RETIREMENT_DEFAULTS.inflationRate);
      setWithdrawalRate(savedData.withdrawalRate ?? RETIREMENT_DEFAULTS.withdrawalRate);
      setSocialSecurityBenefit(savedData.socialSecurityBenefit ?? RETIREMENT_DEFAULTS.socialSecurityBenefit);
      setIncludeInflation(savedData.includeInflation ?? RETIREMENT_DEFAULTS.includeInflation);
      setIncludeSocialSecurity(savedData.includeSocialSecurity ?? RETIREMENT_DEFAULTS.includeSocialSecurity);
      setDataStored(true);
    }
  }, []);

  // Calculate retirement projections whenever inputs change
  useEffect(() => {
    calculateRetirement();
  }, [
    currentAge, retirementAge, lifeExpectancy, currentSavings, 
    annualContribution, annualReturnRate, inflationRate, 
    withdrawalRate, socialSecurityBenefit, includeInflation, includeSocialSecurity
  ]);

  // Calculate retirement projections
  const calculateRetirement = () => {
    if (currentAge >= retirementAge || retirementAge >= lifeExpectancy) {
      return;
    }

    const yearsUntilRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate in real terms (adjusted for inflation if selected)
    const realReturnRate = includeInflation 
      ? (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1
      : annualReturnRate / 100;
    
    // Project retirement savings growth
    let projection: ProjectionData[] = [];
    let savingsWithoutInflation = currentSavings;
    let savingsWithInflation = currentSavings;
    const currentYear = new Date().getFullYear();
    
    // Accumulation phase - before retirement
    for (let year = 0; year <= yearsUntilRetirement; year++) {
      const age = currentAge + year;
      
      if (year > 0) {
        // Add annual contribution and returns for this year
        const returnWithoutInflation = savingsWithoutInflation * (annualReturnRate / 100);
        savingsWithoutInflation += annualContribution + returnWithoutInflation;
        
        const returnWithInflation = savingsWithInflation * realReturnRate;
        savingsWithInflation += annualContribution + returnWithInflation;
      }
      
      projection.push({
        age,
        year: currentYear + year,
        savingsWithoutInflation,
        savingsWithInflation,
        annualContribution: year > 0 ? annualContribution : 0,
        annualReturn: year > 0 
          ? savingsWithoutInflation * (annualReturnRate / 100) 
          : 0
      });
    }
    
    // Distribution phase - after retirement
    const monthlySocialSecurity = includeSocialSecurity ? socialSecurityBenefit : 0;
    const annualSocialSecurity = monthlySocialSecurity * 12;
    
    // Inflation-adjusted withdrawal at retirement
    const initialWithdrawal = savingsWithInflation * (withdrawalRate / 100);
    
    // Continue projection into retirement
    for (let year = 1; year <= yearsInRetirement; year++) {
      const age = retirementAge + year;
      
      // Calculate withdrawal amount, reduced by Social Security
      let withdrawalWithoutInflation = savingsWithoutInflation * (withdrawalRate / 100);
      if (includeSocialSecurity) {
        withdrawalWithoutInflation = Math.max(0, withdrawalWithoutInflation - annualSocialSecurity);
      }
      
      let withdrawalWithInflation = savingsWithInflation * (withdrawalRate / 100);
      if (includeSocialSecurity) {
        withdrawalWithInflation = Math.max(0, withdrawalWithInflation - annualSocialSecurity);
      }
      
      // Calculate returns after withdrawal
      const returnWithoutInflation = (savingsWithoutInflation - withdrawalWithoutInflation) * (annualReturnRate / 100);
      savingsWithoutInflation = Math.max(0, savingsWithoutInflation - withdrawalWithoutInflation + returnWithoutInflation);
      
      const returnWithInflation = (savingsWithInflation - withdrawalWithInflation) * realReturnRate;
      savingsWithInflation = Math.max(0, savingsWithInflation - withdrawalWithInflation + returnWithInflation);
      
      projection.push({
        age,
        year: currentYear + yearsUntilRetirement + year,
        savingsWithoutInflation,
        savingsWithInflation,
        annualContribution: -withdrawalWithoutInflation,
        annualReturn: returnWithoutInflation
      });
    }
    
    setProjectionData(projection);
    
    // Calculate key result metrics
    const retirementSavings = projection[yearsUntilRetirement].savingsWithInflation;
    const annualRetirementIncome = retirementSavings * (withdrawalRate / 100);
    const monthlyRetirementIncome = annualRetirementIncome / 12;
    const totalSocialSecurityIncome = monthlySocialSecurity * 12 * yearsInRetirement;
    const incomeReplacementRate = (annualRetirementIncome + annualSocialSecurity) / annualContribution * 100;
    
    setResults({
      yearsUntilRetirement,
      yearsInRetirement,
      retirementSavings,
      annualRetirementIncome,
      monthlyRetirementIncome,
      totalSocialSecurityIncome,
      incomeReplacementRate
    });
  };

  // Handle saving calculator data
  const handleSaveData = () => {
    const dataToSave = {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      annualContribution,
      annualReturnRate,
      inflationRate,
      withdrawalRate,
      socialSecurityBenefit,
      includeInflation,
      includeSocialSecurity,
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your retirement calculator data has been saved locally.",
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">Age: {label}</p>
          <p className="text-sm text-blue-700">
            Savings: {formatCurrency(includeInflation ? payload[0].value : payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Retirement Savings Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Plan your retirement savings journey and estimate your future income
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">Your current age is the starting point for retirement calculations.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  min={18}
                  max={retirementAge - 1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The age when you plan to retire and start withdrawing from savings.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  min={currentAge + 1}
                  max={lifeExpectancy - 1}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                <span className="text-sm font-medium">{lifeExpectancy} years</span>
              </div>
              <Slider
                id="lifeExpectancy"
                value={[lifeExpectancy]}
                min={retirementAge + 1}
                max={120}
                step={1}
                onValueChange={(value) => setLifeExpectancy(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{retirementAge + 1}</span>
                <span>95</span>
                <span>120</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="currentSavings">Current Savings</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you currently have saved for retirement.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="annualContribution">Annual Contribution</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you contribute to retirement accounts each year.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="annualContribution"
                    type="number"
                    value={annualContribution}
                    onChange={(e) => setAnnualContribution(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="annualReturnRate">Expected Annual Return (%)</Label>
                <span className="text-sm font-medium">{annualReturnRate}%</span>
              </div>
              <Slider
                id="annualReturnRate"
                value={[annualReturnRate]}
                min={0}
                max={15}
                step={0.25}
                onValueChange={(value) => setAnnualReturnRate(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <span className="text-sm font-medium">{inflationRate}%</span>
                </div>
                <Slider
                  id="inflationRate"
                  value={[inflationRate]}
                  min={0}
                  max={10}
                  step={0.25}
                  onValueChange={(value) => setInflationRate(value[0])}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="withdrawalRate">Withdrawal Rate (%)</Label>
                  <span className="text-sm font-medium">{withdrawalRate}%</span>
                </div>
                <Slider
                  id="withdrawalRate"
                  value={[withdrawalRate]}
                  min={1}
                  max={10}
                  step={0.25}
                  onValueChange={(value) => setWithdrawalRate(value[0])}
                  className="py-4"
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Additional Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeInflation" 
                    checked={includeInflation}
                    onCheckedChange={setIncludeInflation}
                  />
                  <Label htmlFor="includeInflation">Include Inflation Adjustment</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeSocialSecurity" 
                    checked={includeSocialSecurity}
                    onCheckedChange={setIncludeSocialSecurity}
                  />
                  <Label htmlFor="includeSocialSecurity">Include Social Security</Label>
                </div>
                {includeSocialSecurity && (
                  <div className="flex items-center">
                    <span className="mr-1 text-sm">$</span>
                    <Input
                      id="socialSecurityBenefit"
                      type="number"
                      value={socialSecurityBenefit}
                      onChange={(e) => setSocialSecurityBenefit(Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                      min={0}
                    />
                    <span className="ml-1 text-sm">/month</span>
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
          
          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                <Tabs defaultValue="projection" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="projection">Projection</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="projection" className="p-4 border rounded-lg mt-4">
                    <h3 className="text-lg font-medium mb-4">Retirement Savings Projection</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="age" 
                            label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => formatLargeNumber(value)}
                            label={{ value: 'Savings', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="savingsWithInflation" 
                            name="Inflation-Adjusted Savings" 
                            stroke="#3b82f6" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="savingsWithoutInflation" 
                            name="Nominal Savings" 
                            stroke="#60a5fa" 
                            strokeDasharray="5 5" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="p-2 bg-gray-50 rounded border text-center">
                        <p className="text-xs text-muted-foreground">Years Until Retirement</p>
                        <p className="text-lg font-semibold">{results.yearsUntilRetirement}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border text-center">
                        <p className="text-xs text-muted-foreground">Years In Retirement</p>
                        <p className="text-lg font-semibold">{results.yearsInRetirement}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded border text-center">
                        <p className="text-xs text-muted-foreground">Savings At Retirement</p>
                        <p className="text-lg font-semibold">{formatCurrency(results.retirementSavings)}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="summary" className="p-4 border rounded-lg mt-4">
                    <h3 className="text-lg font-medium mb-4">Retirement Income Summary</h3>
                    
                    <div className="text-center p-4 bg-finance-primary/5 rounded-lg border mb-4">
                      <p className="text-sm text-muted-foreground">Monthly Retirement Income</p>
                      <p className="text-3xl font-bold text-finance-primary mt-1">
                        {formatCurrency(results.monthlyRetirementIncome + (includeSocialSecurity ? socialSecurityBenefit : 0))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on a {withdrawalRate}% annual withdrawal rate
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Income Breakdown</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{
                            name: 'Retirement Income',
                            withdrawal: results.annualRetirementIncome,
                            socialSecurity: includeSocialSecurity ? socialSecurityBenefit * 12 : 0
                          }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="withdrawal" name="Retirement Savings" fill="#3b82f6" />
                            <Bar dataKey="socialSecurity" name="Social Security" fill="#60a5fa" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-xs text-muted-foreground">Annual Retirement Income</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(results.annualRetirementIncome + (includeSocialSecurity ? socialSecurityBenefit * 12 : 0))}
                        </p>
                      </div>
                      
                      {includeSocialSecurity && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Social Security Income</p>
                          <p className="text-lg font-semibold">{formatCurrency(socialSecurityBenefit * 12)}</p>
                          <p className="text-xs text-muted-foreground">(per year)</p>
                        </div>
                      )}
                      
                      <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-xs text-muted-foreground">Total Cost of Retirement</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(results.annualRetirementIncome * results.yearsInRetirement)}
                        </p>
                      </div>
                      
                      {includeSocialSecurity && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Total Social Security</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(results.totalSocialSecurityIncome)}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-black mb-1">About this calculator</p>
            <p>This calculator provides estimates based on the information you provide. Actual results may vary due to market fluctuations, changes in tax laws, and other factors. Consider consulting with a financial advisor for personalized advice.</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RetirementCalculator;
