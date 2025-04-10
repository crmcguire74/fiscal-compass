import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/calculatorUtils"; // Corrected import path

const FreelanceRateCalculator: React.FC = () => {
  const [desiredIncome, setDesiredIncome] = useState<number | string>("");
  const [businessExpenses, setBusinessExpenses] = useState<number | string>("");
  const [selfEmploymentTaxRate, setSelfEmploymentTaxRate] = useState<number | string>(15.3); // Default SE tax rate
  const [incomeTaxRate, setIncomeTaxRate] = useState<number | string>("");
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number | string>(30); // Default billable hours
  const [weeksWorkedPerYear, setWeeksWorkedPerYear] = useState<number | string>(48); // Default weeks (allowing for vacation/sick time)
  const [profitMargin, setProfitMargin] = useState<number | string>(20); // Default profit margin

  const [calculatedRate, setCalculatedRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateRate = () => {
    setError(null);
    setCalculatedRate(null);

    const income = Number(desiredIncome);
    const expenses = Number(businessExpenses);
    const seTax = Number(selfEmploymentTaxRate) / 100;
    const incTax = Number(incomeTaxRate) / 100;
    const hoursWeek = Number(billableHoursPerWeek);
    const weeksYear = Number(weeksWorkedPerYear);
    const profit = Number(profitMargin) / 100;

    if (
      isNaN(income) || income <= 0 ||
      isNaN(expenses) || expenses < 0 ||
      isNaN(seTax) || seTax < 0 || seTax >= 1 ||
      isNaN(incTax) || incTax < 0 || incTax >= 1 ||
      isNaN(hoursWeek) || hoursWeek <= 0 ||
      isNaN(weeksYear) || weeksYear <= 0 ||
      isNaN(profit) || profit < 0
    ) {
      setError("Please enter valid positive numbers for all fields. Tax and profit rates must be between 0 and 100.");
      return;
    }

    if (hoursWeek * weeksYear === 0) {
        setError("Total billable hours cannot be zero.");
        return;
    }

    try {
        // 1. Calculate Gross Annual Income needed (adjusting for income tax)
        const grossAnnualIncomeNeeded = income / (1 - incTax);

        // 2. Calculate Total Annual Costs (Income + Expenses)
        const totalAnnualCosts = grossAnnualIncomeNeeded + expenses;

        // 3. Calculate Income Before Tax (adjusting for self-employment tax)
        // Note: This is a simplification. SE tax is complex (deduction of 1/2 SE tax, etc.).
        // A more accurate calculation might be needed for precise tax planning.
        const incomeBeforeTax = totalAnnualCosts / (1 - seTax);

        // 4. Calculate Total Billable Hours per Year
        const totalBillableHours = hoursWeek * weeksYear;

        // 5. Calculate Base Hourly Rate (before profit)
        const baseHourlyRate = incomeBeforeTax / totalBillableHours;

        // 6. Calculate Final Hourly Rate (including profit margin)
        const finalHourlyRate = baseHourlyRate * (1 + profit);

        setCalculatedRate(finalHourlyRate);

    } catch (e) {
        console.error("Calculation error:", e);
        setError("An error occurred during calculation. Please check your inputs.");
    }
  };

  // Recalculate whenever an input changes
  useEffect(() => {
    // Optional: Recalculate automatically on input change
    // if (desiredIncome && businessExpenses && selfEmploymentTaxRate && incomeTaxRate && billableHoursPerWeek && weeksWorkedPerYear && profitMargin) {
    //   calculateRate();
    // } else {
    //   setCalculatedRate(null); // Clear result if inputs are incomplete
    // }
  }, [desiredIncome, businessExpenses, selfEmploymentTaxRate, incomeTaxRate, billableHoursPerWeek, weeksWorkedPerYear, profitMargin]);


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Freelance Rate Calculator</CardTitle>
        <CardDescription>
          Determine a competitive and profitable hourly rate for your freelance services based on your income goals, expenses, and desired profit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="desiredIncome">Desired Annual Income (After Tax)</Label>
              <Input
                id="desiredIncome"
                type="number"
                placeholder="e.g., 60000"
                value={desiredIncome}
                onChange={(e) => setDesiredIncome(e.target.value)}
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Your target take-home pay for the year.</p>
            </div>
            <div>
              <Label htmlFor="businessExpenses">Estimated Annual Business Expenses</Label>
              <Input
                id="businessExpenses"
                type="number"
                placeholder="e.g., 10000"
                value={businessExpenses}
                onChange={(e) => setBusinessExpenses(e.target.value)}
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Software, rent, supplies, insurance, etc.</p>
            </div>
             <div>
              <Label htmlFor="incomeTaxRate">Estimated Income Tax Rate (%)</Label>
              <Input
                id="incomeTaxRate"
                type="number"
                placeholder="e.g., 25"
                value={incomeTaxRate}
                onChange={(e) => setIncomeTaxRate(e.target.value)}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground mt-1">Your combined federal, state, and local income tax rate.</p>
            </div>
            <div>
              <Label htmlFor="selfEmploymentTaxRate">Self-Employment Tax Rate (%)</Label>
              <Input
                id="selfEmploymentTaxRate"
                type="number"
                placeholder="e.g., 15.3"
                value={selfEmploymentTaxRate}
                onChange={(e) => setSelfEmploymentTaxRate(e.target.value)}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground mt-1">Typically 15.3% for Social Security & Medicare.</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="billableHoursPerWeek">Billable Hours per Week</Label>
              <Input
                id="billableHoursPerWeek"
                type="number"
                placeholder="e.g., 30"
                value={billableHoursPerWeek}
                onChange={(e) => setBillableHoursPerWeek(e.target.value)}
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Average hours you expect to bill clients weekly.</p>
            </div>
            <div>
              <Label htmlFor="weeksWorkedPerYear">Weeks Worked per Year</Label>
              <Input
                id="weeksWorkedPerYear"
                type="number"
                placeholder="e.g., 48"
                value={weeksWorkedPerYear}
                onChange={(e) => setWeeksWorkedPerYear(e.target.value)}
                min="0"
                max="52"
              />
              <p className="text-xs text-muted-foreground mt-1">Total weeks you plan to work (allowing for time off).</p>
            </div>
            <div>
              <Label htmlFor="profitMargin">Desired Profit Margin (%)</Label>
              <Input
                id="profitMargin"
                type="number"
                placeholder="e.g., 20"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Percentage added for business growth, savings, etc.</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Calculation Button */}
        <div className="flex justify-center pt-4">
            <Button onClick={calculateRate} size="lg">
                Calculate Hourly Rate
            </Button>
        </div>

        {/* Results Section */}
        {calculatedRate !== null && (
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-center">Calculation Results</h3>
            <Alert className="bg-green-50 border-green-200 text-green-900">
              <TrendingUp className="h-5 w-5 text-green-700" />
              <AlertTitle className="text-lg font-bold">Recommended Hourly Rate</AlertTitle>
              <AlertDescription className="text-2xl font-bold mt-2">
                {formatCurrency(calculatedRate)}
              </AlertDescription>
              <p className="text-sm mt-2 text-green-800">
                This rate aims to cover your desired income, expenses, taxes, and profit margin based on your estimated billable hours.
              </p>
            </Alert>
             <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-900">
                <Info className="h-4 w-4 text-blue-700" />
                <AlertTitle>Important Considerations</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>This is an estimate. Market rates, your experience, and project complexity also influence pricing.</li>
                        <li>Self-employment tax calculations are simplified. Consult a tax professional for precise figures.</li>
                        <li>Ensure your billable hours estimate is realistic, accounting for non-billable tasks (admin, marketing).</li>
                        <li>Regularly review and adjust your rate as your business evolves.</li>
                    </ul>
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
        Disclaimer: This calculator provides an estimate for informational purposes. Consult with financial and tax professionals for personalized advice.
      </CardFooter>
    </Card>
  );
};

export default FreelanceRateCalculator;
