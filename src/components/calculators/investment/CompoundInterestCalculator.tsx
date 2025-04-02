
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { Info, Calculator, Download, Save } from 'lucide-react';
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
import { 
  calculateCompoundInterest, 
  formatCurrency, 
  formatLargeNumber 
} from '@/utils/calculatorUtils';
import { 
  COMPOUND_INTEREST_DEFAULTS, 
  COMPOUNDING_FREQUENCIES 
} from '@/lib/constants';
import { 
  saveCalculatorData, 
  getCalculatorData 
} from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'compound-interest';

const CompoundInterestCalculator = () => {
  const { toast } = useToast();
  const [principal, setPrincipal] = useState(COMPOUND_INTEREST_DEFAULTS.principal);
  const [monthlyContribution, setMonthlyContribution] = useState(COMPOUND_INTEREST_DEFAULTS.monthlyContribution);
  const [interestRate, setInterestRate] = useState(COMPOUND_INTEREST_DEFAULTS.interestRate);
  const [years, setYears] = useState(COMPOUND_INTEREST_DEFAULTS.years);
  const [compoundingFrequency, setCompoundingFrequency] = useState(COMPOUND_INTEREST_DEFAULTS.compoundingFrequency);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [dataStored, setDataStored] = useState(false);

  // Find the selected compounding frequency object
  const selectedFrequency = COMPOUNDING_FREQUENCIES.find(
    freq => freq.value === compoundingFrequency
  ) || COMPOUNDING_FREQUENCIES[1]; // Default to monthly

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setPrincipal(savedData.principal || COMPOUND_INTEREST_DEFAULTS.principal);
      setMonthlyContribution(savedData.monthlyContribution || COMPOUND_INTEREST_DEFAULTS.monthlyContribution);
      setInterestRate(savedData.interestRate || COMPOUND_INTEREST_DEFAULTS.interestRate);
      setYears(savedData.years || COMPOUND_INTEREST_DEFAULTS.years);
      setCompoundingFrequency(savedData.compoundingFrequency || COMPOUND_INTEREST_DEFAULTS.compoundingFrequency);
      setDataStored(true);
    }
  }, []);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [principal, monthlyContribution, interestRate, years, compoundingFrequency]);

  // Calculate and update results
  const calculateResults = () => {
    const calculationResults = calculateCompoundInterest(
      principal,
      monthlyContribution,
      interestRate,
      years,
      selectedFrequency.timesPerYear
    );
    
    setResults(calculationResults);
  };

  // Handle saving calculator data
  const handleSaveData = () => {
    const dataToSave = {
      principal,
      monthlyContribution,
      interestRate,
      years,
      compoundingFrequency,
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your calculator data has been saved locally.",
    });
  };

  // Handle downloading results as CSV
  const handleDownloadCSV = () => {
    if (!results) return;
    
    // Create CSV content
    let csvContent = "Year,Balance,Annual Contribution,Interest Earned\n";
    results.yearlyData.forEach((yearData: any) => {
      csvContent += `${yearData.year},${yearData.balance.toFixed(2)},${yearData.contributions.toFixed(2)},${yearData.interest.toFixed(2)}\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'compound-interest-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">Year {label}</p>
          <p className="text-sm text-finance-primary">
            Balance: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-sm text-finance-secondary">
              Principal + Contributions: {formatCurrency(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Prepare chart data - accumulate the contributions
  const getChartData = () => {
    if (!results) return [];
    
    let accumulatedContributions = principal;
    
    return results.yearlyData.map((yearData: any) => {
      accumulatedContributions += yearData.contributions;
      return {
        year: yearData.year,
        balance: yearData.balance,
        contributions: accumulatedContributions,
      };
    });
  };

  // Calculate growth breakdown for final balance
  const calculateBreakdown = () => {
    if (!results) return { principal: 0, contributions: 0, interest: 0 };
    
    const totalContributions = results.totalContributions - principal;
    
    return {
      principal,
      contributions: totalContributions,
      interest: results.totalInterestEarned,
    };
  };

  // Format for a readability tooltip that explains the calculation
  const getCalculationExplanation = () => {
    return `
      Starting with $${principal.toLocaleString()}, 
      contributing $${monthlyContribution.toLocaleString()} monthly,
      at ${interestRate}% annual interest 
      compounded ${selectedFrequency.label.toLowerCase()},
      over ${years} years.
    `;
  };

  // Get custom colors for the breakdown chart
  const getBreakdownColors = () => ({
    principal: '#1a365d',   // Dark blue for principal
    contributions: '#4ade80', // Green for contributions
    interest: '#f59e0b',    // Amber for interest earned
  });

  const breakdownColors = getBreakdownColors();
  
  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Compound Interest Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              See how your money can grow through the power of compound interest
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
                  <Label htmlFor="principal" className="calculator-label">Initial Investment</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you're starting with today. This could be money you've already saved or an initial lump sum you're investing.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="monthlyContribution" className="calculator-label">Monthly Contribution</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you plan to add every month. Regular contributions can significantly impact your final balance.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interestRate" className="calculator-label">Annual Interest Rate (%)</Label>
                <span className="text-sm font-medium">{interestRate}%</span>
              </div>
              <Slider
                id="interestRate"
                value={[interestRate]}
                min={0}
                max={20}
                step={0.1}
                onValueChange={(value) => setInterestRate(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
                <span>20%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="years" className="calculator-label">Investment Period (Years)</Label>
                <span className="text-sm font-medium">{years} years</span>
              </div>
              <Slider
                id="years"
                value={[years]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setYears(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="compoundingFrequency" className="calculator-label">Compounding Frequency</Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">How often interest is calculated and added to your balance. More frequent compounding leads to slightly higher returns.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Select
                value={compoundingFrequency}
                onValueChange={(value) => setCompoundingFrequency(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {COMPOUNDING_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="calculator-panel">
                    <h3 className="text-lg font-medium mb-3">Results Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Final Balance</p>
                        <p className="text-2xl font-semibold text-finance-primary">
                          {formatCurrency(results.finalBalance)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Contributions</p>
                        <p className="text-lg font-medium text-finance-secondary">
                          {formatCurrency(results.totalContributions)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Interest Earned</p>
                        <p className="text-lg font-medium text-finance-accent">
                          {formatCurrency(results.totalInterestEarned)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center cursor-help">
                              <Info className="h-3 w-3 mr-1" />
                              <span>How is this calculated?</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80 text-xs">{getCalculationExplanation()}</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="chart">Growth Chart</TabsTrigger>
                    <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                    <TabsTrigger value="data">Year by Year</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="space-y-4">
                    <div className="calculator-panel h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getChartData()}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={formatLargeNumber} 
                            label={{ value: 'Balance', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} />
                          <Line 
                            type="monotone" 
                            dataKey="balance" 
                            name="Balance" 
                            stroke={breakdownColors.interest} 
                            strokeWidth={3} 
                            dot={false} 
                            activeDot={{ r: 6 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="contributions" 
                            name="Principal + Contributions" 
                            stroke={breakdownColors.contributions} 
                            strokeWidth={2} 
                            strokeDasharray="5 5" 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="breakdown" className="space-y-4">
                    <div className="calculator-panel">
                      <h3 className="text-base font-medium mb-3">Final Balance Breakdown</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[calculateBreakdown()]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis tickFormatter={formatLargeNumber} />
                            <Tooltip 
                              formatter={(value: any) => [formatCurrency(value), '']} 
                              labelFormatter={() => ''} 
                            />
                            <Legend />
                            <Bar 
                              dataKey="interest" 
                              name="Interest Earned" 
                              stackId="a" 
                              fill={breakdownColors.interest} 
                              className="animate-chart-bar"
                              animationDuration={1000}
                              animationBegin={600}
                            />
                            <Bar 
                              dataKey="contributions" 
                              name="Your Contributions" 
                              stackId="a" 
                              fill={breakdownColors.contributions}
                              className="animate-chart-bar"
                              animationDuration={800}
                              animationBegin={300}
                            />
                            <Bar 
                              dataKey="principal" 
                              name="Initial Investment" 
                              stackId="a" 
                              fill={breakdownColors.principal}
                              className="animate-chart-bar"
                              animationDuration={600}
                              animationBegin={0}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-finance-primary rounded-sm mb-1"></div>
                          <div className="text-xs font-medium">Initial Investment</div>
                          <div className="text-xs">{formatCurrency(principal)}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-finance-secondary rounded-sm mb-1"></div>
                          <div className="text-xs font-medium">Added Contributions</div>
                          <div className="text-xs">{formatCurrency(results.totalContributions - principal)}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-finance-accent rounded-sm mb-1"></div>
                          <div className="text-xs font-medium">Interest Earned</div>
                          <div className="text-xs">{formatCurrency(results.totalInterestEarned)}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-4">
                    <div className="calculator-panel">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-medium">Year by Year Breakdown</h3>
                        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                          <Download className="h-4 w-4 mr-1" />
                          Download CSV
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 text-left font-medium">Year</th>
                              <th className="py-2 text-right font-medium">Balance</th>
                              <th className="py-2 text-right font-medium">Annual Contribution</th>
                              <th className="py-2 text-right font-medium">Interest Earned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.yearlyData.map((yearData: any, index: number) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-2 text-left">{yearData.year}</td>
                                <td className="py-2 text-right">{formatCurrency(yearData.balance)}</td>
                                <td className="py-2 text-right">{formatCurrency(yearData.contributions)}</td>
                                <td className="py-2 text-right">{formatCurrency(yearData.interest)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          <p>* Results are for illustrative purposes only and do not reflect actual investment results.</p>
          <p>* This calculator doesn't account for taxes, inflation, or investment fees.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CompoundInterestCalculator;
