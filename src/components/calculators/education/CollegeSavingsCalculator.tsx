import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatPercentage } from "@/utils/calculatorUtils";
import {
  getCalculatorData,
  saveCalculatorData,
} from "@/services/storageService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  ArrowRight,
  GraduationCap,
  Save,
  PieChart,
  BarChart2,
  Book,
  Download,
  Share2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Calculator ID for storage
const CALCULATOR_ID = "college-savings";

// Constants for education costs by type
const EDUCATION_COSTS_BY_TYPE = {
  "public-in-state": {
    tuition: 10500,
    roomAndBoard: 12000,
    booksAndSupplies: 1200,
    otherExpenses: 2500,
  },
  "public-out-of-state": {
    tuition: 27000,
    roomAndBoard: 12000,
    booksAndSupplies: 1200,
    otherExpenses: 2500,
  },
  private: {
    tuition: 38000,
    roomAndBoard: 14000,
    booksAndSupplies: 1200,
    otherExpenses: 2500,
  },
  community: {
    tuition: 3800,
    roomAndBoard: 9000,
    booksAndSupplies: 1200,
    otherExpenses: 2500,
  },
  vocational: {
    tuition: 15000,
    roomAndBoard: 0,
    booksAndSupplies: 1000,
    otherExpenses: 1500,
  },
};

// Education cost inflation rate (annual)
const DEFAULT_EDUCATION_INFLATION_RATE = 5.0;

