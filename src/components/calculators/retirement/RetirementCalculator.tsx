
import { useState, useEffect } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ComposedChart } from 'recharts';
import { Calculator, DollarSign, HelpCircle, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  calculationMode: 'projection' as const,
  targetMonthlyIncome: 5000,
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
  const [calculationMode, setCalculationMode] = useState<'projection' | 'targetIncome'>(RETIREMENT_DEFAULTS.calculationMode);
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState(RETIREMENT_DEFAULTS.targetMonthlyIncome);
  
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
      setCalculationMode(savedData.calculationMode ?? RETIREMENT_DEFAULTS.calculationMode);
      setTargetMonthlyIncome(savedData.targetMonthlyIncome ?? RETIREMENT_DEFAULTS.targetMonthlyIncome);
      setDataStored(true);
    }
  }, []);

  // Calculate retirement projections whenever inputs change
  useEffect(() => {
    if (calculationMode === 'projection') {
      calculateRetirement();
    } else {
      calculateRequiredSavings();
    }
  }, [
    currentAge, retirementAge, lifeExpectancy, currentSavings,
    annualContribution, annualReturnRate, inflationRate,
    withdrawalRate, socialSecurityBenefit, includeInflation, includeSocialSecurity,
    calculationMode, targetMonthlyIncome
  ]);

  // Calculate required savings for target income using binary search
  const calculateRequiredSavings = () => {
    if (currentAge >= retirementAge || retirementAge >= lifeExpectancy) {
      return;
    }

    const targetAnnualIncome = targetMonthlyIncome * 12;
    const annualSocialSecurity = includeSocialSecurity ? socialSecurityBenefit * 12 : 0;
    const requiredAnnualIncome = targetAnnualIncome - annualSocialSecurity;
    
    // Calculate required savings at retirement
    const requiredSavings = (requiredAnnualIncome * 100) / withdrawalRate;
    
    // Binary search to find required annual contribution
    let low = 0;
    let high = requiredSavings; // Start with high estimate
    let bestContribution = 0;
    let bestProjection = null;
    
    for (let i = 0; i < 20; i++) { // Max 20 iterations for precision
      const testContribution = (low + high) / 2;
      const projection = projectRetirement(testContribution);
      const finalSavings = projection[projection.length - 1].savingsWithInflation;
      
      if (Math.abs(finalSavings - requiredSavings) < 1000) { // Within $1000 tolerance
        bestContribution = testContribution;
        bestProjection = projection;
        break;
      }
      
      if (finalSavings < requiredSavings) {
        low = testContribution;
      } else {
        high = testContribution;
        bestContribution = testContribution;
        bestProjection = projection;
      }
    }
    
    // Update state with results
    setAnnualContribution(Math.round(bestContribution));
    setProjectionData(bestProjection || []);
    
    if (bestProjection) {
      const retirementSavings = bestProjection[retirementAge - currentAge].savingsWithInflation;
      const annualRetirementIncome = retirementSavings * (withdrawalRate / 100);
      const monthlyRetirementIncome = annualRetirementIncome / 12;
      const totalSocialSecurityIncome = (socialSecurityBenefit * 12) * (lifeExpectancy - retirementAge);
      
      setResults({
        yearsUntilRetirement: retirementAge - currentAge,
        yearsInRetirement: lifeExpectancy - retirementAge,
        retirementSavings,
        annualRetirementIncome,
        monthlyRetirementIncome,
        totalSocialSecurityIncome,
        incomeReplacementRate: (annualRetirementIncome + annualSocialSecurity) / bestContribution * 100
      });
    }
  };

  // Helper function to project retirement savings for a given contribution
  const projectRetirement = (testContribution: number) => {
    const yearsUntilRetirement = retirementAge - currentAge;
    let projection: ProjectionData[] = [];
    let savingsWithoutInflation = currentSavings;
    let savingsWithInflation = currentSavings;
    const currentYear = new Date().getFullYear();
    const realReturnRate = includeInflation
      ? (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1
      : annualReturnRate / 100;
    
    // Project savings growth until retirement
    for (let year = 0; year <= yearsUntilRetirement; year++) {
      projection.push({
        age: currentAge + year,
        year: currentYear + year,
        savingsWithoutInflation,
        savingsWithInflation,
        annualContribution: year > 0 ? testContribution : 0,
        annualReturn: year > 0 ? savingsWithoutInflation * (annualReturnRate / 100) : 0
      });
      
      if (year < yearsUntilRetirement) {
        const returnWithoutInflation = savingsWithoutInflation * (annualReturnRate / 100);
        savingsWithoutInflation += testContribution + returnWithoutInflation;
        
        const returnWithInflation = savingsWithInflation * realReturnRate;
        savingsWithInflation += testContribution + returnWithInflation;
      }
    }
    
    return projection;
  };

  // Calculate retirement projections (normal mode)
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
      calculationMode,
      targetMonthlyIncome,
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
      const data = payload[0].payload;
      const age = label;
      const isRetirementPhase = age >= retirementAge;

      return (
        <div className="bg-white p-4 border rounded shadow-sm space-y-2 min-w-[200px]">
          <p className="font-semibold border-b pb-2">Age: {label}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Total Balance: <span className="text-blue-700">{formatCurrency(data.savingsWithInflation)}</span>
            </p>
            {isRetirementPhase ? (
              <>
                <p className="text-sm text-red-600">
                  Withdrawal: {formatCurrency(Math.abs(data.annualContribution))}
                </p>
                {includeSocialSecurity && (
                  <p className="text-sm text-amber-600">
                    Social Security: {formatCurrency(socialSecurityBenefit * 12)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-green-600">
                Contribution: {formatCurrency(data.annualContribution)}
              </p>
            )}
            <p className="text-sm text-emerald-600">
              Investment Return: {formatCurrency(data.annualReturn)}
            </p>
          </div>
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
            {/* Calculation Mode Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Choose Calculation Method</h3>
              <RadioGroup
                value={calculationMode}
                onValueChange={(value) => setCalculationMode(value as 'projection' | 'targetIncome')}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="projection" id="projection" />
                  <Label htmlFor="projection">Project based on contributions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="targetIncome" id="targetIncome" />
                  <Label htmlFor="targetIncome">Calculate needed savings for target income</Label>
                </div>
              </RadioGroup>

              {calculationMode === 'targetIncome' && (
                <div className="space-y-2">
                  <Label htmlFor="targetMonthlyIncome">Target Monthly Retirement Income</Label>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">$</span>
                    <Input
                      id="targetMonthlyIncome"
                      type="number"
                      value={targetMonthlyIncome}
                      onChange={(e) => setTargetMonthlyIncome(Number(e.target.value))}
                      min={0}
                    />
                    <span className="ml-2 text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your desired monthly income during retirement
                  </p>
                </div>
              )}
            </div>

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
                        <ComposedChart data={projectionData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="age" 
                            label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => formatLargeNumber(value)}
                            label={{ value: 'Balance', angle: -90, position: 'outside', offset: 0 }} 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} />
                          
                          {/* Area for investment returns */}
                          <Area
                            type="monotone"
                            dataKey="annualReturn"
                            name="Investment Returns"
                            stackId="1"
                            fill="#22c55e"
                            fillOpacity={0.4}
                            stroke="#16a34a"
                          />
                          
                          {/* Area for contributions */}
                          <Area
                            type="monotone"
                            dataKey="annualContribution"
                            name="Contributions"
                            stackId="1"
                            fill="#3b82f6"
                            fillOpacity={0.4}
                            stroke="#2563eb"
                          />
                          
                          {/* Line for total savings */}
                          <Line
                            type="monotone"
                            dataKey="savingsWithInflation"
                            name="Inflation-Adjusted Balance"
                            stroke="#1e3a8a"
                            strokeWidth={2}
                            dot={false}
                          />
                          
                          {/* Social Security benefits */}
                          {includeSocialSecurity && (
                            <Area
                              type="monotone"
                              dataKey={(d) => d.age >= retirementAge ? socialSecurityBenefit * 12 : 0}
                              name="Social Security"
                              stackId="2"
                              fill="#f59e0b"
                              fillOpacity={0.4}
                              stroke="#d97706"
                            />
                          )}
                          
                          {/* Retirement age marker */}
                          <ReferenceLine 
                            x={retirementAge} 
                            stroke="#dc2626"
                            strokeDasharray="3 3" 
                            label={{ 
                              value: 'Retirement', 
                              position: 'top',
                              fill: '#dc2626',
                              fontSize: 12,
                              fontWeight: 500
                            }} 
                          />
                          
                          {/* Add reference line for contribution end */}
                          <ReferenceLine 
                            x={retirementAge} 
                            stroke="#1e3a8a"
                            strokeDasharray="3 3" 
                            label={{ 
                              value: 'Contributions End', 
                              position: 'bottom',
                              fill: '#1e3a8a',
                              fontSize: 12,
                              fontWeight: 500
                            }} 
                          />
                        </ComposedChart>
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
