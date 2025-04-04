import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell,
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
  LabelList, // Added LabelList for Pie chart labels
} from 'recharts';
import { Home, Download, Save, Info, Calendar as CalendarIcon, PlusCircle, XCircle } from 'lucide-react'; // Added CalendarIcon, PlusCircle, XCircle
import { format } from 'date-fns'; // Added for date formatting
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // Added Popover
import { Calendar } from '@/components/ui/calendar'; // Added Calendar
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Added RadioGroup
import { formatCurrency, formatPercentage } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Added cn utility

const CALCULATOR_ID = 'mortgage-payment';

const MORTGAGE_DEFAULTS = {
  homePrice: 350000,
  downPayment: 70000,
  downPaymentPercent: 20,
  loanAmount: 280000,
  interestRate: 6.5,
  loanTerm: 30,
  loanType: 'fixed',
  armType: '5/1',
  armInitialRate: 5.5,
  armAdjustmentRate: 2.0,
  armRateCap: 8.5,
  propertyTaxRate: 1.2,
  homeInsurance: 1200,
  pmi: 0.5,
  includePmi: false, // Changed to false since down payment is 20%
  includePropertyTax: true,
  includeHomeInsurance: true,
  hoaFee: 0,
  paymentFrequency: 'monthly',
  startDate: null,
};

// Interface for custom costs and extra payments (will use later)
interface CustomCost {
  id: string;
  name: string;
  amount: number;
}

interface ExtraPayment {
  id: string;
  amount: number;
  date?: Date; // For one-time
  frequency?: 'monthly' | 'yearly' | 'one-time'; // For recurring/one-time
  startPaymentNumber?: number; // Alternative for recurring
  endPaymentNumber?: number; // Alternative for recurring
}

