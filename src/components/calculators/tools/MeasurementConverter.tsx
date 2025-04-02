import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MEASUREMENT_CATEGORIES, MEASUREMENT_UNITS } from '@/lib/constants';
import { convertMeasurement } from '@/utils/conversionUtils';

const MeasurementConverter = () => {
  const [category, setCategory] = useState<string>('length');
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [result, setResult] = useState<number>(0);

  // Available units for the current category
  const availableUnits = MEASUREMENT_UNITS[category as keyof typeof MEASUREMENT_UNITS];

  // Update default units when category changes
  useEffect(() => {
    if (availableUnits?.length > 0) {
      setFromUnit(availableUnits[0].id);
      setToUnit(availableUnits.length > 1 ? availableUnits[1].id : availableUnits[0].id);
    }
  }, [category]);

  // Calculate conversion on input change
  useEffect(() => {
    if (value) {
      const convertedValue = convertMeasurement(value, fromUnit, toUnit, category);
      setResult(convertedValue);
    }
  }, [value, fromUnit, toUnit, category]);

  // Swap units
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Format number with appropriate precision
  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    
    // For very small or very large numbers, use scientific notation
    if (Math.abs(num) < 0.001 || Math.abs(num) >= 1000000) {
      return num.toExponential(4);
    }
    
    // Otherwise, use fixed precision based on the number size
    if (Math.abs(num) < 0.1) return num.toFixed(5);
    if (Math.abs(num) < 1) return num.toFixed(4);
    if (Math.abs(num) < 10) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toFixed(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Measurement Converter</CardTitle>
        <CardDescription>
          Convert between different units of measurement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category selection tabs */}
          <Tabs defaultValue={category} onValueChange={setCategory} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
              {MEASUREMENT_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Value input */}
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              placeholder="Enter value"
              className="text-lg"
            />
          </div>

          {/* Unit selection */}
          <div className="grid grid-cols-9 gap-2 items-center">
            <div className="col-span-4 space-y-2">
              <Label htmlFor="fromUnit">From</Label>
              <Select
                value={fromUnit}
                onValueChange={setFromUnit}
              >
                <SelectTrigger id="fromUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 flex justify-center mt-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSwapUnits}
                aria-label="Swap units"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="col-span-4 space-y-2">
              <Label htmlFor="toUnit">To</Label>
              <Select
                value={toUnit}
                onValueChange={setToUnit}
              >
                <SelectTrigger id="toUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result display */}
          <div className="bg-muted p-6 rounded-lg text-center space-y-2">
            <p className="text-sm text-muted-foreground">Converted Result</p>
            <div className="flex items-center justify-center">
              <p className="text-xl md:text-2xl font-semibold m-0">
                {formatNumber(value)} <span className="text-muted-foreground">{fromUnit}</span>
              </p>
              <ArrowRightLeft className="mx-2 h-4 w-4 text-muted-foreground" />
              <p className="text-xl md:text-2xl font-semibold m-0">
                {formatNumber(result)} <span className="text-muted-foreground">{toUnit}</span>
              </p>
            </div>
          </div>

          {/* Formula display - only for certain categories like temperature */}
          {category === 'temperature' && (
            <div className="text-sm text-center text-muted-foreground">
              <p>Formula used:</p>
              {fromUnit === 'c' && toUnit === 'f' && (
                <p>°F = (°C × 9/5) + 32</p>
              )}
              {fromUnit === 'f' && toUnit === 'c' && (
                <p>°C = (°F - 32) × 5/9</p>
              )}
              {fromUnit === 'c' && toUnit === 'k' && (
                <p>K = °C + 273.15</p>
              )}
              {fromUnit === 'k' && toUnit === 'c' && (
                <p>°C = K - 273.15</p>
              )}
              {fromUnit === 'f' && toUnit === 'k' && (
                <p>K = (°F + 459.67) × 5/9</p>
              )}
              {fromUnit === 'k' && toUnit === 'f' && (
                <p>°F = K × 9/5 - 459.67</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeasurementConverter;
