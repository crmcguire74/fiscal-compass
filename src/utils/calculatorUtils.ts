
// Calculate compound interest with regular contributions
export const calculateCompoundInterest = (
  principal: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number,
  compoundingFrequency: number,
  interestRateVariance: number = 0 // Added variance parameter with default
): {
  finalBalance: number; // Base calculation
  minFinalBalance?: number; // Min balance with variance
  maxFinalBalance?: number; // Max balance with variance
  totalContributions: number;
  totalInterestEarned: number; // Base calculation
  minTotalInterestEarned?: number; // Min interest with variance
  maxTotalInterestEarned?: number; // Max interest with variance
  yearlyData: Array<{ // Based on base rate for chart simplicity
    year: number;
    balance: number; 
    contributions: number;
    interest: number;
  }>;
} => {
  // Helper function to run the core calculation logic for a given rate
  const runCalculation = (rate: number) => {
    const currentInterestRate = rate / 100;
    const ratePerPeriod = currentInterestRate / compoundingFrequency;
    const totalPeriods = compoundingFrequency * years;
    const contributionPerPeriod = monthlyContribution * 12 / compoundingFrequency;

    let currentBalance = principal;
    let currentTotalContributions = principal;
    let currentYearlyData = [];
    let previousYearBalance = principal;
    let yearlyContributions = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      currentBalance += contributionPerPeriod;
      currentTotalContributions += contributionPerPeriod;
      yearlyContributions += contributionPerPeriod;

      const interestEarned = currentBalance * ratePerPeriod;
      currentBalance += interestEarned;

      // Only store yearly data for the base rate calculation
      if (rate === annualInterestRate && period % compoundingFrequency === 0) {
        const year = period / compoundingFrequency;
        const yearlyInterest = currentBalance - previousYearBalance - yearlyContributions;
        
        currentYearlyData.push({
          year,
          balance: currentBalance,
          contributions: yearlyContributions,
          interest: yearlyInterest
        });

        previousYearBalance = currentBalance;
        yearlyContributions = 0;
      }
    }
    const currentTotalInterestEarned = currentBalance - currentTotalContributions;
    
    return {
      finalBalance: currentBalance,
      totalContributions: currentTotalContributions,
      totalInterestEarned: currentTotalInterestEarned,
      yearlyData: currentYearlyData // Will be empty if not base rate
    };
  };

  // --- Base Calculation ---
  const baseResults = runCalculation(annualInterestRate);
  
  let minResults = null;
  let maxResults = null;

  // --- Variance Calculations (if variance > 0) ---
  if (interestRateVariance > 0) {
    const minRate = Math.max(0, annualInterestRate - interestRateVariance); // Ensure rate doesn't go below 0
    const maxRate = annualInterestRate + interestRateVariance;
    
    minResults = runCalculation(minRate);
    maxResults = runCalculation(maxRate);
  }

  // Return combined results
  return {
    finalBalance: baseResults.finalBalance,
    minFinalBalance: minResults?.finalBalance,
    maxFinalBalance: maxResults?.finalBalance,
    totalContributions: baseResults.totalContributions, // Contributions are the same regardless of rate
    totalInterestEarned: baseResults.totalInterestEarned,
    minTotalInterestEarned: minResults?.totalInterestEarned,
    maxTotalInterestEarned: maxResults?.totalInterestEarned,
    yearlyData: baseResults.yearlyData // Use base rate data for the table/chart
  };
};

// Calculate debt-to-income ratio
export const calculateDTI = (
  monthlyIncome: number,
  debts: { name: string; payment: number }[]
): {
  backEndDTI: number;
  frontEndDTI: number;
  totalDebtPayments: number;
  housingPayment: number;
} => {
  // Safety check
  if (monthlyIncome <= 0) {
    return {
      backEndDTI: 0,
      frontEndDTI: 0,
      totalDebtPayments: 0,
      housingPayment: 0
    };
  }
  
  // Calculate total debt payments
  const totalDebtPayments = debts.reduce((sum, debt) => sum + (debt.payment || 0), 0);
  
  // Calculate housing payment (usually mortgage/rent)
  const housingPayment = debts.find(d => 
    d.name.toLowerCase().includes('mortgage') || 
    d.name.toLowerCase().includes('rent')
  )?.payment || 0;
  
  // Calculate back-end DTI (all debts)
  const backEndDTI = (totalDebtPayments / monthlyIncome) * 100;
  
  // Calculate front-end DTI (housing only)
  const frontEndDTI = (housingPayment / monthlyIncome) * 100;
  
  return {
    backEndDTI,
    frontEndDTI,
    totalDebtPayments,
    housingPayment
  };
};

// Format number as currency (always show cents)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, // Changed to 2
    maximumFractionDigits: 2, // Changed to 2
  }).format(value);
};

// Format number as percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Format large numbers with abbreviations (K, M, B)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else {
    // Use formatCurrency for smaller numbers to ensure cents are shown
    return formatCurrency(value); 
  }
};

// Calculate monthly mortgage payment
export const calculateMonthlyMortgage = (principal: number, annualRate: number, years: number): number => {
  const monthlyRate = (annualRate / 100) / 12;
  const totalPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return payment;
};
