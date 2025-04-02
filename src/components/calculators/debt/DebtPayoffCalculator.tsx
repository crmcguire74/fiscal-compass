
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, ArrowDownUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';

const CALCULATOR_ID = 'debt-payoff-calculator';

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface PayoffResult {
  method: 'snowball' | 'avalanche';
  totalInterest: number;
  totalPaid: number;
  monthsToPayoff: number;
  payoffSchedule: Array<{
    month: number;
    remainingBalance: number;
    interestPaid: number;
    principalPaid: number;
  }>;
  debtDetails: Array<{
    id: string;
    name: string;
    payoffMonth: number;
    totalInterestPaid: number;
  }>;
}

const DebtPayoffCalculator = () => {
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: '1', name: 'Credit Card', balance: 5000, interestRate: 18, minimumPayment: 150 },
    { id: '2', name: 'Car Loan', balance: 12000, interestRate: 6, minimumPayment: 300 },
    { id: '3', name: 'Student Loan', balance: 20000, interestRate: 4.5, minimumPayment: 200 }
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(200);
  const [snowballResult, setSnowballResult] = useState<PayoffResult | null>(null);
  const [avalancheResult, setAvalancheResult] = useState<PayoffResult | null>(null);
  const [activeTab, setActiveTab] = useState<'snowball' | 'avalanche'>('snowball');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

  useEffect(() => {
    // Load saved data if available
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      if (savedData.debts) setDebts(savedData.debts);
      if (savedData.extraPayment) setExtraPayment(savedData.extraPayment);
      if (savedData.showAdvancedOptions) setShowAdvancedOptions(savedData.showAdvancedOptions);
    }
  }, []);

  useEffect(() => {
    // Auto-calculate when inputs change if we already have results
    if (snowballResult || avalancheResult) {
      calculatePayoff();
    }
  }, [debts, extraPayment]);

  const saveData = () => {
    saveCalculatorData(CALCULATOR_ID, {
      debts,
      extraPayment,
      showAdvancedOptions,
      lastCalculated: new Date().toISOString(),
      snowballResult,
      avalancheResult
    });
  };

  const handleAddDebt = () => {
    const newId = String(Math.max(0, ...debts.map(d => Number(d.id))) + 1);
    setDebts([...debts, { 
      id: newId, 
      name: `Debt ${debts.length + 1}`, 
      balance: 1000, 
      interestRate: 10, 
      minimumPayment: 50 
    }]);
  };

  const handleRemoveDebt = (id: string) => {
    if (debts.length <= 1) {
      toast({
        title: "Cannot Remove All Debts",
        description: "You need at least one debt for the calculation.",
        variant: "destructive"
      });
      return;
    }
    
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const handleDebtChange = (id: string, field: keyof DebtItem, value: number | string) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: typeof value === 'string' ? value : Number(value) } : debt
    ));
  };

  const sortDebtsByMethod = (method: 'snowball' | 'avalanche') => {
    const sortedDebts = [...debts];
    
    if (method === 'snowball') {
      // Sort by balance (smallest first)
      sortedDebts.sort((a, b) => a.balance - b.balance);
    } else {
      // Sort by interest rate (highest first)
      sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
    }
    
    return sortedDebts;
  };

  const calculatePayoff = () => {
    // Validate inputs first
    if (debts.some(debt => debt.balance <= 0 || debt.interestRate < 0 || debt.minimumPayment <= 0)) {
      toast({
        title: "Invalid Input",
        description: "All debts must have positive balances and minimum payments. Interest rates cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    if (extraPayment < 0) {
      toast({
        title: "Invalid Extra Payment",
        description: "Extra payment cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    // Calculate for snowball method
    const snowballResult = calculatePayoffPlan('snowball');
    setSnowballResult(snowballResult);

    // Calculate for avalanche method
    const avalancheResult = calculatePayoffPlan('avalanche');
    setAvalancheResult(avalancheResult);

    // Save calculation to storage
    saveData();

    // Display toast with results summary
    const difference = Math.abs(snowballResult.totalInterest - avalancheResult.totalInterest);
    const betterMethod = avalancheResult.totalInterest < snowballResult.totalInterest ? 'Avalanche' : 'Snowball';
    
    toast({
      title: "Calculation Complete",
      description: `${betterMethod} method saves ${formatCurrency(difference)} in interest.`,
    });
  };

  const calculatePayoffPlan = (method: 'snowball' | 'avalanche'): PayoffResult => {
    // Make a deep copy of debts and sort them by the selected method
    let workingDebts = sortDebtsByMethod(method).map(debt => ({...debt}));
    
    let month = 0;
    let totalInterestPaid = 0;
    let totalPaid = 0;
    const payoffSchedule = [];
    const debtDetails = workingDebts.map(debt => ({
      id: debt.id,
      name: debt.name,
      payoffMonth: 0,
      totalInterestPaid: 0
    }));
    
    // Calculate total minimum payment
    const totalMinPayment = workingDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    
    // Pay off all debts month by month
    while (workingDebts.length > 0) {
      month++;
      let monthlyRemainingBalance = 0;
      let monthlyInterestPaid = 0;
      let monthlyPrincipalPaid = 0;
      let extraRemaining = extraPayment;
      
      // Pay minimum on all debts
      for (let i = 0; i < workingDebts.length; i++) {
        const debt = workingDebts[i];
        
        // Calculate interest for this month
        const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
        const availableForPrincipal = debt.minimumPayment - monthlyInterest;
        
        // Update balance with minimum payment
        debt.balance = Math.max(0, debt.balance - availableForPrincipal);
        
        // Track interest paid
        totalInterestPaid += monthlyInterest;
        monthlyInterestPaid += monthlyInterest;
        monthlyPrincipalPaid += Math.min(availableForPrincipal, workingDebts[i].balance + availableForPrincipal);
        
        // Update debt-specific tracking
        const debtIndex = debtDetails.findIndex(d => d.id === debt.id);
        if (debtIndex >= 0) {
          debtDetails[debtIndex].totalInterestPaid += monthlyInterest;
        }
      }
      
      // Apply extra payment to first debt in the list (either smallest balance or highest interest)
      if (extraRemaining > 0 && workingDebts.length > 0) {
        const principalPayment = Math.min(workingDebts[0].balance, extraRemaining);
        workingDebts[0].balance -= principalPayment;
        extraRemaining -= principalPayment;
        monthlyPrincipalPaid += principalPayment;
      }
      
      // Check if any debts are paid off
      for (let i = workingDebts.length - 1; i >= 0; i--) {
        if (workingDebts[i].balance <= 0.01) { // Account for floating-point errors
          // Record payoff month
          const debtIndex = debtDetails.findIndex(d => d.id === workingDebts[i].id);
          if (debtIndex >= 0) {
            debtDetails[debtIndex].payoffMonth = month;
          }
          
          // Remove the debt from active list
          workingDebts.splice(i, 1);
        }
      }
      
      // Calculate total remaining balance across all debts
      monthlyRemainingBalance = workingDebts.reduce((sum, debt) => sum + debt.balance, 0);
      
      // Update payoff schedule
      payoffSchedule.push({
        month,
        remainingBalance: monthlyRemainingBalance,
        interestPaid: monthlyInterestPaid,
        principalPaid: monthlyPrincipalPaid
      });
      
      // Update total paid
      totalPaid += monthlyInterestPaid + monthlyPrincipalPaid;
      
      // Sort the working debts again (important for snowball as balances change)
      workingDebts = sortDebtsByMethod(method).filter(d => 
        workingDebts.some(wd => wd.id === d.id)
      );
    }
    
    return {
      method,
      totalInterest: totalInterestPaid,
      totalPaid,
      monthsToPayoff: month,
      payoffSchedule,
      debtDetails
    };
  };

  const activeResult = activeTab === 'snowball' ? snowballResult : avalancheResult;
  
  // Generate chart data
  const chartData = activeResult?.payoffSchedule.filter((_, i) => i % 3 === 0 || i === 0 || i === activeResult.payoffSchedule.length - 1)
    .map(item => ({
      month: item.month,
      balance: item.remainingBalance
    }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Debt Payoff Calculator</CardTitle>
        <CardDescription>
          Compare snowball and avalanche debt payoff strategies to find the best approach for your situation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Extra Payment */}
        <div className="space-y-2">
          <Label htmlFor="extraPayment">Monthly Extra Payment</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="extraPayment"
              type="number"
              min="0"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="flex-1"
            />
            <div className="text-sm text-muted-foreground w-24">
              {formatCurrency(extraPayment)}
            </div>
          </div>
        </div>

        {/* Debts Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Debts</h3>
            <Button onClick={handleAddDebt} size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Debt
            </Button>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {debts.map((debt) => (
              <div key={debt.id} className="space-y-2 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <Input
                    value={debt.name}
                    onChange={(e) => handleDebtChange(debt.id, 'name', e.target.value)}
                    className="flex-1 mr-2"
                    placeholder="Debt name"
                  />
                  <Button 
                    onClick={() => handleRemoveDebt(debt.id)} 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`balance-${debt.id}`}>Current Balance</Label>
                    <Input
                      id={`balance-${debt.id}`}
                      type="number"
                      min="0"
                      value={debt.balance}
                      onChange={(e) => handleDebtChange(debt.id, 'balance', Number(e.target.value))}
                      placeholder="Current balance"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`interest-${debt.id}`}>Interest Rate (%)</Label>
                    <Input
                      id={`interest-${debt.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={debt.interestRate}
                      onChange={(e) => handleDebtChange(debt.id, 'interestRate', Number(e.target.value))}
                      placeholder="Interest rate"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`minimum-${debt.id}`}>Minimum Payment</Label>
                    <Input
                      id={`minimum-${debt.id}`}
                      type="number"
                      min="0"
                      value={debt.minimumPayment}
                      onChange={(e) => handleDebtChange(debt.id, 'minimumPayment', Number(e.target.value))}
                      placeholder="Minimum payment"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={calculatePayoff}
            className="w-full bg-finance-primary hover:bg-finance-accent hover:text-white" 
          >
            Calculate Payoff Plan
          </Button>
        </div>

        {/* Results Section - show only if calculated */}
        {snowballResult && avalancheResult && (
          <div className="pt-4 border-t">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'snowball' | 'avalanche')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="snowball">Snowball Method</TabsTrigger>
                <TabsTrigger value="avalanche">Avalanche Method</TabsTrigger>
              </TabsList>
              
              <TabsContent value="snowball" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                    <div className="text-2xl font-semibold">{formatCurrency(snowballResult.totalInterest)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Time to Debt-Free</div>
                    <div className="text-2xl font-semibold">{snowballResult.monthsToPayoff} months</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                    <div className="text-2xl font-semibold">{formatCurrency(snowballResult.totalPaid)}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="avalanche" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                    <div className="text-2xl font-semibold">{formatCurrency(avalancheResult.totalInterest)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Time to Debt-Free</div>
                    <div className="text-2xl font-semibold">{avalancheResult.monthsToPayoff} months</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                    <div className="text-2xl font-semibold">{formatCurrency(avalancheResult.totalPaid)}</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Comparison Chart */}
            {chartData && chartData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Balance Over Time</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Month', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']} />
                      <Legend />
                      <Bar dataKey="balance" fill="#8884d8" name="Remaining Balance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Debt Payoff Order */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Debt Payoff Order</h3>
              <div className="border rounded-lg divide-y">
                {activeResult.debtDetails
                  .sort((a, b) => a.payoffMonth - b.payoffMonth)
                  .map((debt, index) => (
                    <div key={debt.id} className="p-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{index + 1}.</span> {debt.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Paid off in month {debt.payoffMonth} 
                        <span className="ml-2">({formatCurrency(debt.totalInterestPaid)} interest)</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4">
        <div className="space-y-2">
          <p>
            <strong>Snowball Method:</strong> Pays off smallest balances first for psychological wins.
          </p>
          <p>
            <strong>Avalanche Method:</strong> Pays off highest interest rates first to minimize interest costs.
          </p>
          <p className="italic mt-2">
            Both methods assume you make all minimum payments plus the extra amount each month.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DebtPayoffCalculator;
