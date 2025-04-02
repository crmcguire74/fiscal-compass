
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock } from 'lucide-react';

const TimeCalculator = () => {
  // Time difference calculator
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [timeDifference, setTimeDifference] = useState<string>('');
  
  // Date calculator
  const [baseDate, setBaseDate] = useState<string>('');
  const [operation, setOperation] = useState<string>('add');
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<string>('days');
  const [resultDate, setResultDate] = useState<string>('');
  
  // Calculate time difference
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setTimeDifference('Invalid date');
        return;
      }
      
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeDifference(`${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes`);
    }
  }, [startDate, endDate]);
  
  // Calculate result date
  useEffect(() => {
    if (baseDate && amount) {
      const date = new Date(baseDate);
      
      if (isNaN(date.getTime())) {
        setResultDate('Invalid date');
        return;
      }
      
      const multiplier = operation === 'add' ? 1 : -1;
      
      switch (unit) {
        case 'days':
          date.setDate(date.getDate() + (amount * multiplier));
          break;
        case 'weeks':
          date.setDate(date.getDate() + (amount * 7 * multiplier));
          break;
        case 'months':
          date.setMonth(date.getMonth() + (amount * multiplier));
          break;
        case 'years':
          date.setFullYear(date.getFullYear() + (amount * multiplier));
          break;
        case 'hours':
          date.setHours(date.getHours() + (amount * multiplier));
          break;
        case 'minutes':
          date.setMinutes(date.getMinutes() + (amount * multiplier));
          break;
        default:
          break;
      }
      
      setResultDate(date.toLocaleString());
    }
  }, [baseDate, operation, amount, unit]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Calculator
        </CardTitle>
        <CardDescription>
          Calculate time differences and add/subtract time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="difference" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="difference">Time Difference</TabsTrigger>
            <TabsTrigger value="calculator">Date Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="difference" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <Label>Difference</Label>
              <div className="text-xl font-medium mt-1">
                {timeDifference || 'Enter both dates to calculate'}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseDate">Base Date & Time</Label>
              <Input
                id="baseDate"
                type="datetime-local"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <Select
                  value={operation}
                  onValueChange={setOperation}
                >
                  <SelectTrigger id="operation">
                    <SelectValue placeholder="Operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="subtract">Subtract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={unit}
                  onValueChange={setUnit}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <Label>Result</Label>
              <div className="text-xl font-medium mt-1">
                {resultDate || 'Enter date and values to calculate'}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeCalculator;
