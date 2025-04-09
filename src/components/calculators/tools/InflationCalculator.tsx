import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/calculatorUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InflationCalculator = () => {
  const currentYear = new Date().getFullYear();
  const [amount, setAmount] = useState<number>(100);
  const [fromYear, setFromYear] = useState<number>(2000);
  const [toYear, setToYear] = useState<number>(currentYear);
  const [results, setResults] = useState({
    adjustedAmount: 0,
    percentageChange: 0,
    averageAnnualRate: 0,
  });

  // Historical CPI data (annual averages)
  // Source: U.S. Bureau of Labor Statistics
  const cpiData: { [key: number]: number } = {
    2023: 303.682,
    2022: 292.655,
    2021: 271.696,
    2020: 258.811,
    2019: 255.657,
    2018: 251.107,
    2017: 245.12,
    2016: 240.007,
    2015: 237.017,
    2014: 236.736,
    2013: 232.957,
    2012: 229.594,
    2011: 224.939,
    2010: 218.056,
    2009: 214.537,
    2008: 215.303,
    2007: 207.342,
    2006: 201.6,
    2005: 195.3,
    2004: 188.9,
    2003: 184.0,
    2002: 179.9,
    2001: 177.1,
    2000: 172.2,
    1999: 166.6,
    1998: 163.0,
    1997: 160.5,
    1996: 156.9,
    1995: 152.4,
    1994: 148.2,
    1993: 144.5,
    1992: 140.3,
    1991: 136.2,
    1990: 130.7,
  };

  const years = Object.keys(cpiData)
    .map(Number)
    .sort((a, b) => b - a);

  useEffect(() => {
    if (fromYear && toYear && amount) {
      const fromCPI = cpiData[fromYear];
      const toCPI = cpiData[toYear];

      if (fromCPI && toCPI) {
        const adjustedAmount = (amount * toCPI) / fromCPI;
        const percentageChange = ((toCPI - fromCPI) / fromCPI) * 100;
        const yearDiff = Math.abs(toYear - fromYear);
        const averageAnnualRate =
          (Math.pow(toCPI / fromCPI, 1 / yearDiff) - 1) * 100;

        setResults({
          adjustedAmount,
          percentageChange,
          averageAnnualRate,
        });
      }
    }
  }, [amount, fromYear, toYear]);

  const ResultCard = ({ label, value, isPercentage = false }) => (
    <div className="bg-gray-50 p-4 rounded-lg text-center border">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-primary">
        {isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value)}
      </p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 mr-2">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onValueChange={(val) =>
                  setAmount(typeof val === "string" ? 0 : Number(val))
                }
                onClear={() => setAmount(0)}
                min="0"
                step="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fromYear">From Year</Label>
            <Select
              value={fromYear.toString()}
              onValueChange={(value) => setFromYear(Number(value))}
            >
              <SelectTrigger id="fromYear">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="toYear">To Year</Label>
            <Select
              value={toYear.toString()}
              onValueChange={(value) => setToYear(Number(value))}
            >
              <SelectTrigger id="toYear">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {results.adjustedAmount > 0 && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard
                label={`Value in ${toYear}`}
                value={results.adjustedAmount}
              />
              <ResultCard
                label="Total Change"
                value={results.percentageChange}
                isPercentage={true}
              />
              <ResultCard
                label="Avg. Annual Rate"
                value={results.averageAnnualRate}
                isPercentage={true}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">What This Means:</p>
              <p>
                {formatCurrency(amount)} in {fromYear} would have the same
                purchasing power as {formatCurrency(results.adjustedAmount)} in{" "}
                {toYear}. This represents a total change of{" "}
                {results.percentageChange > 0 ? "+" : ""}
                {results.percentageChange.toFixed(1)}% over{" "}
                {Math.abs(toYear - fromYear)} years (averaging{" "}
                {results.averageAnnualRate.toFixed(1)}% per year).
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          Data source: U.S. Bureau of Labor Statistics Consumer Price Index
          (CPI) for All Urban Consumers (CPI-U), U.S. City Average, All Items.
          Historical data is based on annual averages.
        </div>
      </CardContent>
    </Card>
  );
};

export default InflationCalculator;
