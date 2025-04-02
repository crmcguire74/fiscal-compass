import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator, Home, Car, Landmark, CreditCard, Briefcase, CircleDollarSign, Banknote, Plus, Minus, Gavel, Info, TrendingUp } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// Assets and debts type definitions
type Asset = {
  id: string;
  name: string;
  value: number;
  owner: string;
  notes: string;
};

type Debt = {
  id: string;
  name: string;
  amount: number;
  owner: string;
  notes: string;
};

// State type definition for equitable distribution
type StateRule = {
  name: string;
  type: 'equitable' | 'community';
  description: string;
};

const stateRules: StateRule[] = [
  { name: 'Alabama', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Alaska', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Arizona', type: 'community', description: 'Community property (50/50)' },
  { name: 'Arkansas', type: 'equitable', description: 'Equitable distribution' },
  { name: 'California', type: 'community', description: 'Community property (50/50)' },
  { name: 'Colorado', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Connecticut', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Delaware', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Florida', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Georgia', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Hawaii', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Idaho', type: 'community', description: 'Community property (50/50)' },
  { name: 'Illinois', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Indiana', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Iowa', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Kansas', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Kentucky', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Louisiana', type: 'community', description: 'Community property (50/50)' },
  { name: 'Maine', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Maryland', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Massachusetts', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Michigan', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Minnesota', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Mississippi', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Missouri', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Montana', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Nebraska', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Nevada', type: 'community', description: 'Community property (50/50)' },
  { name: 'New Hampshire', type: 'equitable', description: 'Equitable distribution' },
  { name: 'New Jersey', type: 'equitable', description: 'Equitable distribution' },
  { name: 'New Mexico', type: 'community', description: 'Community property (50/50)' },
  { name: 'New York', type: 'equitable', description: 'Equitable distribution' },
  { name: 'North Carolina', type: 'equitable', description: 'Equitable distribution' },
  { name: 'North Dakota', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Ohio', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Oklahoma', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Oregon', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Pennsylvania', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Rhode Island', type: 'equitable', description: 'Equitable distribution' },
  { name: 'South Carolina', type: 'equitable', description: 'Equitable distribution' },
  { name: 'South Dakota', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Tennessee', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Texas', type: 'community', description: 'Community property (50/50)' },
  { name: 'Utah', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Vermont', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Virginia', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Washington', type: 'community', description: 'Community property (50/50)' },
  { name: 'West Virginia', type: 'equitable', description: 'Equitable distribution' },
  { name: 'Wisconsin', type: 'community', description: 'Community property (50/50)' },
  { name: 'Wyoming', type: 'equitable', description: 'Equitable distribution' },
];

// Pre-defined asset and debt templates
const assetTemplates = [
  { name: 'Primary Home', icon: <Home className="h-4 w-4" /> },
  { name: 'Vacation Property', icon: <Home className="h-4 w-4" /> },
  { name: 'Vehicle', icon: <Car className="h-4 w-4" /> },
  { name: 'Checking Account', icon: <Landmark className="h-4 w-4" /> },
  { name: 'Savings Account', icon: <Landmark className="h-4 w-4" /> },
  { name: 'Retirement Account', icon: <Briefcase className="h-4 w-4" /> },
  { name: 'Investment Account', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'Business Interest', icon: <Briefcase className="h-4 w-4" /> },
  { name: 'Valuable Items', icon: <CircleDollarSign className="h-4 w-4" /> },
];

const debtTemplates = [
  { name: 'Mortgage', icon: <Home className="h-4 w-4" /> },
  { name: 'Auto Loan', icon: <Car className="h-4 w-4" /> },
  { name: 'Credit Card Debt', icon: <CreditCard className="h-4 w-4" /> },
  { name: 'Student Loan', icon: <Landmark className="h-4 w-4" /> },
  { name: 'Personal Loan', icon: <Banknote className="h-4 w-4" /> },
  { name: 'Business Loan', icon: <Briefcase className="h-4 w-4" /> },
  { name: 'Tax Debt', icon: <CircleDollarSign className="h-4 w-4" /> },
];

const DivorceCalculator = () => {
  const { toast } = useToast();
  
  // State management
  const [assets, setAssets] = useState<Asset[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedState, setSelectedState] = useState<string>('California');
  const [equitySplit, setEquitySplit] = useState<number>(50);
  const [distributionMethod, setDistributionMethod] = useState<'state' | 'custom'>('state');
  const [showEquitableSplit, setShowEquitableSplit] = useState<boolean>(false);

  // Form fields for new assets/debts
  const [newAssetName, setNewAssetName] = useState<string>('');
  const [newAssetValue, setNewAssetValue] = useState<string>('');
  const [newAssetOwner, setNewAssetOwner] = useState<string>('joint');
  const [newAssetNotes, setNewAssetNotes] = useState<string>('');

  const [newDebtName, setNewDebtName] = useState<string>('');
  const [newDebtAmount, setNewDebtAmount] = useState<string>('');
  const [newDebtOwner, setNewDebtOwner] = useState<string>('joint');
  const [newDebtNotes, setNewDebtNotes] = useState<string>('');

  // Handle adding a new asset
  const handleAddAsset = () => {
    if (!newAssetName || !newAssetValue) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and value for the asset.",
        variant: "destructive",
      });
      return;
    }

    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      name: newAssetName,
      value: parseFloat(newAssetValue),
      owner: newAssetOwner,
      notes: newAssetNotes,
    };

    setAssets([...assets, newAsset]);
    
    // Reset form fields
    setNewAssetName('');
    setNewAssetValue('');
    setNewAssetOwner('joint');
    setNewAssetNotes('');

    toast({
      title: "Asset added",
      description: `${newAssetName} has been added to your assets.`,
    });
  };

  // Handle adding a new debt
  const handleAddDebt = () => {
    if (!newDebtName || !newDebtAmount) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and amount for the debt.",
        variant: "destructive",
      });
      return;
    }

    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name: newDebtName,
      amount: parseFloat(newDebtAmount),
      owner: newDebtOwner,
      notes: newDebtNotes,
    };

    setDebts([...debts, newDebt]);
    
    // Reset form fields
    setNewDebtName('');
    setNewDebtAmount('');
    setNewDebtOwner('joint');
    setNewDebtNotes('');

    toast({
      title: "Debt added",
      description: `${newDebtName} has been added to your debts.`,
    });
  };

  // Handle removing an asset
  const handleRemoveAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast({
      title: "Asset removed",
      description: "The asset has been removed from your list.",
    });
  };

  // Handle removing a debt
  const handleRemoveDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
    toast({
      title: "Debt removed",
      description: "The debt has been removed from your list.",
    });
  };

  // Handle asset template selection
  const handleAssetTemplateSelect = (templateName: string) => {
    setNewAssetName(templateName);
  };

  // Handle debt template selection
  const handleDebtTemplateSelect = (templateName: string) => {
    setNewDebtName(templateName);
  };

  // Handle state selection
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    
    // Check if the selected state is a community property state
    const stateRule = stateRules.find(rule => rule.name === state);
    if (stateRule) {
      if (stateRule.type === 'community') {
        setEquitySplit(50);
        setShowEquitableSplit(false);
      } else {
        setShowEquitableSplit(true);
      }
    }
  };

  // Calculate total assets
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Calculate total debts
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  // Calculate net worth (assets - debts)
  const netWorth = totalAssets - totalDebts;

  // Calculate distribution based on the selected method
  const calculateDistribution = () => {
    const stateRule = stateRules.find(rule => rule.name === selectedState);
    let party1Percentage = 50;
    let party2Percentage = 50;
    
    if (distributionMethod === 'custom') {
      party1Percentage = equitySplit;
      party2Percentage = 100 - equitySplit;
    } else if (stateRule && stateRule.type === 'equitable' && showEquitableSplit) {
      party1Percentage = equitySplit;
      party2Percentage = 100 - equitySplit;
    }
    
    const party1Amount = (netWorth * party1Percentage) / 100;
    const party2Amount = (netWorth * party2Percentage) / 100;
    
    return {
      party1: { percentage: party1Percentage, amount: party1Amount },
      party2: { percentage: party2Percentage, amount: party2Amount }
    };
  };

  const distribution = calculateDistribution();

  // Prepare chart data
  const prepareChartData = () => {
    const { party1, party2 } = distribution;
    
    return [
      { name: 'Party 1', value: Math.max(0, party1.amount), percentage: party1.percentage },
      { name: 'Party 2', value: Math.max(0, party2.amount), percentage: party2.percentage }
    ];
  };

  const chartData = prepareChartData();
  const COLORS = ['#8B5CF6', '#0EA5E9'];

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Divorce Asset Division Calculator</CardTitle>
          <CardDescription>
            Calculate how assets and debts might be divided during a divorce based on your state's laws.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="debts">Debts</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Assets</h3>
                
                <div className="grid gap-4 grid-cols-3 sm:grid-cols-5 mb-4">
                  {assetTemplates.map((template, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="h-auto py-2 px-3 flex flex-col items-center justify-center text-xs gap-1"
                      onClick={() => handleAssetTemplateSelect(template.name)}
                    >
                      {template.icon}
                      <span>{template.name}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="assetName">Asset Name</Label>
                      <Input 
                        id="assetName" 
                        placeholder="e.g., House, Car, 401k" 
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assetValue">Value</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          id="assetValue" 
                          type="number" 
                          placeholder="Asset value" 
                          className="pl-7"
                          value={newAssetValue}
                          onChange={(e) => setNewAssetValue(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetOwner">Owner</Label>
                      <Select value={newAssetOwner} onValueChange={setNewAssetOwner}>
                        <SelectTrigger id="assetOwner">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joint">Joint</SelectItem>
                          <SelectItem value="party1">Party 1</SelectItem>
                          <SelectItem value="party2">Party 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetNotes">Notes (Optional)</Label>
                      <Input 
                        id="assetNotes" 
                        placeholder="Any additional details" 
                        value={newAssetNotes}
                        onChange={(e) => setNewAssetNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddAsset} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Asset
                  </Button>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Your Assets</h3>
                {assets.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No assets added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="space-y-1">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Owner: {asset.owner === 'joint' ? 'Joint' : asset.owner === 'party1' ? 'Party 1' : 'Party 2'}
                            {asset.notes && ` • ${asset.notes}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{formatCurrency(asset.value)}</div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between font-semibold p-4 bg-muted/20 rounded-lg">
                      <span>Total Assets</span>
                      <span>{formatCurrency(totalAssets)}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Debts Tab */}
            <TabsContent value="debts" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Debts</h3>
                
                <div className="grid gap-4 grid-cols-3 sm:grid-cols-5 mb-4">
                  {debtTemplates.map((template, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="h-auto py-2 px-3 flex flex-col items-center justify-center text-xs gap-1"
                      onClick={() => handleDebtTemplateSelect(template.name)}
                    >
                      {template.icon}
                      <span>{template.name}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="debtName">Debt Name</Label>
                      <Input 
                        id="debtName" 
                        placeholder="e.g., Mortgage, Car Loan" 
                        value={newDebtName}
                        onChange={(e) => setNewDebtName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="debtAmount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          id="debtAmount" 
                          type="number" 
                          placeholder="Debt amount" 
                          className="pl-7"
                          value={newDebtAmount}
                          onChange={(e) => setNewDebtAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debtOwner">Owner</Label>
                      <Select value={newDebtOwner} onValueChange={setNewDebtOwner}>
                        <SelectTrigger id="debtOwner">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joint">Joint</SelectItem>
                          <SelectItem value="party1">Party 1</SelectItem>
                          <SelectItem value="party2">Party 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debtNotes">Notes (Optional)</Label>
                      <Input 
                        id="debtNotes" 
                        placeholder="Any additional details" 
                        value={newDebtNotes}
                        onChange={(e) => setNewDebtNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddDebt} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Debt
                  </Button>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Your Debts</h3>
                {debts.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No debts added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {debts.map((debt) => (
                      <div key={debt.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="space-y-1">
                          <div className="font-medium">{debt.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Owner: {debt.owner === 'joint' ? 'Joint' : debt.owner === 'party1' ? 'Party 1' : 'Party 2'}
                            {debt.notes && ` • ${debt.notes}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{formatCurrency(debt.amount)}</div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveDebt(debt.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between font-semibold p-4 bg-muted/20 rounded-lg">
                      <span>Total Debts</span>
                      <span>{formatCurrency(totalDebts)}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Distribution Method</h3>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div><Info className="h-4 w-4 text-muted-foreground" /></div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">
                          "State Law" follows your state's rules for division. "Custom" lets you set your own percentages.
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                
                <RadioGroup value={distributionMethod} onValueChange={(value: 'state' | 'custom') => setDistributionMethod(value)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="state" id="state-law" />
                    <Label htmlFor="state-law">State Law</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </RadioGroup>
                
                <div className="p-4 border rounded-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">Select Your State</Label>
                      <Select value={selectedState} onValueChange={handleStateChange}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {stateRules.map((state) => (
                            <SelectItem key={state.name} value={state.name}>
                              {state.name} - {state.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {(showEquitableSplit || distributionMethod === 'custom') && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="equitySplit">Equity Split (Party 1)</Label>
                          <span className="text-sm font-medium">{equitySplit}%</span>
                        </div>
                        <Input
                          id="equitySplit"
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={equitySplit}
                          onChange={(e) => setEquitySplit(parseInt(e.target.value))}
                          className="accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>State Laws Can Vary</AlertTitle>
                  <AlertDescription>
                    {selectedState && stateRules.find(state => state.name === selectedState)?.type === 'community'
                      ? "Community property states generally divide marital property 50/50, regardless of other factors."
                      : "Equitable distribution states divide property 'fairly,' which isn't always equal. Factors like marriage length and each spouse's economic circumstances are considered."
                    }
                  </AlertDescription>
                </Alert>
                
                <div className="p-4 border rounded-lg bg-muted/10">
                  <div className="space-y-2">
                    <h4 className="font-medium">Distribution Summary</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Party 1 Share</div>
                        <div className="text-xl font-bold">{distribution.party1.percentage}%</div>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Party 2 Share</div>
                        <div className="text-xl font-bold">{distribution.party2.percentage}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Financial Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Assets</span>
                        <span className="font-semibold">{formatCurrency(totalAssets)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Debts</span>
                        <span className="font-semibold text-destructive">{formatCurrency(totalDebts)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Net Worth</span>
                        <span className={netWorth >= 0 ? "text-green-600" : "text-destructive"}>
                          {formatCurrency(netWorth)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Distribution Results</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Party 1 Share</div>
                            <div className="text-xl font-bold">{formatCurrency(distribution.party1.amount)}</div>
                          </div>
                          <div className="text-2xl font-bold text-primary">{distribution.party1.percentage}%</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Party 2 Share</div>
                            <div className="text-xl font-bold">{formatCurrency(distribution.party2.amount)}</div>
                          </div>
                          <div className="text-2xl font-bold text-primary">{distribution.party2.percentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <Gavel className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer</AlertTitle>
                    <AlertDescription>
                      This calculator provides estimates only and should not replace legal advice. Consult with a family law attorney for guidance specific to your situation.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="flex flex-col justify-center items-center p-4 border rounded-lg h-[400px]">
                  {assets.length === 0 && debts.length === 0 ? (
                    <div className="text-center">
                      <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        Add assets and debts to see your distribution visualization.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-6">Asset Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) => `${name} (${percentage}%)`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Divorce Asset Division</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Community Property States</h3>
            <p className="text-muted-foreground text-sm">
              In community property states (Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, and Wisconsin), most assets and debts acquired during marriage are considered jointly owned and are typically divided 50/50 regardless of who earned the money or whose name is on the title.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Equitable Distribution States</h3>
            <p className="text-muted-foreground text-sm">
              In all other states, courts divide property "equitably" or fairly, which doesn't necessarily mean equally. Factors considered include marriage length, each person's economic circumstances, contributions to the marriage, and more.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Separate vs. Marital Property</h3>
            <p className="text-muted-foreground text-sm">
              Generally, property owned before marriage, gifts, and inheritances received by one spouse remain separate property. However, separate property can become marital property if it's commingled or used for the benefit of the marriage.
            </p>
          </div>
          
          <Alert className="mt-4">
            <Gavel className="h-4 w-4" />
            <AlertTitle>Legal Considerations</AlertTitle>
            <AlertDescription>
              This calculator provides a simplified estimate. Actual divorce settlements involve many factors including child custody, alimony, tax implications, and more. Always consult with a qualified family law attorney in your state.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default DivorceCalculator;