const CollegeSavingsCalculator = () => {
  const { toast } = useToast();

  // Calculator state
  const [childAge, setChildAge] = useState(5);
  const [collegeStartAge, setCollegeStartAge] = useState(18);
  const [collegeYears, setCollegeYears] = useState(4);
  const [educationType, setEducationType] = useState("public-in-state");
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [expectedReturn, setExpectedReturn] = useState(6.0);
  const [educationInflationRate, setEducationInflationRate] = useState(
    DEFAULT_EDUCATION_INFLATION_RATE
  );
  const [includeRoomAndBoard, setIncludeRoomAndBoard] = useState(true);

  // Result state
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);

  // Tab state
  const [activeResultTab, setActiveResultTab] = useState("chart");

  // Load saved data on component mount
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      // Set state from saved data
      setChildAge(savedData.childAge || 5);
      setCollegeStartAge(savedData.collegeStartAge || 18);
      setCollegeYears(savedData.collegeYears || 4);
      setEducationType(savedData.educationType || "public-in-state");
      setCurrentSavings(savedData.currentSavings || 5000);
      setMonthlyContribution(savedData.monthlyContribution || 300);
      setExpectedReturn(savedData.expectedReturn || 6.0);
      setEducationInflationRate(
        savedData.educationInflationRate || DEFAULT_EDUCATION_INFLATION_RATE
      );
      setIncludeRoomAndBoard(
        savedData.includeRoomAndBoard !== undefined
          ? savedData.includeRoomAndBoard
          : true
      );
    }
  }, []);

  // Calculate results
  const calculateResults = () => {
    // Get cost data based on education type
    const baseCosts = EDUCATION_COSTS_BY_TYPE[educationType];

    // Years until college
    const yearsUntilCollege = collegeStartAge - childAge;

    // Calculate total annual cost with adjustments
    let annualCost =
      baseCosts.tuition + baseCosts.booksAndSupplies + baseCosts.otherExpenses;
    if (includeRoomAndBoard) {
      annualCost += baseCosts.roomAndBoard;
    }

    // Projected annual cost with inflation when child starts college
    const projectedAnnualCost =
      annualCost *
      Math.pow(1 + educationInflationRate / 100, yearsUntilCollege);

    // Total education cost
    const totalEducationCost = projectedAnnualCost * collegeYears;

    // Calculate future value of current savings
    const savingsFutureValue =
      currentSavings * Math.pow(1 + expectedReturn / 100, yearsUntilCollege);

    // Calculate future value of monthly contributions
    const monthlyReturnRate = expectedReturn / 100 / 12;
    const monthsUntilCollege = yearsUntilCollege * 12;

    let contributionsFutureValue = 0;
    if (monthlyReturnRate > 0) {
      contributionsFutureValue =
        (monthlyContribution *
          (Math.pow(1 + monthlyReturnRate, monthsUntilCollege) - 1)) /
        monthlyReturnRate;
    } else {
      contributionsFutureValue = monthlyContribution * monthsUntilCollege;
    }

    // Total projected savings when child starts college
    const totalProjectedSavings = savingsFutureValue + contributionsFutureValue;

    // Calculate funding gap or surplus
    const fundingGap = totalEducationCost - totalProjectedSavings;
    const percentageFunded = (totalProjectedSavings / totalEducationCost) * 100;

    // Calculate recommended monthly contribution to fully fund education
    let recommendedMonthlyContribution = 0;
    if (monthlyReturnRate > 0 && monthsUntilCollege > 0) {
      const targetFutureValue = totalEducationCost - savingsFutureValue;
      if (targetFutureValue > 0) {
        recommendedMonthlyContribution =
          (targetFutureValue * monthlyReturnRate) /
          (Math.pow(1 + monthlyReturnRate, monthsUntilCollege) - 1);
      }
    }

    // Generate chart data
    const chartData = [];
    const breakdownData = [];

    // Annual cost breakdown by category
    const tuitionInflated =
      baseCosts.tuition *
      Math.pow(1 + educationInflationRate / 100, yearsUntilCollege);
    const roomAndBoardInflated =
      baseCosts.roomAndBoard *
      Math.pow(1 + educationInflationRate / 100, yearsUntilCollege);
    const booksAndSuppliesInflated =
      baseCosts.booksAndSupplies *
      Math.pow(1 + educationInflationRate / 100, yearsUntilCollege);
    const otherExpensesInflated =
      baseCosts.otherExpenses *
      Math.pow(1 + educationInflationRate / 100, yearsUntilCollege);

    breakdownData.push({
      name: "Tuition",
      value: tuitionInflated * collegeYears,
    });

    if (includeRoomAndBoard) {
      breakdownData.push({
        name: "Room & Board",
        value: roomAndBoardInflated * collegeYears,
      });
    }

    breakdownData.push({
      name: "Books & Supplies",
      value: booksAndSuppliesInflated * collegeYears,
    });

    breakdownData.push({
      name: "Other Expenses",
      value: otherExpensesInflated * collegeYears,
    });

    // Generate year-by-year growth data
    let currentValue = currentSavings;

    for (let year = 0; year <= yearsUntilCollege; year++) {
      const yearLabel =
        year === 0 ? "Now" : `In ${year} year${year > 1 ? "s" : ""}`;
      const age = childAge + year;
      const yearlyContributions = year === 0 ? 0 : monthlyContribution * 12;
      const yearlyReturn = currentValue * (expectedReturn / 100);

      // Add returns and contributions
      if (year > 0) {
        currentValue =
          currentValue * (1 + expectedReturn / 100) + yearlyContributions;
      }

      chartData.push({
        year,
        yearLabel,
        age,
        value: currentValue,
        contributions: year === 0 ? currentSavings : yearlyContributions,
        returns: year === 0 ? 0 : yearlyReturn,
      });
    }

    // Set results
    const results = {
      yearsUntilCollege,
      projectedAnnualCost,
      totalEducationCost,
      totalProjectedSavings,
      savingsFutureValue,
      contributionsFutureValue,
      fundingGap,
      percentageFunded,
      recommendedMonthlyContribution,
      collegeStartYear: new Date().getFullYear() + yearsUntilCollege,
    };

    setResults(results);
    setChartData(chartData);
    setBreakdownData(breakdownData);
  };

  // Handle save data
  const handleSaveData = () => {
    const dataToSave = {
      childAge,
      collegeStartAge,
      collegeYears,
      educationType,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      educationInflationRate,
      includeRoomAndBoard,
      lastUpdated: new Date().toISOString(),
    };

    saveCalculatorData(CALCULATOR_ID, dataToSave);

    toast({
      title: "Calculator data saved",
      description:
        "Your education planning data has been saved to your browser.",
    });
  };

  // Handle reset
  const handleReset = () => {
    setChildAge(5);
    setCollegeStartAge(18);
    setCollegeYears(4);
    setEducationType("public-in-state");
    setCurrentSavings(5000);
    setMonthlyContribution(300);
    setExpectedReturn(6.0);
    setEducationInflationRate(DEFAULT_EDUCATION_INFLATION_RATE);
    setIncludeRoomAndBoard(true);
    setResults(null);
    setChartData([]);
    setBreakdownData([]);
  };

  return (
    <div>
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              College Savings Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Plan ahead for education expenses and see how your savings can
              grow over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Panel */}
          <Card className="lg:col-span-5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Savings Inputs</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Child Information */}
                <div>
                  <h3 className="text-md font-medium mb-4">
                    Child Information
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="childAge">Current Age</Label>
                        <span className="text-sm text-muted-foreground">
                          {childAge} years
                        </span>
                      </div>
                      <Slider
                        id="childAge"
                        min={0}
                        max={17}
                        step={1}
                        value={[childAge]}
                        onValueChange={(value) => setChildAge(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="collegeStartAge">
                          Age When Starting College
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {collegeStartAge} years
                        </span>
                      </div>
                      <Slider
                        id="collegeStartAge"
                        min={16}
                        max={25}
                        step={1}
                        value={[collegeStartAge]}
                        onValueChange={(value) => setCollegeStartAge(value[0])}
                      />
                    </div>
                  </div>
                </div>

                {/* Education Plans */}
                <div>
                  <h3 className="text-md font-medium mb-4">Education Plans</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="educationType">Institution Type</Label>
                      <Select
                        value={educationType}
                        onValueChange={setEducationType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select institution type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public-in-state">
                            Public College (In-State)
                          </SelectItem>
                          <SelectItem value="public-out-of-state">
                            Public College (Out-of-State)
                          </SelectItem>
                          <SelectItem value="private">
                            Private College
                          </SelectItem>
                          <SelectItem value="community">
                            Community College
                          </SelectItem>
                          <SelectItem value="vocational">
                            Vocational/Trade School
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="collegeYears">Number of Years</Label>
                        <span className="text-sm text-muted-foreground">
                          {collegeYears} years
                        </span>
                      </div>
                      <Slider
                        id="collegeYears"
                        min={1}
                        max={6}
                        step={1}
                        value={[collegeYears]}
                        onValueChange={(value) => setCollegeYears(value[0])}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeRoomAndBoard"
                        checked={includeRoomAndBoard}
                        onCheckedChange={setIncludeRoomAndBoard}
                      />
                      <Label htmlFor="includeRoomAndBoard">
                        Include Room & Board Costs
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Financial Inputs */}
                <div>
                  <h3 className="text-md font-medium mb-4">
                    Savings & Investments
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentSavings">Current Savings</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="currentSavings"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={currentSavings}
                          onChange={(e) =>
                            setCurrentSavings(Number(e.target.value))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">
                        Monthly Contribution
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="monthlyContribution"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={monthlyContribution}
                          onChange={(e) =>
                            setMonthlyContribution(Number(e.target.value))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="expectedReturn">
                          Expected Annual Return
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {expectedReturn}%
                        </span>
                      </div>
                      <Slider
                        id="expectedReturn"
                        min={0}
                        max={12}
                        step={0.1}
                        value={[expectedReturn]}
                        onValueChange={(value) => setExpectedReturn(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="educationInflationRate">
                          Education Cost Inflation
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {educationInflationRate}%
                        </span>
                      </div>
                      <Slider
                        id="educationInflationRate"
                        min={1}
                        max={10}
                        step={0.1}
                        value={[educationInflationRate]}
                        onValueChange={(value) =>
                          setEducationInflationRate(value[0])
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={calculateResults}>
                    Calculate Education Savings
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleSaveData}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Inputs
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="lg:col-span-7 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                College Savings Projection
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!results ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Book className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Enter Your Information
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Fill in the savings inputs and click "Calculate" to see your
                    projection for college savings.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Total Education Cost
                      </h4>
                      <div className="text-2xl font-bold text-finance-primary">
                        {formatCurrency(results.totalEducationCost)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Starting in {results.collegeStartYear} (
                        {results.yearsUntilCollege} years from now)
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Projected Savings
                      </h4>
                      <div className="text-2xl font-bold text-finance-accent">
                        {formatCurrency(results.totalProjectedSavings)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {results.fundingGap > 0
                          ? `Funding gap: ${formatCurrency(results.fundingGap)}`
                          : `Surplus: ${formatCurrency(
                              Math.abs(results.fundingGap)
                            )}`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Funding Progress
                      </span>
                      <span className="text-sm font-medium">
                        {Math.min(100, Math.round(results.percentageFunded))}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, results.percentageFunded)}
                      className="h-3"
                    />

                    {results.percentageFunded < 100 && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                        <p className="font-medium text-amber-800">
                          Recommendation
                        </p>
                        <p className="text-amber-700">
                          To reach 100% funding, consider increasing your
                          monthly contribution to{" "}
                          <span className="font-bold">
                            {formatCurrency(
                              results.recommendedMonthlyContribution
                            )}
                          </span>
                          .
                        </p>
                      </div>
                    )}

                    {results.percentageFunded >= 100 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                        <p className="font-medium text-green-800">
                          Fully Funded!
                        </p>
                        <p className="text-green-700">
                          Your savings plan is on track to fully cover the
                          projected education costs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tabs for different visualizations */}
                  <Tabs
                    value={activeResultTab}
                    onValueChange={setActiveResultTab}
                    className="mt-6"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="chart">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Growth Chart
                      </TabsTrigger>
                      <TabsTrigger value="breakdown">
                        <PieChart className="h-4 w-4 mr-2" />
                        Cost Breakdown
                      </TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chart" className="pt-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="yearLabel"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              tickFormatter={(value) =>
                                `$${(value / 1000).toFixed(0)}k`
                              }
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `$${value.toLocaleString()}`,
                                "Savings",
                              ]}
                              labelFormatter={(year) => `Year ${year}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              name="Projected Savings"
                              stroke="#2563eb"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-sm text-center text-muted-foreground">
                        Projected savings growth over the next{" "}
                        {results.yearsUntilCollege} years
                      </div>
                    </TabsContent>

                    <TabsContent value="breakdown" className="pt-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={breakdownData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis
                              tickFormatter={(value) =>
                                `$${(value / 1000).toFixed(0)}k`
                              }
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `$${value.toLocaleString()}`,
                                "Cost",
                              ]}
                            />
                            <Bar dataKey="value" name="Cost" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-sm text-center text-muted-foreground">
                        Breakdown of total education costs over {collegeYears}{" "}
                        years
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              Years Until College
                            </h4>
                            <p className="font-medium">
                              {results.yearsUntilCollege} years
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              College Start Year
                            </h4>
                            <p className="font-medium">
                              {results.collegeStartYear}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Cost Projections
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between py-1 border-b">
                              <span>Annual Cost (Inflation-Adjusted)</span>
                              <span className="font-medium">
                                {formatCurrency(results.projectedAnnualCost)}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span>
                                Total Education Cost ({collegeYears} years)
                              </span>
                              <span className="font-medium">
                                {formatCurrency(results.totalEducationCost)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Savings Projections
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between py-1 border-b">
                              <span>Current Savings (Future Value)</span>
                              <span className="font-medium">
                                {formatCurrency(results.savingsFutureValue)}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span>Monthly Contributions (Future Value)</span>
                              <span className="font-medium">
                                {formatCurrency(
                                  results.contributionsFutureValue
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span>Total Projected Savings</span>
                              <span className="font-medium">
                                {formatCurrency(results.totalProjectedSavings)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Funding Analysis
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between py-1 border-b">
                              <span>Percentage Funded</span>
                              <span className="font-medium">
                                {formatPercentage(results.percentageFunded)}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span>
                                {results.fundingGap > 0
                                  ? "Funding Gap"
                                  : "Funding Surplus"}
                              </span>
                              <span
                                className={`font-medium ${
                                  results.fundingGap > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {formatCurrency(Math.abs(results.fundingGap))}
                              </span>
                            </div>
                            {results.fundingGap > 0 && (
                              <div className="flex justify-between py-1 border-b">
                                <span>Recommended Monthly Contribution</span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    results.recommendedMonthlyContribution
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons for Results */}
                  {results && (
                    <div className="flex justify-end gap-3 mt-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Share Your Results</DialogTitle>
                            <DialogDescription>
                              Create a shareable link to your college savings
                              projection.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-muted-foreground mb-4">
                              Your data is kept private and only shared via this
                              temporary link that expires after 7 days.
                            </p>
                            <Input
                              disabled
                              value="https://example.com/share/college-savings/temp-id"
                            />
                          </div>
                          <DialogFooter>
                            <Button disabled>Copy Link</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" disabled>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </div>
  );
};

export default CollegeSavingsCalculator;
