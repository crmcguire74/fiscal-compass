import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label as RechartsLabel } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { Percent, DollarSign, ListChecks, PlusCircle, XCircle, Info } from 'lucide-react'; // Added icons
import {
  Tooltip as UITooltip, // Renamed Tooltip
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CALCULATOR_ID = 'dti-calculator';

interface DebtItem {
  id: string; // Use unique ID for key prop
  name: string;
  payment: number;
}

const DtiCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  // Initialize with unique IDs
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 'debt-1', name: 'Mortgage/Rent', payment: 1500 },
    { id: 'debt-2', name: 'Car Loan', payment: 350 },
    { id: 'debt-3', name: 'Student Loans', payment: 250 },
    { id: 'debt-4', name: 'Credit Cards', payment: 200 },
    { id: 'debt-5', name: 'Other Debt', payment: 100 }
  ]);
  const [dtiRatio, setDtiRatio] = useState<number>(0);
  const [frontEndDti, setFrontEndDti] = useState<number>(0);
  const [dataStored, setDataStored] = useState(false); // Track if data was loaded

  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setMonthlyIncome(savedData.monthlyIncome || 5000);
      // Ensure loaded debts have IDs
      setDebts((savedData.debts || []).map((d: any, index: number) => ({
        id: d.id || `saved-debt-${index}-${Date.now()}`, // Generate ID if missing
        name: d.name || '',
        payment: Number(d.payment || 0)
      })));
      setDataStored(true); // Indicate data was loaded
    } else {
       // Ensure initial debts have IDs if no saved data
       setDebts(debts.map((d, index) => ({ ...d, id: d.id || `initial-debt-${index}-${Date.now()}` })));
    }
  }, []);

  useEffect(() => {
    calculateDti();
  }, [monthlyIncome, debts]);

  const calculateDti = () => {
    if (monthlyIncome <= 0) {
        setDtiRatio(0);
        setFrontEndDti(0);
        return;
    };

    const totalDebtPayments = debts.reduce((sum, debt) => sum + (Number(debt.payment) || 0), 0);
    // Find housing debt more robustly (case-insensitive, common terms)
    const housingDebt = debts.find(d => /mortgage|rent/i.test(d.name))?.payment || 0;

    const calculatedDti = (totalDebtPayments / monthlyIncome) * 100;
    const calculatedFrontEndDti = (housingDebt / monthlyIncome) * 100;

    setDtiRatio(calculatedDti);
    setFrontEndDti(calculatedFrontEndDti);

    // Save calculation to local storage
    saveCalculatorData(CALCULATOR_ID, {
      monthlyIncome,
      debts, // Save debts with IDs
      // dtiRatio: calculatedDti, // No need to save calculated values
      // frontEndDti: calculatedFrontEndDti,
      lastCalculated: new Date().toISOString()
    });
     setDataStored(true); // Mark as stored after calculation/update
  };

  const handleDebtChange = (id: string, value: number) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, payment: value } : debt));
  };

  const handleAddDebt = () => {
    setDebts([...debts, { id: `debt-${Date.now()}`, name: '', payment: 0 }]);
  };

  const handleRemoveDebt = (id: string) => {
    // Keep at least one entry, maybe clear it instead? Or allow removal?
    // For now, allow removal down to zero entries.
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const handleDebtNameChange = (id: string, name: string) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, name: name } : debt));
  };

  const getDtiStatus = (ratio: number) => {
    if (ratio <= 0) return { label: 'N/A', color: '#9ca3af' }; // Gray for N/A
    if (ratio < 36) return { label: 'Healthy', color: '#22c55e' }; // Green
    if (ratio < 43) return { label: 'Acceptable', color: '#facc15' }; // Yellow
    if (ratio < 50) return { label: 'High', color: '#f97316' }; // Orange
    return { label: 'Very High', color: '#ef4444' }; // Red
  };

  const backEndStatus = getDtiStatus(dtiRatio);
  const frontEndStatus = getDtiStatus(frontEndDti);

  // Threshold definitions with labels
  const backEndThresholds = [
    { value: 36, label: 'Good', color: '#22c55e' },
    { value: 43, label: 'Fair', color: '#facc15' },
    { value: 50, label: 'High', color: '#f97316' },
  ];
  const frontEndThresholds = [
    { value: 28, label: 'Good', color: '#22c55e' },
    // { value: 36, label: 'High', color: '#f97316' }, // Optional higher threshold
  ];

  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
         <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                <Percent className="h-6 w-6" />
                Debt-to-Income (DTI) Ratio Calculator
                </CardTitle>
                <CardDescription className="text-finance-primary-foreground/90 mt-1">
                Assess your financial health based on income and debt payments.
                </CardDescription>
            </div>
             {dataStored && (
                <TooltipProvider>
                    <UITooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 cursor-default">
                            <ListChecks size={12}/> Synced
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Your inputs are saved locally.</p>
                    </TooltipContent>
                    </UITooltip>
                </TooltipProvider>
            )}
         </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Monthly Income Input */}
        <Card className="border-dashed border-blue-300">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                    <DollarSign className="h-5 w-5" /> Gross Monthly Income
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-w-sm">
                    <Label htmlFor="monthlyIncome" className="flex items-center">
                        Income (before taxes)
                         <TooltipProvider>
                            <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Your total monthly income from all sources before any deductions.</p></TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="flex items-center">
                        <span className="input-prefix">$</span>
                        <Input
                        id="monthlyIncome"
                        type="number"
                        min="0"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                        className="input-field rounded-l-none"
                        placeholder="e.g., 5000"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>


        {/* Debts Section */}
         <Card className="border-dashed border-green-300">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                        <ListChecks className="h-5 w-5" /> Monthly Debt Payments
                    </CardTitle>
                    <Button onClick={handleAddDebt} variant="outline" size="sm">
                        <PlusCircle size={16} className="mr-2"/> Add Debt
                    </Button>
                </div>
                 <CardDescription>Include minimum payments for loans, credit cards, alimony, child support, etc.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 -mr-2"> {/* Added padding/margin for scrollbar */}
                    {debts.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No debts added yet. Click "Add Debt" to start.</p>
                    )}
                    {debts.map((debt) => (
                    <div key={debt.id} className="flex items-center space-x-2 p-3 border rounded bg-gray-50/50">
                        <Input
                            value={debt.name}
                            onChange={(e) => handleDebtNameChange(debt.id, e.target.value)}
                            className="flex-grow"
                            placeholder="Debt name (e.g., Rent, Car Loan)"
                        />
                        <div className="flex items-center">
                            <span className="input-prefix">$</span>
                            <Input
                                type="number"
                                min="0"
                                value={debt.payment}
                                onChange={(e) => handleDebtChange(debt.id, Number(e.target.value) || 0)}
                                className="input-field rounded-l-none w-32" // Fixed width for payment
                                placeholder="Payment"
                            />
                        </div>
                        <TooltipProvider>
                            <UITooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => handleRemoveDebt(debt.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-100"
                                    >
                                        <XCircle size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Remove this debt entry</p></TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6 pt-4 border-t">
          <h2 className="text-xl font-semibold text-center text-finance-primary">Your DTI Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Back-end DTI Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Back-End DTI (All Debts)
                         <TooltipProvider>
                            <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Percentage of income going towards ALL monthly debt payments.</p></TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Ratio: <span className="font-bold text-lg">{dtiRatio.toFixed(1)}%</span> | Status: <span className="font-medium" style={{ color: backEndStatus.color }}>{backEndStatus.label}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        layout="vertical"
                        data={[{ name: 'Back-End', dti: dtiRatio }]}
                        margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                        barSize={25}
                        >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                        <Bar dataKey="dti" fill={backEndStatus.color} background={{ fill: '#eee' }} radius={[4, 4, 4, 4]} />
                        {/* Reference Lines */}
                        {backEndThresholds.map(t => (
                            <ReferenceLine key={`ref-back-${t.value}`} x={t.value} stroke={t.color} strokeDasharray="3 3">
                            <RechartsLabel value={`${t.label} (${t.value}%)`} position="insideTopRight" fill={t.color} fontSize={9} dy={-5} />
                            </ReferenceLine>
                        ))}
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Front-end DTI Card */}
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Front-End DTI (Housing)
                         <TooltipProvider>
                            <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                            <TooltipContent><p>Percentage of income going towards housing costs (Mortgage/Rent).</p></TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </CardTitle>
                     <CardDescription>Ratio: <span className="font-bold text-lg">{frontEndDti.toFixed(1)}%</span> | Status: <span className="font-medium" style={{ color: frontEndStatus.color }}>{frontEndStatus.label}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        layout="vertical"
                        data={[{ name: 'Front-End', dti: frontEndDti }]}
                        margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                        barSize={25}
                        >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                        <Bar dataKey="dti" fill={frontEndStatus.color} background={{ fill: '#eee' }} radius={[4, 4, 4, 4]} />
                        {/* Reference Lines */}
                        {frontEndThresholds.map(t => (
                            <ReferenceLine key={`ref-front-${t.value}`} x={t.value} stroke={t.color} strokeDasharray="3 3">
                            <RechartsLabel value={`${t.label} (${t.value}%)`} position="insideTopRight" fill={t.color} fontSize={9} dy={-5} />
                            </ReferenceLine>
                        ))}
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4 text-center">
        <p className="mb-1">Lenders generally prefer a back-end DTI of <strong>43% or less</strong> and a front-end DTI of <strong>28% or less</strong> for mortgage approval.</p>
        <p>Lower ratios indicate better financial health and borrowing capacity.</p>
      </CardFooter>
    </Card>
  );
};

// Input styling classes (can be moved to global CSS)
const inputPrefixSuffixBase = "flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border";
const inputPrefixStyle = `${inputPrefixSuffixBase} border-r-0 rounded-l-md h-10`; // Match input height
const inputSuffixStyle = `${inputPrefixSuffixBase} border-l-0 rounded-r-md h-10`; // Match input height
const inputFieldStyle = "flex-1 min-w-0 rounded-none h-10"; // Match input height

// Add these styles to your global CSS or component-specific CSS:
/*
.input-prefix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-r-0 rounded-l-md h-10; }
.input-suffix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-l-0 rounded-r-md h-10; }
.input-field { @apply flex-1 min-w-0 rounded-none h-10; }
*/

export default DtiCalculator;
