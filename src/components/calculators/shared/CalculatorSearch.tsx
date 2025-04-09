import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

// Define the calculator interface
interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  path: string;
  comingSoon?: boolean;
}

// Combined list of all calculators across all categories
const allCalculators: Calculator[] = [
  // Investment calculators
  {
    id: "compound-interest",
    name: "Compound Interest Calculator",
    description:
      "See how your money can grow with regular contributions and compound interest",
    category: "Investment",
    tags: ["investment", "interest", "growth", "savings", "compound"],
    path: "/calculators/investment/compound-interest",
  },
  // Mortgage calculators
  {
    id: "mortgage-payment",
    name: "Mortgage Payment Calculator",
    description:
      "Calculate your monthly mortgage payment based on loan amount, interest rate, and term",
    category: "Mortgage",
    tags: ["mortgage", "loan", "payment", "home", "interest", "monthly"],
    path: "/calculators/mortgage/mortgage-payment",
  },
  {
    id: "dti-calculator",
    name: "Debt-to-Income Ratio Calculator",
    description:
      "Calculate your DTI ratio to see if you qualify for a mortgage",
    category: "Mortgage",
    tags: ["mortgage", "debt", "income", "ratio", "qualification"],
    path: "/calculators/mortgage/dti-calculator",
  },
  {
    id: "home-equity-loan",
    name: "Home Equity Loan Calculator",
    description:
      "Calculate your potential home equity loan amount and monthly payments",
    category: "Mortgage",
    tags: ["home", "equity", "loan", "heloc", "second mortgage"],
    path: "/calculators/mortgage/home-equity-loan",
  },
  {
    id: "heloc",
    name: "HELOC Calculator",
    description: "Estimate your home equity line of credit borrowing capacity",
    category: "Mortgage",
    tags: ["home", "equity", "line of credit", "heloc", "borrow"],
    path: "/calculators/mortgage/heloc",
  },
  {
    id: "home-equity-calculator",
    name: "Home Equity After Selling Costs",
    description:
      "Calculate how much equity you'll have after paying all selling costs and fees",
    category: "Real Estate",
    tags: ["home", "equity", "selling", "costs", "fees", "real estate"],
    path: "/calculators/real-estate/home-equity-calculator",
  },
  // Retirement calculators
  {
    id: "retirement-savings",
    name: "Retirement Savings Calculator",
    description: "Calculate how much you need to save for retirement",
    category: "Retirement",
    tags: ["retirement", "savings", "401k", "ira", "future"],
    path: "/calculators/retirement/retirement-savings",
  },
  {
    id: "early-ira-withdrawal",
    name: "Early IRA Withdrawal Calculator",
    description:
      "Estimate the cost of early withdrawals from retirement accounts",
    category: "Retirement",
    tags: ["retirement", "ira", "withdrawal", "penalty", "taxes"],
    path: "/calculators/retirement/early-ira-withdrawal",
  },
  // Tax calculators
  {
    id: "take-home-pay-salaried",
    name: "Take-Home Pay Calculator (Salaried)",
    description: "Calculate your net income after taxes and deductions",
    category: "Tax",
    tags: ["tax", "income", "salary", "paycheck", "withholding"],
    path: "/calculators/tax/take-home-pay-salaried",
  },
  {
    id: "take-home-pay-hourly",
    name: "Take-Home Pay Calculator (Hourly)",
    description:
      "Estimate net pay for hourly workers, including overtime and tips",
    category: "Tax",
    tags: ["tax", "income", "hourly", "paycheck", "withholding", "tips"],
    path: "/calculators/tax/take-home-pay-hourly",
  },
  {
    id: "tax-bracket-calculator",
    name: "Tax Bracket Calculator",
    description:
      "Visualize how your income is taxed across different tax brackets",
    category: "Tax",
    tags: ["tax", "brackets", "income", "federal", "rates"],
    path: "/calculators/tax/tax-bracket-calculator",
  },
  {
    id: "bonus-tax-calculator",
    name: "Bonus Tax Calculator",
    description:
      "Calculate how much of your bonus you'll actually receive after taxes",
    category: "Tax",
    tags: ["tax", "bonus", "withholding", "supplemental"],
    path: "/calculators/tax/bonus-tax-calculator",
  },
  // Health calculators
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index based on height and weight",
    category: "Health",
    tags: ["health", "bmi", "weight", "fitness"],
    path: "/calculators/health/bmi-calculator",
  },
  {
    id: "body-fat-calculator",
    name: "Body Fat Calculator",
    description: "Estimate your body fat percentage using various methods",
    category: "Health",
    tags: ["health", "body fat", "fitness", "composition"],
    path: "/calculators/health/body-fat-calculator",
  },
  {
    id: "calorie-calculator",
    name: "Calorie Calculator",
    description:
      "Determine your daily calorie needs based on activity level and goals",
    category: "Health",
    tags: ["health", "calories", "nutrition", "diet", "fitness"],
    path: "/calculators/health/calorie-calculator",
  },
  // Business calculators
  {
    id: "break-even-analysis",
    name: "Break-Even Analysis Calculator",
    description: "Calculate when your business will become profitable",
    category: "Business",
    tags: ["business", "break-even", "profit", "sales", "costs"],
    path: "/calculators/business/break-even-analysis",
  },
  {
    id: "roi-calculator",
    name: "ROI Calculator",
    description: "Calculate the return on investment for business projects",
    category: "Business",
    tags: ["business", "roi", "investment", "return", "profit"],
    path: "/calculators/business/roi-calculator",
  },
  {
    id: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    description: "Calculate gross, operating, and net profit margins",
    category: "Business",
    tags: ["business", "profit", "margin", "gross", "net"],
    path: "/calculators/business/profit-margin-calculator",
  },
  {
    id: "business-valuation-calculator",
    name: "Business Valuation Calculator",
    description: "Estimate the value of your business",
    category: "Business",
    tags: ["business", "valuation", "worth", "value", "selling"],
    path: "/calculators/business/business-valuation-calculator",
  },
  // Life events calculators
  {
    id: "wedding-budget",
    name: "Wedding Budget Calculator",
    description: "Plan your wedding budget and track expenses",
    category: "Life Events",
    tags: ["wedding", "budget", "planning", "expenses", "events"],
    path: "/calculators/life-events/wedding-budget",
  },
  {
    id: "baby-costs",
    name: "Baby Cost Calculator",
    description: "Estimate the first-year costs of having a baby",
    category: "Life Events",
    tags: ["baby", "costs", "child", "expenses", "family"],
    path: "/calculators/life-events/baby-costs",
  },
  // Education calculators
  {
    id: "college-savings",
    name: "College Savings Calculator",
    description: "Plan how much to save for college education",
    category: "Education",
    tags: ["education", "college", "savings", "529", "tuition"],
    path: "/calculators/education/college-savings",
  },
  // Insurance calculators
  {
    id: "life-insurance-needs",
    name: "Life Insurance Needs Calculator",
    description: "Calculate how much life insurance coverage you need",
    category: "Insurance",
    tags: ["insurance", "life", "coverage", "policy", "needs"],
    path: "/calculators/insurance/life-insurance-needs",
  },
  {
    id: "auto-insurance",
    name: "Auto Insurance Calculator",
    description: "Estimate your auto insurance costs and coverage needs",
    category: "Insurance",
    tags: ["insurance", "auto", "car", "vehicle", "coverage"],
    path: "/calculators/insurance/auto-insurance",
  },
  // Tools calculators
  {
    id: "currency-converter",
    name: "Currency Converter",
    description:
      "Convert between different currencies using current exchange rates",
    category: "Tools",
    tags: [
      "currency",
      "exchange",
      "conversion",
      "money",
      "forex",
      "international",
    ],
    path: "/calculators/tools/currency-converter",
  },
  {
    id: "measurement-converter",
    name: "Measurement Converter",
    description: "Convert between different units of measurement",
    category: "Tools",
    tags: [
      "measurement",
      "conversion",
      "units",
      "length",
      "weight",
      "volume",
      "temperature",
    ],
    path: "/calculators/tools/measurement-converter",
  },
  {
    id: "time-calculator",
    name: "Time Calculator",
    description: "Calculate time differences, add/subtract time, and more",
    category: "Tools",
    tags: ["time", "date", "calculator", "difference", "duration"],
    path: "/calculators/tools/time-calculator",
  },
  {
    id: "value-of-time",
    name: "Value of Time Calculator",
    description:
      "Calculate how much your time is worth per hour, minute, day, week, or month",
    category: "Tools",
    tags: ["time", "value", "productivity", "hourly", "salary", "worth"],
    path: "/calculators/tools/value-of-time",
  },
  {
    id: "inflation-calculator",
    name: "Inflation Calculator",
    description:
      "Calculate how inflation affects purchasing power over time and understand historical price changes",
    category: "Tools",
    tags: [
      "inflation",
      "money",
      "purchasing power",
      "historical",
      "prices",
      "cpi",
    ],
    path: "/calculators/tools/inflation",
  },
];

const CalculatorSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCalculators, setFilteredCalculators] = useState<Calculator[]>(
    []
  );
  const navigate = useNavigate();

  // Filter calculators based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCalculators([]);
      return;
    }
    const term = searchQuery.toLowerCase();
    const filtered = allCalculators.filter((calculator) => {
      return (
        calculator.name.toLowerCase().includes(term) ||
        calculator.description.toLowerCase().includes(term) ||
        calculator.category.toLowerCase().includes(term) ||
        calculator.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
    setFilteredCalculators(filtered);
  }, [searchQuery]);

  // Handle calculator selection
  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setSearchQuery("");
  };

  // Toggle the command menu
  const toggleCommandMenu = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div className="relative mx-auto w-full">
      <div
        onClick={toggleCommandMenu}
        className="relative flex items-center rounded-md border border-input bg-white py-2 cursor-pointer px-0 "
      >
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground flex-1">
          Search calculators...
        </span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for calculators..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No calculators found.</CommandEmpty>
          {filteredCalculators.length > 0 && (
            <CommandGroup heading="Calculators">
              {filteredCalculators.map((calculator) => (
                <CommandItem
                  key={calculator.id}
                  onSelect={() => handleSelect(calculator.path)}
                  disabled={calculator.comingSoon}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{calculator.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {calculator.description}{" "}
                      <span className="text-xs text-primary">
                        ({calculator.category})
                      </span>
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
export default CalculatorSearch;
