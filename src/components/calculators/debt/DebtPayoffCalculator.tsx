import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Trash2,
  PlusCircle,
  TrendingDown,
  DollarSign,
  Percent,
  ListChecks,
  Info,
  BarChart3,
  ListOrdered,
  Save,
} from "lucide-react"; // Consolidated icons
import { toast } from "@/hooks/use-toast";
import { formatCurrency, formatPercentage } from "@/utils/calculatorUtils";
import {
  saveCalculatorData,
  getCalculatorData,
} from "@/services/storageService";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CALCULATOR_ID = "debt-payoff-calculator";

// Base Debt Item Interface
interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

// Extended type for calculations within the payoff plan
interface WorkingDebtItem extends DebtItem {
  currentBalance: number;
  totalInterestPaid: number;
}

// Result structure for a payoff plan
interface PayoffResult {
  method: "snowball" | "avalanche";
  totalInterest: number;
  totalPaid: number;
  monthsToPayoff: number;
  payoffSchedule: Array<{
    month: number;
    remainingBalance: number;
    interestPaid: number;
    principalPaid: number;
    totalPaidThisMonth: number; // Added for clarity
  }>;
  debtDetails: Array<{
    id: string;
    name: string;
    payoffMonth: number;
    totalInterestPaid: number;
  }>;
}

