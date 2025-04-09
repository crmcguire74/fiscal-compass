import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/calculatorUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const ValueTimeCalculator = () => {
  const [calculationMode, setCalculationMode] = useState<"salary" | "rate">(
    "salary"
  );
  const [annualSalary, setAnnualSalary] = useState<number>(60000);
  const [hoursPerWeekSalary, setHoursPerWeekSalary] = useState<number>(40);
  const [weeksPerYearSalary, setWeeksPerYearSalary] = useState<number>(50); // Assuming 2 weeks vacation
  const [desiredHourlyRate, setDesiredHourlyRate] = useState<number>(30);

  const [results, setResults] = useState({
    valuePerHour: 0,
    valuePerMinute: 0,
    valuePerDay: 0, // Assuming 8-hour day
    valuePerWeek: 0,
    valuePerMonth: 0, // Approximate
  });

  useEffect(() => {
    calculateValue();
  }, [
    calculationMode,
    annualSalary,
    hoursPerWeekSalary,
    weeksPerYearSalary,
    desiredHourlyRate,
  ]);

  const calculateValue = () => {
    let hourlyValue = 0;

    if (calculationMode === "salary") {
      if (hoursPerWeekSalary > 0 && weeksPerYearSalary > 0) {
        hourlyValue = annualSalary / (weeksPerYearSalary * hoursPerWeekSalary);
      }
    } else {
      hourlyValue = desiredHourlyRate;
    }

    const perMinute = hourlyValue / 60;
    const perDay = hourlyValue * 8; // Assuming 8-hour workday
    const perWeek = hourlyValue * hoursPerWeekSalary; // Use salary hours for consistency or add another input?
    const perMonth = (hourlyValue * hoursPerWeekSalary * 52) / 12; // Approximate monthly value

    setResults({
      valuePerHour: hourlyValue,
      valuePerMinute: perMinute,
      valuePerDay: perDay,
      valuePerWeek: perWeek,
      valuePerMonth: perMonth,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>{/* Title will be in the page component */}</CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Calculation Method</Label>
          <RadioGroup
            value={calculationMode}
            onValueChange={(value: "salary" | "rate") =>
              setCalculationMode(value)
            }
            className="mt-2 flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="salary" id="mode-salary" />
              <Label htmlFor="mode-salary">Based on Annual Salary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rate" id="mode-rate" />
              <Label htmlFor="mode-rate">Based on Desired Hourly Rate</Label>
            </div>
          </RadioGroup>
        </div>

        {calculationMode === "salary" && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/30">
            <h3 className="font-medium">Salary Input</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="annualSalary">Annual Salary</Label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-2">$</span>
                  <Input
                    id="annualSalary"
                    type="number"
                    value={annualSalary}
                    onValueChange={(val) =>
                      setAnnualSalary(typeof val === "string" ? 0 : Number(val))
                    }
                    onClear={() => setAnnualSalary(0)}
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hoursPerWeekSalary">Hours / Week</Label>
                <Input
                  id="hoursPerWeekSalary"
                  type="number"
                  value={hoursPerWeekSalary}
                  onValueChange={(val) =>
                    setHoursPerWeekSalary(
                      typeof val === "string" ? 0 : Number(val)
                    )
                  }
                  onClear={() => setHoursPerWeekSalary(0)}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="weeksPerYearSalary">Weeks / Year</Label>
                <Input
                  id="weeksPerYearSalary"
                  type="number"
                  value={weeksPerYearSalary}
                  onValueChange={(val) =>
                    setWeeksPerYearSalary(
                      typeof val === "string" ? 0 : Number(val)
                    )
                  }
                  onClear={() => setWeeksPerYearSalary(0)}
                  min="1"
                  max="52"
                />
              </div>
            </div>
          </div>
        )}

        {calculationMode === "rate" && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/30">
            <h3 className="font-medium">Hourly Rate Input</h3>
            <div>
              <Label htmlFor="desiredHourlyRate">Desired Hourly Rate</Label>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 mr-2">$</span>
                <Input
                  id="desiredHourlyRate"
                  type="number"
                  value={desiredHourlyRate}
                  onValueChange={(val) =>
                    setDesiredHourlyRate(
                      typeof val === "string" ? 0 : Number(val)
                    )
                  }
                  onClear={() => setDesiredHourlyRate(0)}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        )}

        {results.valuePerHour > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Your Time's Value
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <ResultCard label="Per Minute" value={results.valuePerMinute} />
              <ResultCard label="Per Hour" value={results.valuePerHour} />
              <ResultCard label="Per Day (8h)" value={results.valuePerDay} />
              <ResultCard label="Per Week" value={results.valuePerWeek} />
              <ResultCard label="Per Month" value={results.valuePerMonth} />
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Monthly value is approximate (Annual Value / 12). Weekly value
              based on {hoursPerWeekSalary} hours/week.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ResultCard = (
  { label, value } // Removed precision parameter
) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center border">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="text-xl font-bold text-primary">
      {formatCurrency(value)} {/* Removed precision argument */}
    </p>
  </div>
);

export default ValueTimeCalculator;
