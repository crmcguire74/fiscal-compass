import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateTakeHomePay } from '@/utils/taxUtils';
import { formatCurrency } from '@/utils/calculatorUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { STATE_TAX_RATES } from '@/utils/taxUtils';
const TakeHomePayCalculator = () => {
  const [income, setIncome] = useState<number>(100000);
  const [state, setState] = useState<string>("California");
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [retirement401kPercent, setRetirement401kPercent] = useState<number>(0);
  const [retirement401kAmount, setRetirement401kAmount] = useState<number>(0);
  const [use401kPercent, setUse401kPercent] = useState<boolean>(true);
  const [otherTaxDeferred, setOtherTaxDeferred] = useState<number>(0);
  const [useStandardDeduction, setUseStandardDeduction] = useState<boolean>(true);
  const [itemizedDeductions, setItemizedDeductions] = useState<number>(0);
  const [payPeriods, setPayPeriods] = useState<number>(24);
  const [isBonus, setIsBonus] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("annual");

  // Generate state options
  const stateOptions = Object.keys(STATE_TAX_RATES).sort();

  // Calculate take-home pay
  useEffect(() => {
    const calculationResults = calculateTakeHomePay(income, state, filingStatus, use401kPercent ? retirement401kPercent : 0, use401kPercent ? 0 : retirement401kAmount, otherTaxDeferred, useStandardDeduction, itemizedDeductions, payPeriods, isBonus);
    setResults(calculationResults);
  }, [income, state, filingStatus, retirement401kPercent, retirement401kAmount, use401kPercent, otherTaxDeferred, useStandardDeduction, itemizedDeductions, payPeriods, isBonus]);

  // Format data for pie chart
  const getPieChartData = () => {
    if (!results) return [];
    return [{
      name: "Federal Tax",
      value: results.federalTax,
      color: "#FF8042"
    }, {
      name: "State Tax",
      value: results.stateTax,
      color: "#FFBB28"
    }, {
      name: "Social Security",
      value: results.socialSecurity,
      color: "#FF4560"
    }, {
      name: "Medicare",
      value: results.medicare,
      color: "#775DD0"
    }, {
      name: "401(k)",
      value: results.retirement401k,
      color: "#00E396"
    }, {
      name: "Other Deferrals",
      value: results.otherTaxDeferred,
      color: "#008FFB"
    }, {
      name: "Take-Home Pay",
      value: results.takeHomePay,
      color: "#4CAF50"
    }];
  };
  const pieChartData = getPieChartData();

  // Format for the custom tooltip
  const CustomTooltip = ({
    active,
    payload
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)} ({(payload[0].value / income * 100).toFixed(1)}%)</p>
        </div>;
    }
    return null;
  };
  return <Card className="w-full">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="annual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="annual">Annual</TabsTrigger>
            <TabsTrigger value="paycheck">Per Paycheck</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annual" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="income">Annual {isBonus ? "Bonus" : "Income"}</Label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-2">$</span>
                  <Input id="income" type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select value={filingStatus} onValueChange={(value: 'single' | 'married') => setFilingStatus(value)}>
                  <SelectTrigger id="filingStatus">
                    <SelectValue placeholder="Select filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="payPeriods">Pay Periods Per Year</Label>
                <Select value={payPeriods.toString()} onValueChange={value => setPayPeriods(Number(value))}>
                  <SelectTrigger id="payPeriods">
                    <SelectValue placeholder="Select pay frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="52">Weekly (52)</SelectItem>
                    <SelectItem value="26">Bi-Weekly (26)</SelectItem>
                    <SelectItem value="24">Semi-Monthly (24)</SelectItem>
                    <SelectItem value="12">Monthly (12)</SelectItem>
                    <SelectItem value="1">Annual (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="isBonus" checked={isBonus} onCheckedChange={setIsBonus} />
              <Label htmlFor="isBonus">Calculate as bonus income (applies supplemental tax rate)</Label>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Retirement & Deductions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="401k">401(k) Contribution</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="401kToggle">% Percentage</Label>
                      <Switch id="401kToggle" checked={!use401kPercent} onCheckedChange={checked => setUse401kPercent(!checked)} />
                      <Label htmlFor="401kToggle">$ Amount</Label>
                    </div>
                  </div>
                  
                  {use401kPercent ? <div className="flex items-center gap-4">
                      <Slider id="401k" value={[retirement401kPercent]} min={0} max={20} step={0.5} onValueChange={value => setRetirement401kPercent(value[0])} className="flex-1" />
                      <span className="w-16 text-right">{retirement401kPercent}%</span>
                    </div> : <div className="flex items-center mt-1">
                      <span className="text-gray-500 mr-2">$</span>
                      <Input id="401kAmount" type="number" value={retirement401kAmount} onChange={e => setRetirement401kAmount(Number(e.target.value))} />
                    </div>}
                </div>
                
                <div>
                  <Label htmlFor="otherDeferrals">Other Pre-Tax Deductions (HSA, FSA, etc.)</Label>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-500 mr-2">$</span>
                    <Input id="otherDeferrals" type="number" value={otherTaxDeferred} onChange={e => setOtherTaxDeferred(Number(e.target.value))} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="standardDeduction" checked={useStandardDeduction} onCheckedChange={setUseStandardDeduction} />
                  <Label htmlFor="standardDeduction">
                    Use standard deduction ({formatCurrency(filingStatus === 'single' ? 13850 : 27700)})
                  </Label>
                </div>
                
                {!useStandardDeduction && <div>
                    <Label htmlFor="itemizedDeductions">Itemized Deductions</Label>
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 mr-2">$</span>
                      <Input id="itemizedDeductions" type="number" value={itemizedDeductions} onChange={e => setItemizedDeductions(Number(e.target.value))} />
                    </div>
                  </div>}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paycheck" className="space-y-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">
                To calculate per-paycheck amounts, switch to Annual view and set your pay frequency
              </div>
              <button onClick={() => setActiveTab("annual")} className="text-blue-600 hover:text-blue-800 font-medium">
                Switch to Annual View
              </button>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Take-Home Pay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(results.takeHomePay)}</div>
                  <div className="text-sm text-muted-foreground">Annually</div>
                  
                  <div className="mt-4">
                    <div className="text-xl font-bold">{formatCurrency(results.takeHomePayPerPeriod)}</div>
                    <div className="text-sm text-muted-foreground">
                      Per {payPeriods === 52 ? 'Week' : payPeriods === 26 ? 'Two Weeks' : payPeriods === 24 ? 'Semi-Month' : payPeriods === 12 ? 'Month' : 'Year'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Tax</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatCurrency(results.federalTax + results.stateTax + results.socialSecurity + results.medicare)}
                  </div>
                  <div className="text-sm text-muted-foreground">Annually</div>
                  
                  <div className="mt-4">
                    <div className="text-lg font-semibold">Effective Rate: {results.effectiveTaxRate.toFixed(2)}%</div>
                    <div className="text-lg font-semibold">Marginal Rate: {results.marginalTaxRate.toFixed(2)}%</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Retirement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(results.retirement401k + results.otherTaxDeferred)}
                  </div>
                  <div className="text-sm text-muted-foreground">Annually</div>
                  
                  <div className="mt-4">
                    <div className="text-lg font-semibold">401(k): {formatCurrency(results.retirement401k)}</div>
                    <div className="text-lg font-semibold">Other: {formatCurrency(results.otherTaxDeferred)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Income Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({
                    name,
                    percent
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Tax Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Item</span>
                    <span className="font-semibold">Amount</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Gross Income</span>
                    <span>{formatCurrency(results.annualIncome)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Federal Income Tax</span>
                    <span className="text-orange-600">{formatCurrency(results.federalTax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>State Income Tax</span>
                    <span className="text-orange-600">{formatCurrency(results.stateTax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Social Security</span>
                    <span className="text-orange-600">{formatCurrency(results.socialSecurity)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Medicare</span>
                    <span className="text-orange-600">{formatCurrency(results.medicare)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>401(k) Contribution</span>
                    <span className="text-blue-600">{formatCurrency(results.retirement401k)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Other Tax-Deferred</span>
                    <span className="text-blue-600">{formatCurrency(results.otherTaxDeferred)}</span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Take-Home Pay</span>
                    <span className="text-green-600">{formatCurrency(results.takeHomePay)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <p>
          This calculator provides estimates based on 2023 tax rates and does not account for all possible deductions or credits. 
          For personalized tax advice, consult a qualified tax professional.
        </p>
      </CardFooter>
    </Card>;
};
export default TakeHomePayCalculator;