const MortgagePaymentCalculator = () => {
  const { toast } = useToast();
  const [homePrice, setHomePrice] = useState(MORTGAGE_DEFAULTS.homePrice);
  const [downPayment, setDownPayment] = useState(MORTGAGE_DEFAULTS.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(MORTGAGE_DEFAULTS.downPaymentPercent);
  const [loanAmount, setLoanAmount] = useState(MORTGAGE_DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(MORTGAGE_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState(MORTGAGE_DEFAULTS.loanTerm);
  const [loanType, setLoanType] = useState<'fixed' | 'arm'>(MORTGAGE_DEFAULTS.loanType as 'fixed' | 'arm');
  const [armType, setArmType] = useState(MORTGAGE_DEFAULTS.armType);
  const [armInitialRate, setArmInitialRate] = useState(MORTGAGE_DEFAULTS.armInitialRate);
  const [armAdjustmentRate, setArmAdjustmentRate] = useState(MORTGAGE_DEFAULTS.armAdjustmentRate);
  const [armRateCap, setArmRateCap] = useState(MORTGAGE_DEFAULTS.armRateCap);
  const [propertyTaxRate, setPropertyTaxRate] = useState(MORTGAGE_DEFAULTS.propertyTaxRate);
  const [homeInsurance, setHomeInsurance] = useState(MORTGAGE_DEFAULTS.homeInsurance);
  const [pmi, setPmi] = useState(MORTGAGE_DEFAULTS.pmi);
  const [includePmi, setIncludePmi] = useState(MORTGAGE_DEFAULTS.includePmi);
  const [includePropertyTax, setIncludePropertyTax] = useState(MORTGAGE_DEFAULTS.includePropertyTax);
  const [includeHomeInsurance, setIncludeHomeInsurance] = useState(MORTGAGE_DEFAULTS.includeHomeInsurance);
  const [hoaFee, setHoaFee] = useState(MORTGAGE_DEFAULTS.hoaFee); // Added HOA state
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'bi-weekly'>(MORTGAGE_DEFAULTS.paymentFrequency as 'monthly' | 'bi-weekly'); // Added frequency state
  const [startDate, setStartDate] = useState<Date | undefined>(MORTGAGE_DEFAULTS.startDate ? new Date(MORTGAGE_DEFAULTS.startDate) : undefined); // Added start date state
  // State for other costs and extra payments (will add UI later)
  const [otherCosts, setOtherCosts] = useState<CustomCost[]>([]);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);

  const [activeTab, setActiveTab] = useState('payment');
  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);

  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setHomePrice(savedData.homePrice || MORTGAGE_DEFAULTS.homePrice);
      setDownPayment(savedData.downPayment || MORTGAGE_DEFAULTS.downPayment);
      setDownPaymentPercent(savedData.downPaymentPercent || MORTGAGE_DEFAULTS.downPaymentPercent);
      setInterestRate(savedData.interestRate || MORTGAGE_DEFAULTS.interestRate);
      setLoanTerm(savedData.loanTerm || MORTGAGE_DEFAULTS.loanTerm);
      setLoanType(savedData.loanType || MORTGAGE_DEFAULTS.loanType);
      setArmType(savedData.armType || MORTGAGE_DEFAULTS.armType);
      setArmInitialRate(savedData.armInitialRate || MORTGAGE_DEFAULTS.armInitialRate);
      setArmAdjustmentRate(savedData.armAdjustmentRate || MORTGAGE_DEFAULTS.armAdjustmentRate);
      setArmRateCap(savedData.armRateCap || MORTGAGE_DEFAULTS.armRateCap);
      setPropertyTaxRate(savedData.propertyTaxRate || MORTGAGE_DEFAULTS.propertyTaxRate);
      setHomeInsurance(savedData.homeInsurance || MORTGAGE_DEFAULTS.homeInsurance);
      setPmi(savedData.pmi || MORTGAGE_DEFAULTS.pmi);
      setIncludePmi(savedData.includePmi ?? MORTGAGE_DEFAULTS.includePmi);
      setIncludePropertyTax(savedData.includePropertyTax ?? MORTGAGE_DEFAULTS.includePropertyTax);
      setIncludeHomeInsurance(savedData.includeHomeInsurance ?? MORTGAGE_DEFAULTS.includeHomeInsurance);
      setHoaFee(savedData.hoaFee || MORTGAGE_DEFAULTS.hoaFee); // Load HOA
      setPaymentFrequency(savedData.paymentFrequency || MORTGAGE_DEFAULTS.paymentFrequency); // Load frequency
      setStartDate(savedData.startDate ? new Date(savedData.startDate) : undefined); // Load start date
      // Load other costs and extra payments if saved (will implement saving later)
      setOtherCosts(savedData.otherCosts || []); // Load other costs
      // Ensure amounts are numbers
      setExtraPayments((savedData.extraPayments || []).map((p: any) => ({ 
        ...p, 
        date: p.date ? new Date(p.date) : undefined, // Rehydrate dates
        amount: Number(p.amount || 0) 
      }))); // Load extra payments
      setDataStored(true);
    }
  }, []);

  useEffect(() => {
    const newDownPaymentPercent = (downPayment / homePrice) * 100;
    setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    
    const newLoanAmount = homePrice - downPayment;
    setLoanAmount(newLoanAmount);
    
    if (newDownPaymentPercent >= 20 && includePmi) {
      setIncludePmi(false);
    } else if (newDownPaymentPercent < 20 && !includePmi) {
      setIncludePmi(true);
    }
  }, [homePrice, downPayment]);

  const handleDownPaymentPercentChange = (newPercentage: number) => {
    setDownPaymentPercent(newPercentage);
    const newDownPayment = (homePrice * newPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  useEffect(() => {
    calculateMortgage();
  }, [
    loanAmount, interestRate, loanTerm, 
    propertyTaxRate, homeInsurance, pmi, 
    includePmi, includePropertyTax, includeHomeInsurance, 
    loanType, armInitialRate, armAdjustmentRate, armRateCap, armType,
    hoaFee, paymentFrequency, startDate, otherCosts, extraPayments // Added otherCosts and extraPayments dependencies
  ]);

  const calculateMortgage = () => {
    // Basic validation
    if (loanAmount <= 0 || loanTerm <= 0) {
      setResults(null);
      setAmortizationData([]);
      return;
    }

    const annualRate = (loanType === 'fixed' ? interestRate : armInitialRate) / 100; // Convert to decimal
    
    // Bi-weekly payments (26 per year) pay off the loan faster than monthly (12 per year)
    // because you end up making 13 monthly-equivalent payments per year instead of 12
    const periodsPerYear = paymentFrequency === 'monthly' ? 12 : 26;
    const ratePerPeriod = annualRate / periodsPerYear;
    
    // This calculates the total number of periods differently for monthly vs bi-weekly
    const totalNumberOfPayments = loanTerm * periodsPerYear;

    // Calculate base payment using standard mortgage amortization formula
    let basePaymentPerPeriod = 0;
    if (ratePerPeriod > 0) {
      // For bi-weekly payments, we need to adjust how the payment is calculated
      // We calculate a monthly payment equivalent first, then for bi-weekly we divide by 2
      if (paymentFrequency === 'monthly') {
        const numerator = loanAmount * ratePerPeriod * Math.pow(1 + ratePerPeriod, totalNumberOfPayments);
        const denominator = Math.pow(1 + ratePerPeriod, totalNumberOfPayments) - 1;
        basePaymentPerPeriod = numerator / denominator;
      } else {
        // For bi-weekly, we first calculate what a monthly payment would be on a loan of the same amount and rate
        const monthlyRatePerPeriod = annualRate / 12;
        const monthlyTotalPayments = loanTerm * 12;
        const monthlyNumerator = loanAmount * monthlyRatePerPeriod * Math.pow(1 + monthlyRatePerPeriod, monthlyTotalPayments);
        const monthlyDenominator = Math.pow(1 + monthlyRatePerPeriod, monthlyTotalPayments) - 1;
        const monthlyPayment = monthlyNumerator / monthlyDenominator;
        
        // Then divide by 2 to get bi-weekly payment (NOT by 2.17, which would just spread monthly payment)
        basePaymentPerPeriod = monthlyPayment / 2;
      }
    } else {
      basePaymentPerPeriod = loanAmount / totalNumberOfPayments;
    }

    // Calculate periodic costs
    const periodicPropertyTax = includePropertyTax ? (homePrice * (propertyTaxRate / 100)) / periodsPerYear : 0;
    const periodicHomeInsurance = includeHomeInsurance ? homeInsurance / periodsPerYear : 0;
    const periodicPmi = includePmi && downPaymentPercent < 20 ? (loanAmount * (pmi / 100)) / periodsPerYear : 0;
    const periodicHoaFee = hoaFee / periodsPerYear;
    const periodicOtherCostsTotal = otherCosts.reduce((sum, cost) => sum + (cost.amount / periodsPerYear), 0);

    const totalPaymentPerPeriod = basePaymentPerPeriod + periodicPropertyTax + periodicHomeInsurance + periodicPmi + periodicHoaFee + periodicOtherCostsTotal;

    const loanToValueRatio = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;

    // --- Generate Amortization Schedule ---
    const fullSchedule = generateAmortizationSchedule(
      loanAmount,
      annualRate, // Pass annual rate for PMI check and ARM logic
      loanTerm, // Pass loan term in years
      basePaymentPerPeriod, // P&I payment per period
      pmi / 100, // PMI rate as decimal
      homePrice, // Needed for LTV check
      startDate,
      paymentFrequency,
      loanType === 'arm' ? {
        initialRate: armInitialRate / 100, // Annual ARM rates
        adjustmentRate: armAdjustmentRate / 100, // Max adjustment per period (annual)
        rateCap: armRateCap / 100, // Lifetime cap (annual)
        initialFixedPeriods: parseInt(armType.split('/')[0], 10) * periodsPerYear,
        adjustmentFrequencyPeriods: parseInt(armType.split('/')[1], 10) * periodsPerYear,
      } : undefined,
      extraPayments // Pass extra payments
    );

    // --- Calculate Totals from the *full* schedule ---
    const lastPayment = fullSchedule.length > 0 ? fullSchedule[fullSchedule.length - 1] : null;
    const totalPrincipalPaid = loanAmount; // Should always equal loan amount if paid off
    const totalInterestPaid = fullSchedule.reduce((sum, p) => sum + p.interestPayment, 0);
    const totalPmiPaid = fullSchedule.reduce((sum, p) => sum + p.pmiPayment, 0);
    
    // Recalculate totals including taxes/insurance/HOA/Other based on the *actual* number of payments made
    const actualNumberOfPayments = fullSchedule.length;
    const totalPropertyTaxPaid = periodicPropertyTax * actualNumberOfPayments;
    const totalHomeInsurancePaid = periodicHomeInsurance * actualNumberOfPayments;
    const totalHoaPaid = periodicHoaFee * actualNumberOfPayments;
    const totalOtherCostsPaid = periodicOtherCostsTotal * actualNumberOfPayments; // Added total other costs

    const totalPaid = totalPrincipalPaid + totalInterestPaid + totalPropertyTaxPaid + totalHomeInsurancePaid + totalPmiPaid + totalHoaPaid + totalOtherCostsPaid; // Add HOA & Other Costs

    setResults({
      principalAndInterest: basePaymentPerPeriod, // P&I per period
      periodicPropertyTax,
      periodicHomeInsurance,
      periodicPmi: periodicPmi, // Base PMI per period (may stop early)
      periodicHoaFee,
      periodicOtherCosts: periodicOtherCostsTotal, // Added periodic other costs
      totalPaymentPerPeriod, // Base total per period (P&I + Tax + Ins + PMI + HOA + Other)
      loanToValueRatio, // Stays the same
      totalInterestPaid, // Use calculated total
      totalPrincipalPaid, // Use accurate total from schedule
      totalPropertyTaxPaid, // Use accurate total
      totalHomeInsurancePaid, // Use accurate total
      totalPmiPaid, // Use accurate total from schedule
      totalHoaPaid, // Use accurate total
      totalOtherCostsPaid, // Added total other costs paid
      totalPaid, // Use accurate grand total
      payoffDate: lastPayment?.date, // Get from schedule
      // Add total paid to date later
      // Add total breakdown later
    });

    // Store the full schedule for download, but maybe only yearly for chart
    // For now, store full schedule for chart too, might need optimization later
    setAmortizationData(fullSchedule); 
  };

  // --- Refactored Amortization Schedule Generator ---
  const generateAmortizationSchedule = (
    initialLoanAmount: number,
    initialAnnualRate: number, // Pass annual rate for easier ARM logic
    loanTermYears: number,
    basePaymentPerPeriod: number, // P&I only
    annualPmiRate: number, // As decimal (e.g., 0.005 for 0.5%)
    initialHomePrice: number, // For LTV calculation
    startDate?: Date,
    frequency: 'monthly' | 'bi-weekly' = 'monthly',
    armOptions?: {
      initialRate: number; // Annual
      adjustmentRate: number; // Max annual adjustment rate change per period
      rateCap: number; // Lifetime annual rate cap
      initialFixedPeriods: number;
      adjustmentFrequencyPeriods: number;
    },
    extraPayments: ExtraPayment[] = []
  ): any[] => {
    const periodsPerYear = frequency === 'monthly' ? 12 : 26;
    // Keep totalNumberOfPayments for loop termination and ARM remaining period calculation
    const totalNumberOfPayments = loanTermYears * periodsPerYear; 
    
    let currentAnnualRate = armOptions ? armOptions.initialRate : initialAnnualRate; // initialAnnualRate is already decimal
    let currentRatePerPeriod = currentAnnualRate / periodsPerYear;
    
    // Use the passed-in basePaymentPerPeriod directly. This is the core fix.
    // This value is already calculated correctly in calculateMortgage for both monthly and accelerated bi-weekly.
    let currentPiPayment = basePaymentPerPeriod; 

    let balance = initialLoanAmount;
    const schedule = [];
    let cumulativeInterestPaid = 0;
    let cumulativePrincipalPaid = 0;
    let cumulativePmiPaid = 0;
    let cumulativeExtraPaid = 0;
    let currentDate = startDate ? new Date(startDate.getTime()) : new Date();

    // Sort extra payments for efficient lookup (handle different types later)
    const oneTimeExtraPayments = extraPayments
      .filter(p => p.frequency === 'one-time' && p.date)
      .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());
    // TODO: Add logic for recurring extra payments

    let oneTimePaymentIndex = 0;

    for (let paymentNumber = 1; paymentNumber <= totalNumberOfPayments && balance > 0.005; paymentNumber++) {
      // --- Date Calculation ---
      let paymentDate = new Date(currentDate.getTime());
      if (paymentNumber > 1) {
        if (frequency === 'monthly') {
          let currentMonth = paymentDate.getMonth();
          paymentDate.setMonth(currentMonth + 1);
          if (paymentDate.getMonth() !== (currentMonth + 1) % 12) {
            paymentDate.setDate(0);
          }
        } else { // bi-weekly
          paymentDate.setDate(paymentDate.getDate() + 14);
        }
      }
      currentDate = paymentDate;

      // --- ARM Adjustment Check ---
      let rateAdjustedThisPeriod = false;
      if (armOptions && paymentNumber > armOptions.initialFixedPeriods &&
          (paymentNumber - armOptions.initialFixedPeriods - 1) % armOptions.adjustmentFrequencyPeriods === 0) {
        
        rateAdjustedThisPeriod = true;
        // Calculate potential new rate based on previous *annual* rate
        // Note: Real ARM adjustments often depend on an index + margin, this is simplified
        const potentialNewAnnualRate = currentAnnualRate + armOptions.adjustmentRate; // Simplistic adjustment
        const cappedRate = Math.min(potentialNewAnnualRate, armOptions.rateCap); // Apply lifetime cap
        // Also consider periodic caps if needed (e.g., max 2% change per adjustment) - not implemented here
        currentAnnualRate = Math.max(cappedRate, 0); // Ensure rate doesn't go below 0
        currentRatePerPeriod = currentAnnualRate / periodsPerYear;

        // Recalculate P&I payment
        const remainingPayments = totalNumberOfPayments - paymentNumber + 1;
        if (currentRatePerPeriod > 0 && balance > 0) {
          currentPiPayment = balance * (currentRatePerPeriod * Math.pow(1 + currentRatePerPeriod, remainingPayments)) /
                             (Math.pow(1 + currentRatePerPeriod, remainingPayments) - 1);
        } else if (remainingPayments > 0) {
          currentPiPayment = balance / remainingPayments;
        } else {
          currentPiPayment = balance; // Pay off remaining balance
        }
      }

      // --- Interest and Principal Calculations ---
      const interestPayment = balance * currentRatePerPeriod;
      let basePaymentForPeriod = currentPiPayment;

      // --- PMI Calculation ---
      let pmiPayment = 0;
      const currentLTV = initialHomePrice > 0 ? (balance / initialHomePrice) * 100 : 100;
      if (includePmi && currentLTV > 80) {
        pmiPayment = (initialLoanAmount * annualPmiRate) / periodsPerYear;
      }

      // Validate and adjust payments if needed
      if (balance < (currentPiPayment - interestPayment)) {
        const finalInterestPayment = balance * currentRatePerPeriod;
        basePaymentForPeriod = finalInterestPayment + balance;
        currentPiPayment = basePaymentForPeriod;
      }

      // Calculate base principal payment
      let totalPrincipalPayment = basePaymentForPeriod - interestPayment;

      // --- Apply Extra Payments ---
      let extraPrincipalPaid = 0;
      
      // Apply One-Time Payments scheduled for on or before this payment date
      while (
        oneTimePaymentIndex < oneTimeExtraPayments.length &&
        oneTimeExtraPayments[oneTimePaymentIndex].date && // Ensure date exists
        (oneTimeExtraPayments[oneTimePaymentIndex].date as Date).getTime() <= paymentDate.getTime()
      ) {
        // Only apply if the amount is positive
        if (oneTimeExtraPayments[oneTimePaymentIndex].amount > 0) {
           extraPrincipalPaid += oneTimeExtraPayments[oneTimePaymentIndex].amount;
        }
        oneTimePaymentIndex++; // Move to the next potential one-time payment
      }

      // TODO: Implement recurring extra payment logic (monthly, yearly)
      // Example placeholder for monthly:
      // const monthlyExtra = extraPayments.find(p => p.frequency === 'monthly');
      // if (monthlyExtra && paymentNumber >= (monthlyExtra.startPaymentNumber || 1) && paymentNumber <= (monthlyExtra.endPaymentNumber || totalNumberOfPayments)) {
      //    extraPrincipalPaid += monthlyExtra.amount;
      // }
      // Example placeholder for yearly:
      // const yearlyExtra = extraPayments.find(p => p.frequency === 'yearly');
      // if (yearlyExtra && paymentDate.getMonth() === (yearlyExtra.date?.getMonth() ?? 0) && paymentNumber >= (yearlyExtra.startPaymentNumber || 1) && paymentNumber <= (yearlyExtra.endPaymentNumber || totalNumberOfPayments)) {
      //    // Check if it's the correct month for the yearly payment
      //    extraPrincipalPaid += yearlyExtra.amount;
      // }

      // Add the extra payment to total principal payment
      totalPrincipalPayment += extraPrincipalPaid;

      // --- Final Payment Adjustment ---
      if (totalPrincipalPayment >= balance - 0.005) {
        extraPrincipalPaid += (totalPrincipalPayment - balance); // Adjust extra paid if it caused overshoot
        totalPrincipalPayment = balance; // Principal is exactly the remaining balance
        basePaymentForPeriod = totalPrincipalPayment + interestPayment; // Adjust base payment
        currentPiPayment = basePaymentForPeriod; // Update current P&I
        // Final payment might not have PMI if LTV drops below threshold
        if (((balance - totalPrincipalPayment) / initialHomePrice) * 100 <= 80) {
            pmiPayment = 0;
        }
      }

      // --- Update Cumulative Totals ---
      cumulativeInterestPaid += interestPayment;
      cumulativePrincipalPaid += totalPrincipalPayment; // Includes extra payments
      cumulativePmiPaid += pmiPayment;
      cumulativeExtraPaid += extraPrincipalPaid;

      const startingBalance = balance;
      balance -= totalPrincipalPayment; // Reduce balance by total principal paid (base + extra)
      if (balance < 0) balance = 0;

      // --- Store Schedule Entry ---
      schedule.push({
        paymentNumber,
        date: paymentDate,
        year: paymentDate.getFullYear(),
        month: paymentDate.getMonth() + 1,
        startingBalance: startingBalance,
        principalPayment: totalPrincipalPayment - extraPrincipalPaid, // Base principal
        interestPayment,
        pmiPayment,
        extraPrincipalPaid,
        totalPayment: currentPiPayment + pmiPayment + extraPrincipalPaid, // P&I + PMI + Extra
        cumulativeInterestPaid,
        cumulativePrincipalPaid, // Includes extra
        cumulativePmiPaid,
        cumulativeExtraPaid,
        remainingBalance: balance,
        currentAnnualRate: currentAnnualRate * 100,
        ltv: currentLTV,
        rateAdjusted: rateAdjustedThisPeriod, // Flag if rate changed this period
      });

      if (balance <= 0.005) break; // Exit loop if balance is paid off
    }

    return schedule;
  };

  const handleSaveData = () => {
    const dataToSave = {
      homePrice,
      downPayment,
      downPaymentPercent,
      interestRate,
      loanTerm,
      loanType,
      armType,
      armInitialRate,
      armAdjustmentRate, 
      armRateCap,
      propertyTaxRate,
      homeInsurance,
      pmi,
      includePmi,
      includePropertyTax,
      includeHomeInsurance,
      hoaFee, // Save HOA
      paymentFrequency, // Save frequency
      startDate: startDate?.toISOString(), // Save start date as ISO string
      otherCosts, // Save other costs
      extraPayments: extraPayments.map(p => ({...p, date: p.date?.toISOString()})), // Save extra payments (serialize dates)
      timestamp: Date.now()
    };
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your mortgage calculator data has been saved locally.",
    });
  };

  const handleDownloadCSV = () => {
    if (!amortizationData.length) return;
    
    let csvHeader = "Payment Number,Year,";
    // --- Update CSV Download ---
    let csvContent = "Payment #,Date,Year,Month,Start Balance,Principal,Interest,PMI,Extra Principal,Total Payment,End Balance,Cumulative Interest,Cumulative Principal,Cumulative PMI,Cumulative Extra,Annual Rate (%),LTV (%)\n";
    amortizationData.forEach((p) => {
      const row = [
        p.paymentNumber,
        format(p.date, 'yyyy-MM-dd'),
        p.year,
        p.month,
        p.startingBalance.toFixed(2),
        p.principalPayment.toFixed(2), // Base principal
        p.interestPayment.toFixed(2),
        p.pmiPayment.toFixed(2),
        p.extraPrincipalPaid.toFixed(2),
        p.totalPayment.toFixed(2),
        p.remainingBalance.toFixed(2),
        p.cumulativeInterestPaid.toFixed(2),
        p.cumulativePrincipalPaid.toFixed(2), // Includes extra
        p.cumulativePmiPaid.toFixed(2),
        p.cumulativeExtraPaid.toFixed(2),
        p.currentAnnualRate.toFixed(3),
        p.ltv.toFixed(2)
      ].join(',');
      csvContent += row + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mortgage-amortization-schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPieChartData = () => {
    if (!results) return [];

    const data = [
      {
        name: 'Principal & Interest',
        value: results.principalAndInterest, // This is P&I per period
        color: '#1e40af', // Dark Blue
      },
    ];

    if (results.periodicPropertyTax > 0) {
      data.push({
        name: 'Property Tax',
        value: results.periodicPropertyTax,
        color: '#3b82f6', // Medium Blue
      });
    }

    if (results.periodicHomeInsurance > 0) {
      data.push({
        name: 'Home Insurance',
        value: results.periodicHomeInsurance,
        color: '#60a5fa', // Light Blue
      });
    }

    if (results.periodicPmi > 0) {
      data.push({
        name: 'PMI',
        value: results.periodicPmi,
        color: '#93c5fd', // Very Light Blue
      });
    }
    
    if (results.periodicHoaFee > 0) { // Added HOA
      data.push({
        name: 'HOA Fee',
        value: results.periodicHoaFee,
        color: '#bfdbfe', // Palest Blue
      });
    }
    // Add Other Costs to Pie Chart
    otherCosts.forEach((cost, index) => {
       if (cost.amount > 0) {
         data.push({
           name: cost.name || `Other Cost ${index + 1}`,
           value: cost.amount / (paymentFrequency === 'monthly' ? 12 : 26),
           color: `hsl(210, 40%, ${70 + index * 5}%)` // Varying shades of blue/grey
         });
       }
    });

    return data;
  };

  // Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <span style={{ color: data.color, fontWeight: 'bold' }}>{data.name}</span>: {formatCurrency(data.value)}
        </div>
      );
    }
    return null;
  };

  // Tooltip for Amortization Line Chart
  const CustomAmortizationTooltip = ({ active, payload, label }: any) => {
    // Find the specific data point corresponding to the hovered label (paymentNumber)
    // Note: The 'label' provided by Recharts might be the x-axis value (date or year). 
    // We need to find the corresponding full data point from our schedule.
    // This lookup might need refinement depending on how Recharts passes the label for time-based axes.
    // Assuming payload[0].payload contains the data for the hovered point for now.
    if (active && payload && payload.length && payload[0].payload) {
       const dataPoint = payload[0].payload;
       const displayLabel = startDate ? format(dataPoint.date, 'MMM yyyy') : `Payment ${dataPoint.paymentNumber}`;

       return (
         <div className="bg-white p-3 border rounded shadow-sm text-xs">
           <p className="font-semibold mb-1">{displayLabel}</p>
           <p style={{ color: '#1e40af' }}> {/* Blue */}
             Balance: {formatCurrency(dataPoint.remainingBalance)}
           </p>
           <p style={{ color: '#22c55e' }}> {/* Green */}
             Principal Paid (Cumulative): {formatCurrency(dataPoint.cumulativePrincipalPaid)}
           </p>
           <p style={{ color: '#ef4444' }}> {/* Red */}
             Interest Paid (Cumulative): {formatCurrency(dataPoint.cumulativeInterestPaid)}
           </p>
           {dataPoint.extraPrincipalPaid > 0 && (
              <p className="text-gray-600">
                Extra Payment This Period: {formatCurrency(dataPoint.extraPrincipalPaid)}
              </p>
           )}
            {dataPoint.rateAdjusted && (
              <p className="text-amber-600">
                Rate Adjusted: {dataPoint.currentAnnualRate.toFixed(3)}%
              </p>
           )}
         </div>
       );
    }
    return null;
  };

  // --- State Management for Other Costs ---
  const addOtherCost = () => {
    setOtherCosts([...otherCosts, { id: crypto.randomUUID(), name: '', amount: 0 }]);
  };

  const removeOtherCost = (id: string) => {
    setOtherCosts(otherCosts.filter(cost => cost.id !== id));
  };

  const updateOtherCost = (id: string, field: 'name' | 'amount', value: string | number) => {
    setOtherCosts(otherCosts.map(cost => 
      cost.id === id ? { ...cost, [field]: field === 'amount' ? Number(value) : value } : cost
    ));
  };

  // --- State Management for Extra Payments ---
   const addExtraPayment = () => {
     setExtraPayments([...extraPayments, { 
       id: crypto.randomUUID(), 
       amount: 0, 
       frequency: 'one-time', // Default to one-time
       date: new Date() // Default to today
     }]);
   };

   const removeExtraPayment = (id: string) => {
     setExtraPayments(extraPayments.filter(p => p.id !== id));
   };

   const updateExtraPayment = (id: string, field: keyof ExtraPayment, value: any) => {
     setExtraPayments(extraPayments.map(p => 
       p.id === id ? { ...p, [field]: value } : p
     ));
   };
  
  const getArmDescription = () => {
    const initialPeriod = parseInt(armType.split('/')[0], 10);
    const adjustmentFrequency = parseInt(armType.split('/')[1], 10);
    
    return `${initialPeriod} years fixed at ${armInitialRate}%, then adjusts every ${adjustmentFrequency} year(s) by up to ${armAdjustmentRate}% (capped at ${armRateCap}%)`;
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Home className="h-6 w-6" />
              Mortgage Payment Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculate your monthly mortgage payment including principal, interest, taxes, and insurance
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="homePrice" className="calculator-label">Home Price</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The total purchase price of the home.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="downPayment" className="calculator-label">Down Payment</Label>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80 text-xs">The amount you'll pay upfront. Usually 3-20% of the home price.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">$</span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="calculator-input"
                    min={0}
                    max={homePrice}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="downPaymentPercent" className="calculator-label">Down Payment Percentage</Label>
                <span className="text-sm font-medium">{downPaymentPercent}%</span>
              </div>
              <Slider
                id="downPaymentPercent"
                value={[downPaymentPercent]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={(value) => handleDownPaymentPercentChange(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>20%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanType" className="calculator-label">Loan Type</Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Fixed-rate mortgages maintain the same interest rate for the entire loan term. Adjustable-rate mortgages (ARMs) have an initial fixed period, then adjust periodically.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Select
                value={loanType}
                onValueChange={(value: 'fixed' | 'arm') => setLoanType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Rate</SelectItem>
                  <SelectItem value="arm">Adjustable Rate (ARM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {loanType === 'fixed' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="interestRate" className="calculator-label">Interest Rate (%)</Label>
                  <span className="text-sm font-medium">{interestRate}%</span>
                </div>
                <Slider
                  id="interestRate"
                  value={[interestRate]}
                  min={0}
                  max={15}
                  step={0.125}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label htmlFor="armType" className="calculator-label">ARM Type</Label>
                  <Select
                    value={armType}
                    onValueChange={setArmType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ARM type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3/1">3/1 ARM</SelectItem>
                      <SelectItem value="5/1">5/1 ARM</SelectItem>
                      <SelectItem value="7/1">7/1 ARM</SelectItem>
                      <SelectItem value="10/1">10/1 ARM</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {armType.split('/')[0]} years fixed, then adjusts every {armType.split('/')[1]} year(s)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="armInitialRate" className="calculator-label">Initial Rate (%)</Label>
                    <Input
                      id="armInitialRate"
                      type="number"
                      value={armInitialRate}
                      onChange={(e) => setArmInitialRate(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={15}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="armAdjustmentRate" className="calculator-label">Adjustment (%)</Label>
                    <Input
                      id="armAdjustmentRate"
                      type="number"
                      value={armAdjustmentRate}
                      onChange={(e) => setArmAdjustmentRate(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="armRateCap" className="calculator-label">Rate Cap (%)</Label>
                    <Input
                      id="armRateCap"
                      type="number"
                      value={armRateCap}
                      onChange={(e) => setArmRateCap(Number(e.target.value))}
                      step={0.125}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanTerm" className="calculator-label">Loan Term (Years)</Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">The length of time you have to repay the loan. Common terms are 15 or 30 years.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Select
                value={loanTerm.toString()}
                onValueChange={(value) => setLoanTerm(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 years</SelectItem>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="30">30 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Frequency */}
            <div className="space-y-2">
              <Label className="calculator-label">Payment Frequency</Label>
              <RadioGroup 
                defaultValue={paymentFrequency} 
                onValueChange={(value: 'monthly' | 'bi-weekly') => setPaymentFrequency(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bi-weekly" id="bi-weekly" />
                  <Label htmlFor="bi-weekly">Bi-Weekly</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">Bi-weekly payments can help pay off your mortgage faster.</p>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label htmlFor="startDate" className="calculator-label">Optional: First Payment Date</Label>
                 <TooltipProvider>
                   <UITooltip>
                     <TooltipTrigger asChild>
                       <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                     </TooltipTrigger>
                     <TooltipContent>
                       <p className="w-80 text-xs">Select the date of your first mortgage payment to see a projected payoff date.</p>
                     </TooltipContent>
                   </UITooltip>
                 </TooltipProvider>
               </div>
               <Popover>
                 <PopoverTrigger asChild>
                   <Button
                     variant={"outline"}
                     className={cn(
                       "w-full justify-start text-left font-normal",
                       !startDate && "text-muted-foreground"
                     )}
                   >
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0">
                   <Calendar
                     mode="single"
                     selected={startDate}
                     onSelect={setStartDate}
                     initialFocus
                   />
                 </PopoverContent>
               </Popover>
             </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Additional Costs</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeTaxes" 
                    checked={includePropertyTax}
                    onCheckedChange={setIncludePropertyTax}
                  />
                  <Label htmlFor="includeTaxes">Include Property Taxes</Label>
                </div>
                {includePropertyTax && (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="propertyTaxRate"
                      type="number"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                      className="w-16 h-8 text-sm"
                      step={0.1}
                      min={0}
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeInsurance" 
                    checked={includeHomeInsurance}
                    onCheckedChange={setIncludeHomeInsurance}
                  />
                  <Label htmlFor="includeInsurance">Include Home Insurance</Label>
                </div>
                {includeHomeInsurance && (
                  <div className="flex items-center">
                    <span className="mr-1 text-sm">$</span>
                    <Input
                      id="homeInsurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                      min={0}
                    />
                    <span className="ml-1 text-sm">/year</span>
                  </div>
                )}
              </div>

              {/* HOA Fee */}
               <div className="flex items-center justify-between">
                 <Label htmlFor="hoaFee" className="calculator-label flex items-center">
                   HOA Fee (Optional)
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-xs">Homeowners Association fees, if applicable. Enter the monthly amount.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                 </Label>
                 <div className="flex items-center">
                   <span className="mr-1 text-sm">$</span>
                   <Input
                     id="hoaFee"
                     type="number"
                     value={hoaFee}
                     onChange={(e) => setHoaFee(Number(e.target.value))}
                     className="w-24 h-8 text-sm"
                     min={0}
                   />
                   <span className="ml-1 text-sm">/month</span>
                 </div>
               </div>
              
              {/* Other Costs Section */}
              <div className="space-y-3 border-t pt-4">
                 <div className="flex justify-between items-center">
                   <h3 className="text-sm font-medium">Other Monthly Costs (Optional)</h3>
                   <Button variant="outline" size="sm" onClick={addOtherCost}>
                     <PlusCircle className="h-4 w-4 mr-1" /> Add Cost
                   </Button>
                 </div>
                 {otherCosts.map((cost, index) => (
                   <div key={cost.id} className="flex items-center space-x-2">
                     <Input
                       type="text"
                       placeholder={`Cost ${index + 1} Name`}
                       value={cost.name}
                       onChange={(e) => updateOtherCost(cost.id, 'name', e.target.value)}
                       className="h-8 text-sm flex-grow"
                     />
                     <div className="flex items-center">
                       <span className="mr-1 text-sm">$</span>
                       <Input
                         type="number"
                         value={cost.amount}
                         onChange={(e) => updateOtherCost(cost.id, 'amount', e.target.value)}
                         className="w-24 h-8 text-sm"
                         min={0}
                       />
                        <span className="ml-1 text-sm">/year</span> 
                     </div>
                     <Button variant="ghost" size="sm" onClick={() => removeOtherCost(cost.id)} className="text-red-500 hover:text-red-700">
                       <XCircle className="h-4 w-4" />
                     </Button>
                   </div>
                 ))}
               </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includePmi" 
                    checked={includePmi && downPaymentPercent < 20}
                    onCheckedChange={setIncludePmi}
                    disabled={downPaymentPercent >= 20}
                  />
                  <Label htmlFor="includePmi" className={downPaymentPercent >= 20 ? "text-muted-foreground" : ""}>
                    Include PMI
                    {downPaymentPercent >= 20 && <span className="text-xs ml-1">(Not needed with 20%+ down)</span>}
                  </Label>
                </div>
                {includePmi && downPaymentPercent < 20 && (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="pmi"
                      type="number"
                      value={pmi}
                      onChange={(e) => setPmi(Number(e.target.value))}
                      className="w-16 h-8 text-sm"
                      step={0.05}
                      min={0}
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
             </div>

             {/* Extra Payments Section */}
             <div className="space-y-3 border-t pt-4">
               <div className="flex justify-between items-center">
                 <h3 className="text-sm font-medium">Extra Payments (Optional)</h3>
                 <Button variant="outline" size="sm" onClick={addExtraPayment}>
                   <PlusCircle className="h-4 w-4 mr-1" /> Add Payment
                 </Button>
               </div>
               {extraPayments.map((payment, index) => (
                 <div key={payment.id} className="flex flex-wrap items-center gap-2 border p-2 rounded bg-gray-50">
                   <div className="flex items-center flex-grow min-w-[150px]">
                     <span className="mr-1 text-sm">$</span>
                     <Input
                       type="number"
                       value={payment.amount}
                       onChange={(e) => updateExtraPayment(payment.id, 'amount', Number(e.target.value))}
                       className="w-24 h-8 text-sm"
                       min={0}
                     />
                   </div>
                   <Select 
                      value={payment.frequency} 
                      onValueChange={(value) => updateExtraPayment(payment.id, 'frequency', value)}
                    >
                     <SelectTrigger className="h-8 text-sm w-[120px]">
                       <SelectValue placeholder="Frequency" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="one-time">One-Time</SelectItem>
                       {/* <SelectItem value="monthly">Monthly</SelectItem> */}
                       {/* <SelectItem value="yearly">Yearly</SelectItem> */}
                       {/* TODO: Add recurring options later */}
                     </SelectContent>
                   </Select>
                   {payment.frequency === 'one-time' && (
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant={"outline"}
                           size="sm"
                           className={cn(
                             "h-8 w-[150px] justify-start text-left font-normal text-sm",
                             !payment.date && "text-muted-foreground"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {payment.date ? format(payment.date, "PPP") : <span>Payment Date</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar
                           mode="single"
                           selected={payment.date}
                           onSelect={(date) => updateExtraPayment(payment.id, 'date', date)}
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   )}
                   {/* TODO: Add inputs for recurring start/end */}
                   <Button variant="ghost" size="sm" onClick={() => removeExtraPayment(payment.id)} className="text-red-500 hover:text-red-700 ml-auto">
                     <XCircle className="h-4 w-4" />
                   </Button>
                 </div>
               ))}
               <p className="text-xs text-muted-foreground">Making extra payments towards the principal can significantly shorten your loan term and reduce total interest paid.</p>
             </div>
            
            <div className="pt-2 pb-4">
              <Button 
                className="w-full text-white font-medium" 
                onClick={handleSaveData}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Data Locally
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Data is saved in your browser only. No information is sent to our servers.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {results && (
              <>
                <div className="calculator-panel">
                  <h3 className="text-lg font-medium mb-3">Monthly Payment Summary</h3>
                  {loanType === 'arm' && (
                    <div className="p-2 mb-3 bg-amber-50 border border-amber-200 rounded text-sm">
                      <span className="font-medium">ARM Terms:</span> {getArmDescription()}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-center p-4 bg-finance-primary/5 rounded-lg border">
                      {/* Changed Label based on frequency */}
                      <p className="text-sm text-muted-foreground">Total Payment Per Period ({paymentFrequency === 'monthly' ? 'Monthly' : 'Bi-Weekly'})</p>
                      {/* Used correct results key */}
                      <p className="text-3xl font-bold text-finance-primary mt-1">{formatCurrency(results.totalPaymentPerPeriod)}</p> 
                      {loanType === 'arm' && (
                        <p className="text-xs text-amber-600 mt-1">Initial payment amount; may adjust over time</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2"> {/* Adjusted grid cols */}
                      <div className="p-2 bg-gray-50 rounded border">
                        <p className="text-xs text-muted-foreground">Principal & Interest</p>
                        <p className="text-base font-semibold">{formatCurrency(results.principalAndInterest)}</p> {/* Adjusted font size */}
                      </div>
                      
                      {results.periodicPropertyTax > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Property Tax</p>
                          <p className="text-base font-semibold">{formatCurrency(results.periodicPropertyTax)}</p> {/* Adjusted font size */}
                        </div>
                      )}
                      
                      {results.periodicHomeInsurance > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">Home Insurance</p>
                          <p className="text-base font-semibold">{formatCurrency(results.periodicHomeInsurance)}</p> {/* Adjusted font size */}
                        </div>
                      )}
                      
                      {results.periodicPmi > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">PMI</p>
                          <p className="text-base font-semibold">{formatCurrency(results.periodicPmi)}</p> {/* Adjusted font size */}
                        </div>
                      )}

                      {results.periodicHoaFee > 0 && (
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-muted-foreground">HOA Fee</p>
                          <p className="text-base font-semibold">{formatCurrency(results.periodicHoaFee)}</p>
                        </div>
                      )}
                      
                      {results.periodicOtherCosts > 0 && ( // Added Other Costs display
                        <div className="p-2 bg-gray-50 rounded border col-span-1 sm:col-span-1"> {/* Adjust span if needed */}
                          <p className="text-xs text-muted-foreground">Other Costs</p>
                          <p className="text-base font-semibold">{formatCurrency(results.periodicOtherCosts)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                       <Pie 
                         data={getPieChartData()} 
                         dataKey="value" 
                         nameKey="name" 
                         cx="50%" 
                         cy="50%" 
                         outerRadius={80} 
                         fill="#8884d8"
                         labelLine={false} // Disable default label lines
                       >
                         {getPieChartData().map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                         {/* Add custom labels */}
                         <LabelList 
                           dataKey="name" 
                           position="outside" 
                           offset={15} 
                           stroke="black" 
                           fill="black"
                           fontSize={12}
                           formatter={(value: string) => value} // Display the name
                         />
                       </Pie>
                       <Tooltip content={<CustomPieTooltip />} />
                       <Legend 
                         verticalAlign="bottom" 
                         height={36} 
                         iconSize={10}
                         wrapperStyle={{ fontSize: '0.8rem', marginTop: '10px' }} 
                       />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Results Totals Section */}
                <div className="calculator-panel">
                   <h3 className="text-lg font-medium mb-3">Loan Summary</h3>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                     <div className="font-medium text-muted-foreground">Projected Payoff Date:</div>
                     <div>{results.payoffDate ? format(results.payoffDate, 'MMMM yyyy') : 'N/A'}</div>

                     <div className="font-medium text-muted-foreground">Total Principal Paid:</div>
                     <div>{formatCurrency(results.totalPrincipalPaid)}</div>
                     
                     <div className="font-medium text-muted-foreground">Total Interest Paid:</div>
                     <div>{formatCurrency(results.totalInterestPaid)}</div>

                     {results.totalPropertyTaxPaid > 0 && (
                       <>
                         <div className="font-medium text-muted-foreground">Total Property Tax:</div>
                         <div>{formatCurrency(results.totalPropertyTaxPaid)}</div>
                       </>
                     )}
                     {results.totalHomeInsurancePaid > 0 && (
                       <>
                         <div className="font-medium text-muted-foreground">Total Home Insurance:</div>
                         <div>{formatCurrency(results.totalHomeInsurancePaid)}</div>
                       </>
                     )}
                     {results.totalPmiPaid > 0 && (
                       <>
                         <div className="font-medium text-muted-foreground">Total PMI Paid:</div>
                         <div>{formatCurrency(results.totalPmiPaid)}</div>
                       </>
                     )}
                      {results.totalHoaPaid > 0 && (
                       <>
                         <div className="font-medium text-muted-foreground">Total HOA Fees:</div>
                         <div>{formatCurrency(results.totalHoaPaid)}</div>
                       </>
                     )}
                      {results.totalOtherCostsPaid > 0 && (
                       <>
                         <div className="font-medium text-muted-foreground">Total Other Costs:</div>
                         <div>{formatCurrency(results.totalOtherCostsPaid)}</div>
                       </>
                     )}
                     
                     <div className="font-bold text-base mt-2 col-span-2 border-t pt-2"></div>
                     <div className="font-bold text-base">Total Cost of Loan:</div>
                     <div className="font-bold text-base">{formatCurrency(results.totalPaid)}</div>
                   </div>
                 </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">Amortization Schedule</h3>
                   {results.payoffDate && !startDate && ( // Show only if start date wasn't provided initially
                     <p className="text-sm text-muted-foreground mb-2">
                       Projected Payoff Date: <span className="font-medium">{format(results.payoffDate, 'MMMM yyyy')}</span> 
                       <span className="text-xs"> (Assumes first payment today)</span>
                     </p>
                   )}
                  <ResponsiveContainer width="100%" height={300}>
                    {/* TODO: Refine Amortization Chart */}
                    <LineChart data={amortizationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <XAxis 
                        dataKey={startDate ? "date" : "year"} // Use date if available
                        tickFormatter={(tick) => startDate ? format(new Date(tick), 'yyyy') : tick} // Format date ticks
                        label={{ value: 'Year', position: 'insideBottomRight', offset: -5, style: { fontSize: '0.8rem' } }}
                        tick={{ fontSize: '0.75rem' }}
                        // Consider adding interval="preserveStartEnd" or type="number" domain={['dataMin', 'dataMax']} if needed
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)} 
                        label={{ value: 'Remaining Balance', angle: -90, position: 'outsideLeft', offset: -10, style: { fontSize: '0.8rem' } }} // Increased negative offset
                        tick={{ fontSize: '0.75rem' }}
                        domain={['auto', 'auto']} // Ensure y-axis starts near 0 if appropriate
                        allowDataOverflow={true} // Prevent clipping of labels potentially
                      />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                      <Tooltip content={<CustomAmortizationTooltip />} /> 
                      <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '0.8rem' }}/>
                      <Line 
                        type="monotone" 
                        dataKey="remainingBalance" 
                        name="Remaining Balance" 
                        stroke="#1e40af" 
                        strokeWidth={2} 
                        dot={false} 
                        // connectNulls // Temporarily removed to diagnose potential data gaps
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cumulativePrincipalPaid" 
                        name="Cumulative Principal Paid" 
                        stroke="#22c55e" // Green
                        strokeWidth={2} 
                        dot={false} 
                        // connectNulls
                      />
                       <Line 
                        type="monotone" 
                        dataKey="cumulativeInterestPaid" 
                        name="Cumulative Interest Paid" 
                        stroke="#ef4444" // Red
                        strokeWidth={2} 
                        dot={false} 
                        // connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                   <div className="flex justify-end mt-2">
                     <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                       <Download className="h-4 w-4 mr-1" />
                       Download Full Schedule (CSV)
                     </Button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgagePaymentCalculator;
