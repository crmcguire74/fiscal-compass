import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Info, Calculator, Download, Save, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateCompoundInterest,
  formatCurrency,
  formatLargeNumber,
} from "@/utils/calculatorUtils";
import { COMPOUNDING_FREQUENCIES } from "@/lib/constants";
import {
  saveCalculatorData,
  getCalculatorData,
} from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";

const CALCULATOR_ID = "savings-calculator";

interface SavingsAccount {
  id: string;
  name: string;
  balance: number;
  monthlyContribution: number;
  interestRate: number;
  interestRateVariance: number;
  compoundingFrequency: string;
  accountType: "savings" | "investment";
}

const ACCOUNT_TYPE_OPTIONS = [
  { value: "savings", label: "Savings Account" },
  { value: "investment", label: "Investment Account" },
];

const DEFAULT_ACCOUNT: SavingsAccount = {
  id: "1",
  name: "Primary Savings",
  balance: 5000,
  monthlyContribution: 500,
  interestRate: 3,
  interestRateVariance: 0,
  compoundingFrequency: "monthly",
  accountType: "savings",
};

const SavingsCalculator = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SavingsAccount[]>([DEFAULT_ACCOUNT]);
  const [years, setYears] = useState(20);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chart");
  const [dataStored, setDataStored] = useState(false);

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setAccounts(savedData.accounts || [DEFAULT_ACCOUNT]);
      setYears(savedData.years || 20);
      setDataStored(true);
    }
  }, []);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [accounts, years]);

  // Generate unique ID for new accounts
  const generateAccountId = () => {
    return Date.now().toString();
  };

  // Add new account
  const handleAddAccount = () => {
    setAccounts([
      ...accounts,
      {
        ...DEFAULT_ACCOUNT,
        id: generateAccountId(),
        name: `Account ${accounts.length + 1}`,
      },
    ]);
  };

  // Remove account
  const handleRemoveAccount = (id: string) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter((account) => account.id !== id));
    }
  };

  // Update account field
  const handleAccountChange = (
    id: string,
    field: keyof SavingsAccount,
    value: any
  ) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id ? { ...account, [field]: value } : account
      )
    );
  };

  // Calculate aggregated results
  const calculateResults = () => {
    const yearlyTotals = Array(years)
      .fill(0)
      .map((_, index) => ({
        year: index + 1,
        balance: 0,
        contributions: 0,
        interest: 0,
        accounts: {} as Record<string, number>,
      }));

    let totalContributions = 0;
    let totalInterestEarned = 0;

    accounts.forEach((account) => {
      const selectedFrequency =
        COMPOUNDING_FREQUENCIES.find(
          (freq) => freq.value === account.compoundingFrequency
        ) || COMPOUNDING_FREQUENCIES[1];

      const accountResults = calculateCompoundInterest(
        account.balance,
        account.monthlyContribution,
        account.interestRate,
        years,
        selectedFrequency.timesPerYear,
        account.interestRateVariance
      );

      totalContributions += accountResults.totalContributions;
      totalInterestEarned += accountResults.totalInterestEarned;

      // Aggregate yearly data
      accountResults.yearlyData.forEach((yearData, index) => {
        yearlyTotals[index].balance += yearData.balance;
        yearlyTotals[index].contributions += yearData.contributions;
        yearlyTotals[index].interest += yearData.interest;
        yearlyTotals[index].accounts[account.id] = yearData.balance;
      });
    });

    setResults({
      finalBalance: yearlyTotals[years - 1].balance,
      totalContributions,
      totalInterestEarned,
      yearlyData: yearlyTotals,
    });
  };

  // Handle saving calculator data
  const handleSaveData = () => {
    const dataToSave = {
      accounts,
      years,
      timestamp: Date.now(),
    };
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);

    toast({
      title: "Data Saved",
      description: "Your calculator data has been saved locally.",
    });
  };

  // Handle downloading results as CSV
  const handleDownloadCSV = () => {
    if (!results) return;

    // Create CSV headers
    let headers = [
      "Year",
      "Total Balance",
      "Annual Contribution",
      "Interest Earned",
    ];
    accounts.forEach((account) => {
      headers.push(`${account.name} Balance`);
    });

    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    results.yearlyData.forEach((yearData: any) => {
      let row = [
        yearData.year,
        yearData.balance.toFixed(2),
        yearData.contributions.toFixed(2),
        yearData.interest.toFixed(2),
      ];
      accounts.forEach((account) => {
        row.push((yearData.accounts[account.id] || 0).toFixed(2));
      });
      csvContent += row.join(",") + "\n";
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "savings-calculator-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-semibold">Year {label}</p>
          <p className="text-sm text-finance-primary">
            Total Balance: {formatCurrency(payload[0].value)}
          </p>
          {accounts.map((account, index) => (
            <p
              key={account.id}
              className="text-sm"
              style={{ color: getAccountColor(index) }}
            >
              {account.name}: {formatCurrency(payload[index + 1]?.value || 0)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get color for account based on index
  const getAccountColor = (index: number) => {
    const colors = [
      "#1a365d",
      "#2563eb",
      "#4ade80",
      "#f59e0b",
      "#dc2626",
      "#8b5cf6",
    ];
    return colors[index % colors.length];
  };

  // Prepare chart data
  const getChartData = () => {
    if (!results) return [];
    return results.yearlyData.map((yearData: any) => {
      const data: any = {
        year: yearData.year,
        total: yearData.balance,
      };
      accounts.forEach((account) => {
        data[account.id] = yearData.accounts[account.id] || 0;
      });
      return data;
    });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Multi-Account Savings Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Track and project growth across multiple savings and investment
              accounts
            </CardDescription>
          </div>
          {dataStored && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Data Saved Locally
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              {accounts.map((account, index) => (
                <Card key={account.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Input
                        value={account.name}
                        onChange={(e) =>
                          handleAccountChange(
                            account.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="font-medium"
                        placeholder="Account Name"
                      />
                    </div>
                    {accounts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => handleRemoveAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`balance-${account.id}`}>
                        Current Balance
                      </Label>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">$</span>
                        <Input
                          id={`balance-${account.id}`}
                          type="number"
                          value={account.balance}
                          onChange={(e) =>
                            handleAccountChange(
                              account.id,
                              "balance",
                              Number(e.target.value)
                            )
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`contribution-${account.id}`}>
                        Monthly Contribution
                      </Label>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">$</span>
                        <Input
                          id={`contribution-${account.id}`}
                          type="number"
                          value={account.monthlyContribution}
                          onChange={(e) =>
                            handleAccountChange(
                              account.id,
                              "monthlyContribution",
                              Number(e.target.value)
                            )
                          }
                          min={0}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor={`type-${account.id}`}>Account Type</Label>
                      <Select
                        value={account.accountType}
                        onValueChange={(value: "savings" | "investment") =>
                          handleAccountChange(account.id, "accountType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCOUNT_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`rate-${account.id}`}>
                          Interest/Return Rate (%)
                        </Label>
                        <span className="text-sm font-medium">
                          {account.interestRate}%
                        </span>
                      </div>
                      <Slider
                        id={`rate-${account.id}`}
                        value={[account.interestRate]}
                        min={0}
                        max={account.accountType === "savings" ? 10 : 20}
                        step={0.1}
                        onValueChange={(value) =>
                          handleAccountChange(
                            account.id,
                            "interestRate",
                            value[0]
                          )
                        }
                      />
                    </div>

                    {account.accountType === "investment" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`variance-${account.id}`}>
                            Return Rate Variance (+/- %)
                          </Label>
                          <span className="text-sm font-medium">
                            {account.interestRateVariance}%
                          </span>
                        </div>
                        <Slider
                          id={`variance-${account.id}`}
                          value={[account.interestRateVariance]}
                          min={0}
                          max={5}
                          step={0.1}
                          onValueChange={(value) =>
                            handleAccountChange(
                              account.id,
                              "interestRateVariance",
                              value[0]
                            )
                          }
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor={`frequency-${account.id}`}>
                        Compounding Frequency
                      </Label>
                      <Select
                        value={account.compoundingFrequency}
                        onValueChange={(value) =>
                          handleAccountChange(
                            account.id,
                            "compoundingFrequency",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPOUNDING_FREQUENCIES.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                onClick={handleAddAccount}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <span className="text-sm font-medium">{years} years</span>
              </div>
              <Slider
                id="years"
                value={[years]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setYears(value[0])}
              />
            </div>

            <Button
              className="w-full text-white font-medium"
              onClick={handleSaveData}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Data Locally
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="calculator-panel">
                  <h3 className="text-lg font-medium mb-3">Results Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Total Balance
                      </p>
                      <p className="text-xl font-semibold text-finance-primary">
                        {formatCurrency(results.finalBalance)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Total Contributions
                      </p>
                      <p className="text-lg font-medium text-finance-secondary">
                        {formatCurrency(results.totalContributions)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Total Interest/Returns
                      </p>
                      <p className="text-lg font-medium text-finance-accent">
                        {formatCurrency(results.totalInterestEarned)}
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">Growth Chart</TabsTrigger>
                    <TabsTrigger value="data">Year by Year</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart" className="space-y-4">
                    <div className="calculator-panel h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={formatLargeNumber} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="total"
                            name="Total Balance"
                            stroke="#1a365d"
                            strokeWidth={2}
                          />
                          {accounts.map((account, index) => (
                            <Line
                              key={account.id}
                              type="monotone"
                              dataKey={account.id}
                              name={account.name}
                              stroke={getAccountColor(index + 1)}
                              strokeWidth={1.5}
                              strokeDasharray={index === 0 ? "" : "5 5"}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="data" className="space-y-4">
                    <div className="calculator-panel">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-medium">
                          Year by Year Breakdown
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadCSV}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download CSV
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 text-left font-medium">
                                Year
                              </th>
                              <th className="py-2 text-right font-medium">
                                Total Balance
                              </th>
                              <th className="py-2 text-right font-medium">
                                Annual Contribution
                              </th>
                              <th className="py-2 text-right font-medium">
                                Interest/Returns
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.yearlyData.map(
                              (yearData: any, index: number) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-100"
                                >
                                  <td className="py-2 text-left">
                                    {yearData.year}
                                  </td>
                                  <td className="py-2 text-right">
                                    {formatCurrency(yearData.balance)}
                                  </td>
                                  <td className="py-2 text-right">
                                    {formatCurrency(yearData.contributions)}
                                  </td>
                                  <td className="py-2 text-right">
                                    {formatCurrency(yearData.interest)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between bg-gray-50 border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          <p>
            * Results are for illustrative purposes only and do not reflect
            actual investment results.
          </p>
          <p>
            * This calculator doesn't account for taxes, inflation, or
            investment fees.
          </p>
          <p>
            * Past performance of investments does not guarantee future results.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SavingsCalculator;