const DebtPayoffCalculator = () => {
  // --- State ---
  const [debts, setDebts] = useState<DebtItem[]>([
    // Default example debts
    {
      id: "debt-1",
      name: "Credit Card",
      balance: 5000,
      interestRate: 18,
      minimumPayment: 150,
    },
    {
      id: "debt-2",
      name: "Car Loan",
      balance: 12000,
      interestRate: 6,
      minimumPayment: 300,
    },
    {
      id: "debt-3",
      name: "Student Loan",
      balance: 20000,
      interestRate: 4.5,
      minimumPayment: 200,
    },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(200);
  const [snowballResult, setSnowballResult] = useState<PayoffResult | null>(
    null
  );
  const [avalancheResult, setAvalancheResult] = useState<PayoffResult | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"snowball" | "avalanche">(
    "snowball"
  );
  const [dataStored, setDataStored] = useState(false);

  // --- Effects ---
  // Load data on initial mount
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      if (savedData.debts) {
        setDebts(
          (savedData.debts || []).map((d: any, index: number) => ({
            id: d.id || `saved-debt-${index}-${Date.now()}`,
            name: d.name || "",
            balance: Number(d.balance || 0),
            interestRate: Number(d.interestRate || 0),
            minimumPayment: Number(d.minimumPayment || 0),
          }))
        );
      }
      if (savedData.extraPayment !== undefined)
        setExtraPayment(Number(savedData.extraPayment || 0));
      setDataStored(true);
      // Optionally restore previous results if saved
    } else {
      // Ensure initial debts have IDs
      setDebts(
        debts.map((d, index) => ({
          ...d,
          id: d.id || `initial-debt-${index}-${Date.now()}`,
        }))
      );
    }
  }, []);

  // Debounced calculation when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debts.some((debt) => debt.balance > 0)) {
        calculatePayoff(false); // No toast on auto-recalc
      }
    }, 300); // Small delay to prevent excessive recalculations

    return () => clearTimeout(timer);
  }, [debts, extraPayment]);

  // --- Data Handling ---
  const saveData = () => {
    saveCalculatorData(CALCULATOR_ID, {
      debts,
      extraPayment,
      lastCalculated: new Date().toISOString(),
      snowballResult, // Save results to restore state
      avalancheResult,
    });
    setDataStored(true);
  };

  // --- Debt List Management ---
  const handleAddDebt = () => {
    setDebts([
      ...debts,
      {
        id: `debt-${Date.now()}`,
        name: "",
        balance: 0,
        interestRate: 0,
        minimumPayment: 0,
      },
    ]);
  };

  const handleRemoveDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const handleDebtChange = (
    id: string,
    field: keyof DebtItem,
    value: number | string
  ) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id
          ? {
              ...debt,
              [field]: typeof value === "string" ? value : Number(value),
            }
          : debt
      )
    );
  };

  // --- Calculation Logic ---
  // Sort function for payoff strategies (accepts WorkingDebtItem)
  const sortDebtsByMethod = (
    method: "snowball" | "avalanche",
    currentDebts: WorkingDebtItem[]
  ) => {
    const sortedDebts = [...currentDebts];
    if (method === "snowball") {
      sortedDebts.sort((a, b) => {
        if (a.currentBalance !== b.currentBalance)
          return a.currentBalance - b.currentBalance;
        return b.interestRate - a.interestRate; // Tie-breaker: higher rate first
      });
    } else {
      sortedDebts.sort((a, b) => {
        if (b.interestRate !== a.interestRate)
          return b.interestRate - a.interestRate;
        return a.currentBalance - b.currentBalance; // Tie-breaker: lower balance first
      });
    }
    return sortedDebts;
  };

  // Main calculation function
  const calculatePayoff = (showToast = true) => {
    // Validation
    if (
      debts.some(
        (debt) =>
          debt.balance < 0 || debt.interestRate < 0 || debt.minimumPayment < 0
      )
    ) {
      toast({
        title: "Invalid Input",
        description: "Debt values cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    if (debts.some((debt) => debt.minimumPayment <= 0 && debt.balance > 0)) {
      toast({
        title: "Missing Minimum Payment",
        description:
          "Please enter a minimum payment (>0) for all debts with a balance.",
        variant: "destructive",
      });
      return;
    }
    if (extraPayment < 0) {
      toast({
        title: "Invalid Extra Payment",
        description: "Extra payment cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    if (debts.length === 0) {
      toast({
        title: "No Debts",
        description: "Please add at least one debt.",
        variant: "destructive",
      });
      setSnowballResult(null);
      setAvalancheResult(null);
      return;
    }

    const snowball = calculatePayoffPlan("snowball");
    const avalanche = calculatePayoffPlan("avalanche");

    setSnowballResult(snowball);
    setAvalancheResult(avalanche);
    saveData();

    if (showToast) {
      const interestDiff = Math.abs(
        snowball.totalInterest - avalanche.totalInterest
      );
      const timeDiff = Math.abs(
        snowball.monthsToPayoff - avalanche.monthsToPayoff
      );
      let description = `Snowball: ${
        snowball.monthsToPayoff
      } mo, ${formatCurrency(snowball.totalInterest)} interest. Avalanche: ${
        avalanche.monthsToPayoff
      } mo, ${formatCurrency(avalanche.totalInterest)} interest.`;
      if (interestDiff > 1 || timeDiff > 0) {
        const betterMethod =
          avalanche.totalInterest < snowball.totalInterest
            ? "Avalanche"
            : "Snowball";
        const timeComparison =
          timeDiff === 0
            ? "the same time"
            : `${timeDiff} ${timeDiff === 1 ? "month" : "months"} ${
                avalanche.monthsToPayoff < snowball.monthsToPayoff
                  ? "less"
                  : "more"
              }`;
        description = `${betterMethod} saves ${formatCurrency(
          interestDiff
        )} interest and takes ${timeComparison}.`;
      }
      toast({
        title: "Payoff Plans Calculated",
        description: description,
        duration: 7000,
      });
    }
  };

  // Core payoff simulation logic
  const calculatePayoffPlan = (
    method: "snowball" | "avalanche"
  ): PayoffResult => {
    let workingDebts: WorkingDebtItem[] = debts.map((debt) => ({
      ...debt,
      currentBalance: debt.balance,
      totalInterestPaid: 0,
    }));
    let month = 0;
    let totalInterestOverall = 0;
    let totalPaidOverall = 0;
    const payoffSchedule = [];
    const debtDetails = workingDebts.map((debt) => ({
      id: debt.id,
      name: debt.name,
      payoffMonth: 0,
      totalInterestPaid: 0,
    }));
    const originalTotalMinimums = debts.reduce(
      (sum, d) => sum + d.minimumPayment,
      0
    );

    while (workingDebts.some((d) => d.currentBalance > 0.01)) {
      month++;
      let monthlyInterestPaid = 0;
      let monthlyPrincipalPaid = 0;
      let totalMinimumsPaidThisMonth = 0;
      let snowballAmount = 0;

      // Sort debts for payment order *at the start of each month*
      workingDebts = sortDebtsByMethod(method, workingDebts);

      // 1. Calculate interest and apply minimum payments
      workingDebts.forEach((debt) => {
        if (debt.currentBalance <= 0.01) return;

        const monthlyInterest =
          (debt.currentBalance * (debt.interestRate / 100)) / 12;
        debt.totalInterestPaid += monthlyInterest;
        monthlyInterestPaid += monthlyInterest;
        totalInterestOverall += monthlyInterest;

        let paymentTowardsThisDebt = debt.minimumPayment;
        paymentTowardsThisDebt = Math.min(
          paymentTowardsThisDebt,
          debt.currentBalance + monthlyInterest
        ); // Cap payment at amount needed

        const principalPaid = Math.max(
          0,
          paymentTowardsThisDebt - monthlyInterest
        ); // Ensure principal isn't negative
        debt.currentBalance -= principalPaid;
        monthlyPrincipalPaid += principalPaid;
        totalMinimumsPaidThisMonth += paymentTowardsThisDebt;
      });

      // 2. Determine snowball amount (freed-up minimums)
      const currentTotalMinimumsRequired = workingDebts
        .filter((d) => d.currentBalance > 0.01)
        .reduce((sum, d) => sum + d.minimumPayment, 0);
      snowballAmount = originalTotalMinimums - currentTotalMinimumsRequired;

      // 3. Apply extra payment + snowball amount
      let paymentPool = extraPayment + snowballAmount;
      workingDebts.forEach((debt) => {
        if (paymentPool <= 0 || debt.currentBalance <= 0.01) return;
        const amountToPay = Math.min(paymentPool, debt.currentBalance);
        debt.currentBalance -= amountToPay;
        monthlyPrincipalPaid += amountToPay;
        paymentPool -= amountToPay;
      });

      // Record payoff month if balance hits zero
      workingDebts.forEach((debt) => {
        const detail = debtDetails.find((d) => d.id === debt.id);
        if (detail && detail.payoffMonth === 0 && debt.currentBalance <= 0.01) {
          detail.payoffMonth = month;
          detail.totalInterestPaid = debt.totalInterestPaid; // Record final interest when paid off
        }
      });

      // Update totals and schedule
      const totalPaidThisMonth =
        totalMinimumsPaidThisMonth +
        extraPayment +
        snowballAmount -
        paymentPool;
      totalPaidOverall += totalPaidThisMonth;
      const remainingBalanceOverall = workingDebts.reduce(
        (sum, d) => sum + d.currentBalance,
        0
      );

      payoffSchedule.push({
        month,
        remainingBalance:
          remainingBalanceOverall < 0.01 ? 0 : remainingBalanceOverall, // Ensure final is 0
        interestPaid: monthlyInterestPaid,
        principalPaid: monthlyPrincipalPaid,
        totalPaidThisMonth: totalPaidThisMonth,
      });

      // Filter out paid-off debts for the next iteration's check
      workingDebts = workingDebts.filter((d) => d.currentBalance > 0.01);

      if (month > 1200) {
        console.error("Calculation exceeded 100 years.");
        break;
      } // Safety break
    }

    // Final pass to update total interest paid for debts paid off in the last month
    debtDetails.forEach((detail) => {
      if (detail.payoffMonth === month) {
        const finalDebt =
          workingDebts.find((d) => d.id === detail.id) ||
          debts.find((d) => d.id === detail.id);
        if (finalDebt) {
          detail.totalInterestPaid =
            (finalDebt as WorkingDebtItem).totalInterestPaid || 0;
        }
      }
    });

    return {
      method,
      totalInterest: totalInterestOverall,
      totalPaid: totalPaidOverall,
      monthsToPayoff: month,
      payoffSchedule,
      debtDetails,
    };
  };

  // --- Render Logic ---
  const activeResult =
    activeTab === "snowball" ? snowballResult : avalancheResult;
  const chartData = activeResult?.payoffSchedule.map((item) => ({
    month: item.month,
    balance: item.remainingBalance < 0.01 ? 0 : item.remainingBalance,
  }));

  return (
    <Card className="w-full shadow-lg border-gray-200">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingDown className="h-6 w-6" /> Debt Payoff Calculator
            </CardTitle>
            <CardDescription className="text-finance-primary-foreground/90 mt-1">
              Compare Snowball vs. Avalanche strategies.
            </CardDescription>
          </div>
          {dataStored && (
            <TooltipProvider>
              <UITooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 cursor-default">
                    <Save size={12} /> Saved
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your inputs are saved locally.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-6 space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {/* Extra Payment Card */}
            <Card className="border-dashed border-blue-300 h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                  <DollarSign className="h-5 w-5" /> Extra Payment
                </CardTitle>
                <CardDescription>
                  Additional amount paid monthly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="extraPayment" className="flex items-center">
                    Amount
                  </Label>
                  <div className="flex items-center">
                    <span className="input-prefix">$</span>
                    <Input
                      id="extraPayment"
                      type="number"
                      min="0"
                      value={extraPayment}
                      onChange={(e) =>
                        setExtraPayment(Number(e.target.value) || 0)
                      }
                      className="input-field rounded-l-none"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            {/* Debts Card */}
            <Card className="border-dashed border-green-300 h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <ListChecks className="h-5 w-5" /> Your Debts
                  </CardTitle>
                  <Button onClick={handleAddDebt} variant="outline" size="sm">
                    <PlusCircle size={16} className="mr-2" /> Add Debt
                  </Button>
                </div>
                <CardDescription>
                  List all debts to include in the plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 -mr-2">
                  {debts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No debts added.
                    </p>
                  )}
                  {debts.map((debt) => (
                    <Card key={debt.id} className="p-3 bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <Input
                          value={debt.name}
                          onChange={(e) =>
                            handleDebtChange(debt.id, "name", e.target.value)
                          }
                          className="flex-1 mr-2 h-9 font-medium"
                          placeholder="Debt name"
                        />
                        <TooltipProvider>
                          <UITooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleRemoveDebt(debt.id)}
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:bg-red-100 h-9 w-9"
                              >
                                {" "}
                                <Trash2 className="h-4 w-4" />{" "}
                              </Button>
                            </TooltipTrigger>{" "}
                            <TooltipContent>
                              <p>Remove Debt</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label
                            htmlFor={`balance-${debt.id}`}
                            className="text-xs"
                          >
                            Balance
                          </Label>
                          <div className="flex items-center">
                            <span className="input-prefix h-9">$</span>
                            <Input
                              id={`balance-${debt.id}`}
                              type="number"
                              min="0"
                              value={debt.balance}
                              onChange={(e) =>
                                handleDebtChange(
                                  debt.id,
                                  "balance",
                                  Number(e.target.value)
                                )
                              }
                              className="input-field rounded-l-none h-9"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`interest-${debt.id}`}
                            className="text-xs"
                          >
                            Rate
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id={`interest-${debt.id}`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={debt.interestRate}
                              onChange={(e) =>
                                handleDebtChange(
                                  debt.id,
                                  "interestRate",
                                  Number(e.target.value)
                                )
                              }
                              className="input-field rounded-r-none h-9"
                              placeholder="0"
                            />
                            <span className="input-suffix h-9">%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor={`minimum-${debt.id}`}
                            className="text-xs"
                          >
                            Min. Pymt
                          </Label>
                          <div className="flex items-center">
                            <span className="input-prefix h-9">$</span>
                            <Input
                              id={`minimum-${debt.id}`}
                              type="number"
                              min="0"
                              value={debt.minimumPayment}
                              onChange={(e) =>
                                handleDebtChange(
                                  debt.id,
                                  "minimumPayment",
                                  Number(e.target.value)
                                )
                              }
                              className="input-field rounded-l-none h-9"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {snowballResult && avalancheResult && (
          <div className="pt-6 border-t space-y-6">
            <h2 className="text-xl font-semibold text-center text-finance-primary">
              Payoff Plan Comparison
            </h2>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "snowball" | "avalanche")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="snowball">Snowball</TabsTrigger>
                <TabsTrigger value="avalanche">Avalanche</TabsTrigger>
              </TabsList>

              {/* Shared Result Display Structure */}
              {[snowballResult, avalancheResult].map((result) => (
                <TabsContent
                  key={result.method}
                  value={result.method}
                  className="space-y-4 mt-4"
                >
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base">
                        {result.method === "snowball"
                          ? "Snowball"
                          : "Avalanche"}{" "}
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="p-2 border rounded bg-white">
                        <div className="text-xs text-muted-foreground">
                          Total Interest
                        </div>
                        <div className="text-lg font-semibold">
                          {formatCurrency(result.totalInterest)}
                        </div>
                      </div>
                      <div className="p-2 border rounded bg-white">
                        <div className="text-xs text-muted-foreground">
                          Time to Debt-Free
                        </div>
                        <div className="text-lg font-semibold">
                          {result.monthsToPayoff} mo
                        </div>
                      </div>
                      <div className="p-2 border rounded bg-white">
                        <div className="text-xs text-muted-foreground">
                          Total Paid
                        </div>
                        <div className="text-lg font-semibold">
                          {formatCurrency(result.totalPaid)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Chart Card */}
            {chartData && chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Balance Over Time (
                    {activeTab === "snowball" ? "Snowball" : "Avalanche"})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          label={{
                            value: "Month",
                            position: "insideBottom",
                            offset: -5,
                          }}
                          tick={{ fontSize: 10 }}
                          interval="preserveStartEnd"
                          tickFormatter={(tick) =>
                            tick % 12 === 0
                              ? `Yr ${tick / 12}`
                              : tick % 6 === 0
                              ? `M${tick}`
                              : ""
                          }
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                          label={{
                            value: "Balance",
                            angle: -90,
                            position: "insideLeft",
                            offset: 0,
                          }}
                          tick={{ fontSize: 10 }}
                          width={60}
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(Number(value)),
                            "Balance",
                          ]}
                          labelFormatter={(label) => `Month ${label}`}
                          contentStyle={{ fontSize: "12px" }}
                        />
                        <Bar
                          dataKey="balance"
                          fill="#3b82f6"
                          name="Remaining Balance"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payoff Order Card */}
            {activeResult && activeResult.debtDetails.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListOrdered className="h-5 w-5" /> Debt Payoff Order (
                    {activeTab === "snowball" ? "Snowball" : "Avalanche"})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                    {activeResult.debtDetails
                      .sort((a, b) => a.payoffMonth - b.payoffMonth)
                      .map((debt, index) => (
                        <div
                          key={debt.id}
                          className="p-3 flex flex-wrap justify-between items-center text-sm"
                        >
                          <div className="font-medium mr-2">
                            <span className="inline-block text-center w-5 mr-1">
                              {index + 1}.
                            </span>{" "}
                            {debt.name}
                          </div>
                          <div className="text-xs text-muted-foreground text-right ml-auto">
                            Paid off mo {debt.payoffMonth} (
                            {formatCurrency(debt.totalInterestPaid)} int.)
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4 text-center space-y-1">
        <p>
          <strong>Snowball:</strong> Pay off smallest balances first.{" "}
          <strong>Avalanche:</strong> Pay off highest interest rates first.
        </p>
        <p className="italic">
          Both methods assume minimum payments on all debts + extra payment
          applied according to the strategy.
        </p>
      </CardFooter>
    </Card>
  );
};

// Input styling classes
const inputPrefixSuffixBase =
  "flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border";
const inputPrefixStyle = `${inputPrefixSuffixBase} border-r-0 rounded-l-md h-9`;
const inputSuffixStyle = `${inputPrefixSuffixBase} border-l-0 rounded-r-md h-9`;
const inputFieldStyle = "flex-1 min-w-0 rounded-none h-9";

// Add these styles to your global CSS or component-specific CSS:
/*
.input-prefix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-r-0 rounded-l-md h-9; }
.input-suffix { @apply flex items-center justify-center text-sm text-muted-foreground px-3 bg-gray-100 border border-l-0 rounded-r-md h-9; }
.input-field { @apply flex-1 min-w-0 rounded-none h-9; }
*/

export default DebtPayoffCalculator;
