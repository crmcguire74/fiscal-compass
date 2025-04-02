
// Calculate compound interest with regular contributions
export const calculateCompoundInterest = (
  principal: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number,
  compoundingFrequency: number
): {
  finalBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  yearlyData: Array<{
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }>;
} => {
  // Convert annual interest rate to decimal
  const interestRate = annualInterestRate / 100;
  
  // Calculate interest rate per period
  const ratePerPeriod = interestRate / compoundingFrequency;
  
  // Calculate total number of compounding periods
  const totalPeriods = compoundingFrequency * years;
  
  // Calculate contribution per period
  const contributionPerPeriod = monthlyContribution * 12 / compoundingFrequency;
  
  // Initialize variables
  let balance = principal;
  let totalContributions = principal;
  let yearlyData = [];
  
  // Track values at the end of each year
  let previousYearBalance = principal;
  let yearlyContributions = 0;
  
  // Perform calculation for each period
  for (let period = 1; period <= totalPeriods; period++) {
    // Add contribution for this period
    balance += contributionPerPeriod;
    totalContributions += contributionPerPeriod;
    yearlyContributions += contributionPerPeriod;
    
    // Apply interest for this period
    const interestEarned = balance * ratePerPeriod;
    balance += interestEarned;
    
    // Check if we've completed a year
    if (period % compoundingFrequency === 0) {
      const year = period / compoundingFrequency;
      const yearlyInterest = balance - previousYearBalance - yearlyContributions;
      
      yearlyData.push({
        year,
        balance,
        contributions: yearlyContributions,
        interest: yearlyInterest
      });
      
      // Reset yearly tracking
      previousYearBalance = balance;
      yearlyContributions = 0;
    }
  }
  
  // Calculate total interest earned
  const totalInterestEarned = balance - totalContributions;
  
  return {
    finalBalance: balance,
    totalContributions,
    totalInterestEarned,
    yearlyData
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

// Format number as currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
    return `$${value.toFixed(0)}`;
  }
};
