
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { calculateFederalIncomeTax, FEDERAL_TAX_BRACKETS_SINGLE_2023, FEDERAL_TAX_BRACKETS_MARRIED_2023 } from '@/utils/taxUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/utils/calculatorUtils';

const TaxBracketVisualization = () => {
  const [income, setIncome] = useState<number>(100000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');

  const brackets = useMemo(() => 
    filingStatus === 'single' ? FEDERAL_TAX_BRACKETS_SINGLE_2023 : FEDERAL_TAX_BRACKETS_MARRIED_2023, 
    [filingStatus]
  );

  const taxData = useMemo(() => {
    const bracketData = [];
    let previousBracketEnd = 0;
    
    for (let i = 0; i < brackets.length; i++) {
      const bracketStart = previousBracketEnd;
      const bracketEnd = brackets[i].upTo;
      const bracketRate = brackets[i].rate * 100;
      
      // Calculate amount of income in this bracket
      const amountInBracket = Math.max(0, Math.min(income, bracketEnd) - bracketStart);
      
      // Calculate tax for this amount
      const taxInBracket = amountInBracket * brackets[i].rate;
      
      if (amountInBracket > 0 || income > bracketStart) {
        bracketData.push({
          name: `${bracketRate}%`,
          incomeInBracket: amountInBracket,
          taxInBracket: taxInBracket,
          bracketStart,
          bracketEnd,
          rate: bracketRate
        });
      }
      
      previousBracketEnd = bracketEnd;
      
      // If we've passed the income amount, no need to continue
      if (income <= bracketEnd) break;
    }
    
    return bracketData;
  }, [brackets, income]);

  const totalTax = calculateFederalIncomeTax(income, filingStatus);
  const effectiveTaxRate = (totalTax / income * 100).toFixed(2);
  
  // Format values for the tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">{label} Tax Bracket</p>
          <p>Income in bracket: {formatCurrency(data.incomeInBracket)}</p>
          <p>Tax in bracket: {formatCurrency(data.taxInBracket)}</p>
          <p>Bracket range: {formatCurrency(data.bracketStart)} - {data.bracketEnd === Infinity ? '∞' : formatCurrency(data.bracketEnd)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Federal Income Tax Bracket Calculator</CardTitle>
        <CardDescription>
          Visualize how your income is taxed across different tax brackets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Annual Income</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[income]}
                  min={0}
                  max={500000}
                  step={1000}
                  onValueChange={(value) => setIncome(value[0])}
                  className="flex-1"
                />
                <span className="text-lg font-semibold w-32 text-right">{formatCurrency(income)}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filing Status</label>
              <Select
                value={filingStatus}
                onValueChange={(value: 'single' | 'married') => setFilingStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Federal Tax</p>
                <p className="text-2xl font-bold">{formatCurrency(totalTax)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
                <p className="text-2xl font-bold">{effectiveTaxRate}%</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">Tax Breakdown by Bracket</p>
            
            <div className="h-60 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taxData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="incomeInBracket" name="Income in Bracket" fill="#8884d8">
                    {taxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 60%)`} />
                    ))}
                  </Bar>
                  <Bar dataKey="taxInBracket" name="Tax Paid" fill="#82ca9d">
                    {taxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${150 + index * 30}, 70%, 50%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">How Federal Tax Brackets Work</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The U.S. uses a progressive tax system, which means different portions of your income are taxed at different rates. 
              Only the income that falls within a specific bracket is taxed at that bracket's rate.
            </p>
            <div className="space-y-1">
              {brackets.map((bracket, index) => {
                const lowerBound = index === 0 ? 0 : brackets[index - 1].upTo;
                return (
                  <p key={index} className="text-sm">
                    <span className="font-medium">{(bracket.rate * 100).toFixed(0)}% bracket:</span> 
                    {' '}{formatCurrency(lowerBound)} - {bracket.upTo === Infinity ? '∞' : formatCurrency(bracket.upTo)}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxBracketVisualization;
