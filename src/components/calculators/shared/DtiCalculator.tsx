
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label as RechartsLabel } from 'recharts'; // Added Recharts components
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';

const CALCULATOR_ID = 'dti-calculator';

const DtiCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [debts, setDebts] = useState<Array<{ name: string; payment: number }>>([
    { name: 'Mortgage/Rent', payment: 1500 },
    { name: 'Car Loan', payment: 350 },
    { name: 'Student Loans', payment: 250 },
    { name: 'Credit Cards', payment: 200 },
    { name: 'Other Debt', payment: 100 }
  ]);
  const [dtiRatio, setDtiRatio] = useState<number>(0);
  const [frontEndDti, setFrontEndDti] = useState<number>(0);

  useEffect(() => {
    // Load saved data if available
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setMonthlyIncome(savedData.monthlyIncome || 5000);
      setDebts(savedData.debts || []);
    }
  }, []);

  useEffect(() => {
    calculateDti();
  }, [monthlyIncome, debts]);

  const calculateDti = () => {
    if (monthlyIncome <= 0) return;

    const totalDebtPayments = debts.reduce((sum, debt) => sum + (debt.payment || 0), 0);
    const housingDebt = debts.find(d => d.name === 'Mortgage/Rent')?.payment || 0;
    
    // Calculate back-end DTI (all debts)
    const calculatedDti = (totalDebtPayments / monthlyIncome) * 100;
    setDtiRatio(calculatedDti);
    
    // Calculate front-end DTI (housing only)
    const calculatedFrontEndDti = (housingDebt / monthlyIncome) * 100;
    setFrontEndDti(calculatedFrontEndDti);
    
    // Save calculation to local storage
    saveCalculatorData(CALCULATOR_ID, {
      monthlyIncome,
      debts,
      dtiRatio: calculatedDti,
      frontEndDti: calculatedFrontEndDti,
      lastCalculated: new Date().toISOString()
    });
  };

  const handleDebtChange = (index: number, value: number) => {
    const updatedDebts = [...debts];
    updatedDebts[index].payment = value;
    setDebts(updatedDebts);
  };

  const handleAddDebt = () => {
    setDebts([...debts, { name: `Other Debt ${debts.length + 1}`, payment: 0 }]);
  };

  const handleRemoveDebt = (index: number) => {
    if (debts.length <= 1) {
      toast({
        title: "Cannot Remove All Debts",
        description: "You need at least one debt entry for the calculation.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDebts = [...debts];
    updatedDebts.splice(index, 1);
    setDebts(updatedDebts);
  };

  const handleDebtNameChange = (index: number, name: string) => {
    const updatedDebts = [...debts];
    updatedDebts[index].name = name;
    setDebts(updatedDebts);
  };

  const getDtiStatus = (ratio: number) => {
    if (ratio < 36) return { label: 'Healthy', color: 'bg-green-500' };
    if (ratio < 43) return { label: 'Acceptable', color: 'bg-yellow-500' };
    if (ratio < 50) return { label: 'High', color: 'bg-orange-500' };
    return { label: 'Very High', color: 'bg-red-500' };
  };

  const backEndStatus = getDtiStatus(dtiRatio);
  const frontEndStatus = getDtiStatus(frontEndDti);

  // Data for the charts
  const dtiChartData = [
    { name: 'Back-End DTI', value: dtiRatio },
    { name: 'Front-End DTI', value: frontEndDti },
  ];

  // Threshold definitions with labels
  const backEndThresholds = [
    { value: 36, label: 'Good', color: '#22c55e' }, // Green
    { value: 43, label: 'Fair', color: '#facc15' }, // Yellow
    { value: 50, label: 'High', color: '#f97316' }, // Orange
  ];
  const frontEndThresholds = [
    { value: 28, label: 'Good', color: '#22c55e' }, // Green
    // Add more if needed, e.g., { value: 36, label: 'High', color: '#f97316' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Debt-to-Income (DTI) Ratio Calculator</CardTitle>
        <CardDescription>
          Calculate your debt-to-income ratio, an important factor that lenders use to evaluate your financial health.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Income Input */}
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (before taxes)</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="monthlyIncome"
              type="number"
              min="0"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="flex-1"
            />
            <div className="text-sm text-muted-foreground w-20">
              {formatCurrency(monthlyIncome)}
            </div>
          </div>
        </div>

        {/* Debts Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Monthly Debt Payments</h3>
            <Button onClick={handleAddDebt} variant="outline" size="sm">Add Debt</Button>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {debts.map((debt, index) => (
              <div key={index} className="space-y-2 border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <Input
                    value={debt.name}
                    onChange={(e) => handleDebtNameChange(index, e.target.value)}
                    className="flex-1 mr-2"
                    placeholder="Debt name"
                  />
                  <Button 
                    onClick={() => handleRemoveDebt(index)} 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    min="0"
                    value={debt.payment}
                    onChange={(e) => handleDebtChange(index, Number(e.target.value))}
                    className="flex-1"
                    placeholder="Monthly payment"
                  />
                  <div className="text-sm text-muted-foreground w-20">
                    {formatCurrency(debt.payment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Your DTI Results</h3>
          
          {/* Back-end DTI */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Back-End DTI (All Debts): <span className="font-bold">{dtiRatio.toFixed(1)}%</span></Label>
            </div>
            <div className="h-40"> {/* Increased height for chart */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={[{ name: 'Back-End', dti: dtiRatio }]} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Bar dataKey="dti" fill={backEndStatus.color.replace('bg-', '#')} background={{ fill: '#eee' }} radius={[4, 4, 4, 4]} />
                  {/* Reference Lines for Thresholds */}
                  {backEndThresholds.map(t => (
                    <ReferenceLine key={`ref-back-${t.value}`} x={t.value} stroke={t.color} strokeDasharray="3 3">
                       <RechartsLabel value={`${t.label} (${t.value}%)`} position="insideTopRight" fill={t.color} fontSize={10} />
                    </ReferenceLine>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
             <div className="text-sm mt-1">
              Status: <span className="font-medium">{backEndStatus.label}</span>
            </div>
          </div>
          
          {/* Front-end DTI */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Front-End DTI (Housing Only): <span className="font-bold">{frontEndDti.toFixed(1)}%</span></Label>
            </div>
            <div className="h-40"> {/* Increased height for chart */}
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart 
                   layout="vertical" 
                   data={[{ name: 'Front-End', dti: frontEndDti }]} 
                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                   barSize={20}
                 >
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                   <XAxis type="number" domain={[0, 100]} unit="%" />
                   <YAxis type="category" dataKey="name" hide />
                   <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                   <Bar dataKey="dti" fill={frontEndStatus.color.replace('bg-', '#')} background={{ fill: '#eee' }} radius={[4, 4, 4, 4]} />
                   {/* Reference Lines for Thresholds */}
                   {frontEndThresholds.map(t => (
                     <ReferenceLine key={`ref-front-${t.value}`} x={t.value} stroke={t.color} strokeDasharray="3 3">
                        <RechartsLabel value={`${t.label} (${t.value}%)`} position="insideTopRight" fill={t.color} fontSize={10} />
                     </ReferenceLine>
                   ))}
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="text-sm mt-1">
              Status: <span className="font-medium">{frontEndStatus.label}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4">
        <p className="mb-2">
          <strong>Back-End DTI:</strong> The percentage of your gross monthly income that goes toward paying all your debts.
        </p>
        <p className="mb-2">
          <strong>Front-End DTI:</strong> The percentage of your gross monthly income that goes toward housing expenses only.
        </p>
        <p>Most lenders prefer a back-end DTI of 43% or less and a front-end DTI of 28% or less for mortgage approval.</p>
      </CardFooter>
    </Card>
  );
};

export default DtiCalculator;
