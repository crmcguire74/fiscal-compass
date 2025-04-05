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
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  ShieldPlus,
  Download,
  Save,
  Info,
  Calendar as CalendarIcon,
  PlusCircle,
  XCircle,
} from "lucide-react"; // Added CalendarIcon, PlusCircle, XCircle

const LifeInsuranceNeedsCalculator = () => {
  const [activeTab, setActiveTab] = useState("basic");

  // Basic inputs
  const [annualIncome, setAnnualIncome] = useState(70000);
  const [age, setAge] = useState(35);
  const [yearsOfIncome, setYearsOfIncome] = useState(10);
  const [dependents, setDependents] = useState(2);
  const [existingInsurance, setExistingInsurance] = useState(100000);
  const [existingSavings, setExistingSavings] = useState(50000);

  // Advanced inputs
  const [expenses, setExpenses] = useState({
    finalExpenses: 15000,
    mortgage: 200000,
    otherDebts: 20000,
    educationFund: 80000,
  });

  // Results
  const [needsAnalysis, setNeedsAnalysis] = useState({
    totalNeeds: 0,
    existingCoverage: 0,
    additionalNeeded: 0,
    breakdown: [],
  });

  useEffect(() => {
    calculateInsuranceNeeds();
  }, [
    annualIncome,
    age,
    yearsOfIncome,
    dependents,
    existingInsurance,
    existingSavings,
    expenses,
  ]);

  const handleExpenseChange = (key, value) => {
    setExpenses({
      ...expenses,
      [key]: value,
    });
  };

  const calculateInsuranceNeeds = () => {
    // Income replacement
    const incomeNeeded = annualIncome * yearsOfIncome;

    // Calculate total needs
    const totalNeeds =
      incomeNeeded +
      expenses.finalExpenses +
      expenses.mortgage +
      expenses.otherDebts +
      expenses.educationFund;

    // Calculate existing coverage
    const existingCoverage = existingInsurance + existingSavings;

    // Calculate additional insurance needed
    const additionalNeeded = Math.max(0, totalNeeds - existingCoverage);

    // Prepare breakdown for visualization
    const breakdown = [
      { name: "Income Replacement", value: incomeNeeded },
      { name: "Final Expenses", value: expenses.finalExpenses },
      { name: "Mortgage", value: expenses.mortgage },
      { name: "Other Debts", value: expenses.otherDebts },
      { name: "Education Fund", value: expenses.educationFund },
    ];

    setNeedsAnalysis({
      totalNeeds,
      existingCoverage,
      additionalNeeded,
      breakdown,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Coverage comparison data
  const coverageComparisonData = [
    { name: "Total Needs", value: needsAnalysis.totalNeeds },
    { name: "Existing Coverage", value: needsAnalysis.existingCoverage },
    { name: "Gap", value: Math.max(0, needsAnalysis.additionalNeeded) },
  ];

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ShieldPlus className="h-6 w-6" />
              Life Insurance Needs Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculates how much life insurance coverage you need to protect
              your family and dependents.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Calculation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Income & Age</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="annual-income">Annual Income</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="annual-income"
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Current Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={18}
                    max={80}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>
                  Income Replacement Period (Years): {yearsOfIncome}
                </Label>
                <Slider
                  value={[yearsOfIncome]}
                  min={5}
                  max={30}
                  step={1}
                  onValueChange={(value) => setYearsOfIncome(value[0])}
                />
              </div>

              <div className="mt-4 space-y-2">
                <Label>Number of Dependents: {dependents}</Label>
                <Slider
                  value={[dependents]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setDependents(value[0])}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Existing Coverage</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="existing-insurance">
                    Existing Life Insurance
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="existing-insurance"
                      type="number"
                      value={existingInsurance}
                      onChange={(e) =>
                        setExistingInsurance(Number(e.target.value))
                      }
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existing-savings">
                    Existing Savings/Assets
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="existing-savings"
                      type="number"
                      value={existingSavings}
                      onChange={(e) =>
                        setExistingSavings(Number(e.target.value))
                      }
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Additional Expenses</h3>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="final-expenses">
                    Final Expenses (Funeral, Medical, etc.)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="final-expenses"
                      type="number"
                      value={expenses.finalExpenses}
                      onChange={(e) =>
                        handleExpenseChange(
                          "finalExpenses",
                          Number(e.target.value)
                        )
                      }
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mortgage">Mortgage Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="mortgage"
                      type="number"
                      value={expenses.mortgage}
                      onChange={(e) =>
                        handleExpenseChange("mortgage", Number(e.target.value))
                      }
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other-debts">
                    Other Debts (Credit Cards, Loans, etc.)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="other-debts"
                      type="number"
                      value={expenses.otherDebts}
                      onChange={(e) =>
                        handleExpenseChange(
                          "otherDebts",
                          Number(e.target.value)
                        )
                      }
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education-fund">
                    Education Fund for Children
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="education-fund"
                      type="number"
                      value={expenses.educationFund}
                      onChange={(e) =>
                        handleExpenseChange(
                          "educationFund",
                          Number(e.target.value)
                        )
                      }
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Life Insurance Needs Analysis
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Total Financial Needs:</span>
                <span className="text-xl font-bold">
                  {formatCurrency(needsAnalysis.totalNeeds)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Existing Coverage:</span>
                <span className="text-xl">
                  {formatCurrency(needsAnalysis.existingCoverage)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">
                  Additional Insurance Needed:
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(needsAnalysis.additionalNeeded)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={coverageComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" fill="#3366cc" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Needs Breakdown
            </h3>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={needsAnalysis.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {needsAnalysis.breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {needsAnalysis.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span>{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-muted/20">
          <h3 className="text-lg font-medium mb-2">Important Note</h3>
          <p className="text-muted-foreground text-sm">
            This calculator provides a general estimate of your life insurance
            needs based on the information provided. For a more comprehensive
            analysis and personalized recommendations, consider consulting with
            a licensed insurance professional.
          </p>
        </Card>
      </div>
    </Card>
  );
};

export default LifeInsuranceNeedsCalculator;
