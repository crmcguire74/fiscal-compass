import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Calculator, 
  CircleDollarSign, 
  TrendingUp, 
  Building2, 
  PiggyBank 
} from 'lucide-react';
import { formatCurrency } from '@/utils/calculatorUtils';
import { calculateMonthlyMortgage } from '@/utils/calculatorUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RentVsBuyCalculator: React.FC = () => {
  // State management for inputs
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [maintenance, setMaintenance] = useState(2400);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [rentInsurance, setRentInsurance] = useState(200);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [yearsToAnalyze, setYearsToAnalyze] = useState(10);

  // Calculations and results state
  const [results, setResults] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    calculateComparison();
  }, [
    homePrice, downPayment, loanTerm, interestRate, propertyTax,
    homeInsurance, maintenance, homeAppreciation, monthlyRent,
    rentIncrease, rentInsurance, investmentReturn, yearsToAnalyze
  ]);

  const calculateComparison = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyMortgage = calculateMonthlyMortgage(loanAmount, interestRate, loanTerm);
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyMaintenance = maintenance / 12;

    const data = [];
    let buyerEquity = downPayment;
    let buyerNetWorth = downPayment;
    let renterSavings = downPayment;
    let currentRent = monthlyRent;
    let houseValue = homePrice;
    let loanBalance = loanAmount;
    let totalBuyerCosts = 0;
    let totalRenterCosts = 0;

    for (let year = 0; year <= yearsToAnalyze; year++) {
      // Calculate annual amounts
      const annualMortgage = monthlyMortgage * 12;
      const annualPropertyTax = propertyTax;
      const annualHomeInsurance = homeInsurance;
      const annualMaintenance = maintenance;
      const annualRent = currentRent * 12;
      const annualRentInsurance = rentInsurance;

      // Update values for the year
      houseValue *= (1 + homeAppreciation / 100);
      const annualPrincipalPaid = calculateAnnualPrincipalPaid(loanBalance, monthlyMortgage, interestRate);
      loanBalance -= annualPrincipalPaid;
      buyerEquity = houseValue - loanBalance;

      // Calculate total costs
      const buyerAnnualCost = annualMortgage + annualPropertyTax + annualHomeInsurance + annualMaintenance;
      const renterAnnualCost = annualRent + annualRentInsurance;

      totalBuyerCosts += buyerAnnualCost;
      totalRenterCosts += renterAnnualCost;

      // Calculate investment returns
      const renterInvestmentReturn = renterSavings * (investmentReturn / 100);
      renterSavings = renterSavings + renterInvestmentReturn + (buyerAnnualCost - renterAnnualCost);
      
      // Update net worth calculations
      buyerNetWorth = buyerEquity;
      
      data.push({
        year,
        houseValue: Math.round(houseValue),
        buyerEquity: Math.round(buyerEquity),
        buyerNetWorth: Math.round(buyerNetWorth),
        renterNetWorth: Math.round(renterSavings),
        buyerCosts: Math.round(totalBuyerCosts),
        renterCosts: Math.round(totalRenterCosts)
      });

      // Update rent for next year
      currentRent *= (1 + rentIncrease / 100);
    }

    setChartData(data);
    setResults({
      monthlyMortgage,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyMaintenance,
      totalBuyerCosts,
      totalRenterCosts,
      finalBuyerNetWorth: buyerNetWorth,
      finalRenterNetWorth: renterSavings,
      finalHouseValue: houseValue,
      finalBuyerEquity: buyerEquity
    });
  };

  const calculateAnnualPrincipalPaid = (balance: number, monthlyPayment: number, rate: number) => {
    const monthlyRate = (rate / 100) / 12;
    let principalPaid = 0;
    let remainingBalance = balance;

    for (let i = 0; i < 12; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      principalPaid += principalPayment;
      remainingBalance -= principalPayment;
    }

    return principalPaid;
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Buying Inputs */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Home className="h-5 w-5" />
            Buying Scenario
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label>Home Price</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Down Payment</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  ({((downPayment / homePrice) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div>
              <Label>Interest Rate (%)</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step={0.125}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>

            <div>
              <Label>Loan Term (Years)</Label>
              <Input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="flex-1"
              />
            </div>

            <div>
              <Label>Annual Property Tax</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Annual Home Insurance</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Annual Maintenance & Repairs</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Home Value Appreciation Rate (%)</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={homeAppreciation}
                  onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                  step={0.1}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Renting Inputs */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Renting Scenario
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label>Monthly Rent</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Annual Rent Increase (%)</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={rentIncrease}
                  onChange={(e) => setRentIncrease(Number(e.target.value))}
                  step={0.1}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>

            <div>
              <Label>Annual Renter's Insurance</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  value={rentInsurance}
                  onChange={(e) => setRentInsurance(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Investment Return Rate (%)</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                  step={0.1}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>

            <div>
              <Label>Years to Analyze</Label>
              <Input
                type="number"
                value={yearsToAnalyze}
                onChange={(e) => setYearsToAnalyze(Number(e.target.value))}
                min={1}
                max={50}
                className="flex-1"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Monthly Cost Comparison */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Monthly Cost Comparison
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Buying Costs</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Mortgage Payment:</span>
                    <span>{formatCurrency(results.monthlyMortgage)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Property Tax:</span>
                    <span>{formatCurrency(results.monthlyPropertyTax)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Home Insurance:</span>
                    <span>{formatCurrency(results.monthlyHomeInsurance)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Maintenance:</span>
                    <span>{formatCurrency(results.monthlyMaintenance)}</span>
                  </li>
                  <li className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Monthly Cost:</span>
                    <span>{formatCurrency(
                      results.monthlyMortgage +
                      results.monthlyPropertyTax +
                      results.monthlyHomeInsurance +
                      results.monthlyMaintenance
                    )}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Renting Costs</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Monthly Rent:</span>
                    <span>{formatCurrency(monthlyRent)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Renter's Insurance:</span>
                    <span>{formatCurrency(rentInsurance / 12)}</span>
                  </li>
                  <li className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Monthly Cost:</span>
                    <span>{formatCurrency(monthlyRent + (rentInsurance / 12))}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Net Worth Comparison */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              {yearsToAnalyze}-Year Net Worth Projection
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Buying Scenario</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Home Value:</span>
                    <span>{formatCurrency(results.finalHouseValue)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Home Equity:</span>
                    <span>{formatCurrency(results.finalBuyerEquity)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Costs:</span>
                    <span>{formatCurrency(results.totalBuyerCosts)}</span>
                  </li>
                  <li className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Worth:</span>
                    <span>{formatCurrency(results.finalBuyerNetWorth)}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Renting Scenario</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Investment Value:</span>
                    <span>{formatCurrency(results.finalRenterNetWorth)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Costs:</span>
                    <span>{formatCurrency(results.totalRenterCosts)}</span>
                  </li>
                  <li className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Worth:</span>
                    <span>{formatCurrency(results.finalRenterNetWorth)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Net Worth Chart */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Net Worth Over Time</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year"
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      label={{ value: 'Net Worth', angle: -90, position: 'insideLeft', offset: 10 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(value) => `Year ${value}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="buyerNetWorth"
                      name="Buyer Net Worth"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="renterNetWorth"
                      name="Renter Net Worth"
                      stroke="#16a34a"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RentVsBuyCalculator;
