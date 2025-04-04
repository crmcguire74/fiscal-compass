
// Federal tax brackets for 2023 (single filers)
export const FEDERAL_TAX_BRACKETS_SINGLE_2023 = [
  { rate: 0.10, upTo: 11000 },
  { rate: 0.12, upTo: 44725 },
  { rate: 0.22, upTo: 95375 },
  { rate: 0.24, upTo: 182100 },
  { rate: 0.32, upTo: 231250 },
  { rate: 0.35, upTo: 578125 },
  { rate: 0.37, upTo: Infinity },
];

// Federal tax brackets for 2023 (married filing jointly)
export const FEDERAL_TAX_BRACKETS_MARRIED_2023 = [
  { rate: 0.10, upTo: 22000 },
  { rate: 0.12, upTo: 89450 },
  { rate: 0.22, upTo: 190750 },
  { rate: 0.24, upTo: 364200 },
  { rate: 0.32, upTo: 462500 },
  { rate: 0.35, upTo: 693750 },
  { rate: 0.37, upTo: Infinity },
];

// Common state tax rates (simplified for common states)
export const STATE_TAX_RATES = {
  "Alabama": { type: "graduated", rates: [{ rate: 0.02, upTo: 500 }, { rate: 0.04, upTo: 3000 }, { rate: 0.05, upTo: Infinity }] },
  "Alaska": { type: "none", rate: 0 },
  "Arizona": { type: "flat", rate: 0.025 },
  "Arkansas": { type: "graduated", rates: [{ rate: 0.02, upTo: 4300 }, { rate: 0.04, upTo: 8500 }, { rate: 0.055, upTo: Infinity }] },
  "California": { type: "graduated", rates: [
    { rate: 0.01, upTo: 10099 }, 
    { rate: 0.02, upTo: 23942 }, 
    { rate: 0.04, upTo: 37788 }, 
    { rate: 0.06, upTo: 52455 }, 
    { rate: 0.08, upTo: 66295 }, 
    { rate: 0.093, upTo: 338639 }, 
    { rate: 0.103, upTo: 406364 }, 
    { rate: 0.113, upTo: 677275 }, 
    { rate: 0.123, upTo: Infinity }
  ] },
  "Colorado": { type: "flat", rate: 0.044 },
  "Connecticut": { type: "graduated", rates: [{ rate: 0.03, upTo: 10000 }, { rate: 0.05, upTo: 50000 }, { rate: 0.055, upTo: 100000 }, { rate: 0.06, upTo: 200000 }, { rate: 0.065, upTo: 250000 }, { rate: 0.069, upTo: 500000 }, { rate: 0.0699, upTo: Infinity }] },
  "Delaware": { type: "graduated", rates: [{ rate: 0.022, upTo: 5000 }, { rate: 0.039, upTo: 10000 }, { rate: 0.048, upTo: 20000 }, { rate: 0.052, upTo: 25000 }, { rate: 0.0555, upTo: 60000 }, { rate: 0.066, upTo: Infinity }] },
  "Florida": { type: "none", rate: 0 },
  "Georgia": { type: "graduated", rates: [{ rate: 0.01, upTo: 750 }, { rate: 0.02, upTo: 2250 }, { rate: 0.03, upTo: 3750 }, { rate: 0.04, upTo: 5250 }, { rate: 0.05, upTo: 7000 }, { rate: 0.0575, upTo: Infinity }] },
  "Hawaii": { type: "graduated", rates: [{ rate: 0.014, upTo: 2400 }, { rate: 0.032, upTo: 4800 }, { rate: 0.055, upTo: 9600 }, { rate: 0.064, upTo: 14400 }, { rate: 0.068, upTo: 19200 }, { rate: 0.072, upTo: 24000 }, { rate: 0.076, upTo: 36000 }, { rate: 0.079, upTo: 48000 }, { rate: 0.0825, upTo: Infinity }] },
  "Idaho": { type: "flat", rate: 0.059 },
  "Illinois": { type: "flat", rate: 0.0495 },
  "Indiana": { type: "flat", rate: 0.0323 },
  "Iowa": { type: "flat", rate: 0.06 },
  "Kansas": { type: "graduated", rates: [{ rate: 0.031, upTo: 15000 }, { rate: 0.057, upTo: 30000 }, { rate: 0.057, upTo: Infinity }] },
  "Kentucky": { type: "flat", rate: 0.045 },
  "Louisiana": { type: "graduated", rates: [{ rate: 0.0185, upTo: 12500 }, { rate: 0.035, upTo: 50000 }, { rate: 0.0425, upTo: Infinity }] },
  "Maine": { type: "graduated", rates: [{ rate: 0.058, upTo: 23000 }, { rate: 0.0675, upTo: 54450 }, { rate: 0.0715, upTo: Infinity }] },
  "Maryland": { type: "graduated", rates: [{ rate: 0.02, upTo: 1000 }, { rate: 0.03, upTo: 2000 }, { rate: 0.04, upTo: 3000 }, { rate: 0.0475, upTo: 100000 }, { rate: 0.05, upTo: 125000 }, { rate: 0.0525, upTo: 150000 }, { rate: 0.055, upTo: 250000 }, { rate: 0.0575, upTo: Infinity }] },
  "Massachusetts": { type: "flat", rate: 0.05 },
  "Michigan": { type: "flat", rate: 0.0425 },
  "Minnesota": { type: "graduated", rates: [{ rate: 0.0535, upTo: 30070 }, { rate: 0.068, upTo: 98760 }, { rate: 0.0785, upTo: 183340 }, { rate: 0.0985, upTo: Infinity }] },
  "Mississippi": { type: "graduated", rates: [{ rate: 0.04, upTo: 5000 }, { rate: 0.05, upTo: Infinity }] },
  "Missouri": { type: "graduated", rates: [{ rate: 0.015, upTo: 1121 }, { rate: 0.02, upTo: 2242 }, { rate: 0.025, upTo: 3353 }, { rate: 0.03, upTo: 4484 }, { rate: 0.035, upTo: 5605 }, { rate: 0.04, upTo: 6726 }, { rate: 0.045, upTo: 7847 }, { rate: 0.05, upTo: 8968 }, { rate: 0.054, upTo: Infinity }] },
  "Montana": { type: "graduated", rates: [{ rate: 0.01, upTo: 3100 }, { rate: 0.02, upTo: 5500 }, { rate: 0.03, upTo: 8400 }, { rate: 0.04, upTo: 11400 }, { rate: 0.05, upTo: 14600 }, { rate: 0.06, upTo: 18800 }, { rate: 0.0675, upTo: Infinity }] },
  "Nebraska": { type: "graduated", rates: [{ rate: 0.0246, upTo: 3700 }, { rate: 0.0351, upTo: 22170 }, { rate: 0.0501, upTo: 35730 }, { rate: 0.0684, upTo: Infinity }] },
  "Nevada": { type: "none", rate: 0 },
  "New Hampshire": { type: "special", rate: 0.05, note: "Only taxes on interest and dividend income" },
  "New Jersey": { type: "graduated", rates: [{ rate: 0.014, upTo: 20000 }, { rate: 0.0175, upTo: 35000 }, { rate: 0.035, upTo: 40000 }, { rate: 0.05525, upTo: 75000 }, { rate: 0.0637, upTo: 500000 }, { rate: 0.0897, upTo: 1000000 }, { rate: 0.1075, upTo: Infinity }] },
  "New Mexico": { type: "graduated", rates: [{ rate: 0.017, upTo: 5500 }, { rate: 0.032, upTo: 11000 }, { rate: 0.047, upTo: 16000 }, { rate: 0.049, upTo: 210000 }, { rate: 0.059, upTo: Infinity }] },
  "New York": { type: "graduated", rates: [{ rate: 0.04, upTo: 8500 }, { rate: 0.045, upTo: 11700 }, { rate: 0.0525, upTo: 13900 }, { rate: 0.059, upTo: 80650 }, { rate: 0.0597, upTo: 215400 }, { rate: 0.0633, upTo: 1077550 }, { rate: 0.0685, upTo: 5000000 }, { rate: 0.0882, upTo: 25000000 }, { rate: 0.103, upTo: Infinity }] },
  "North Carolina": { type: "flat", rate: 0.0475 },
  "North Dakota": { type: "graduated", rates: [{ rate: 0.011, upTo: 41775 }, { rate: 0.0204, upTo: 101050 }, { rate: 0.0227, upTo: 210825 }, { rate: 0.0264, upTo: 458350 }, { rate: 0.029, upTo: Infinity }] },
  "Ohio": { type: "graduated", rates: [{ rate: 0, upTo: 25000 }, { rate: 0.027, upTo: 44250 }, { rate: 0.0316, upTo: 88450 }, { rate: 0.036, upTo: 110650 }, { rate: 0.0399, upTo: Infinity }] },
  "Oklahoma": { type: "graduated", rates: [{ rate: 0.0025, upTo: 1000 }, { rate: 0.0075, upTo: 2500 }, { rate: 0.0175, upTo: 3750 }, { rate: 0.0275, upTo: 4900 }, { rate: 0.0375, upTo: 7200 }, { rate: 0.0475, upTo: Infinity }] },
  "Oregon": { type: "graduated", rates: [{ rate: 0.0475, upTo: 3750 }, { rate: 0.0675, upTo: 9450 }, { rate: 0.0875, upTo: 125000 }, { rate: 0.099, upTo: Infinity }] },
  "Pennsylvania": { type: "flat", rate: 0.0307 },
  "Rhode Island": { type: "graduated", rates: [{ rate: 0.0375, upTo: 68200 }, { rate: 0.0475, upTo: 155050 }, { rate: 0.0599, upTo: Infinity }] },
  "South Carolina": { type: "graduated", rates: [{ rate: 0, upTo: 3200 }, { rate: 0.03, upTo: 6410 }, { rate: 0.04, upTo: 9620 }, { rate: 0.05, upTo: 12820 }, { rate: 0.06, upTo: 16040 }, { rate: 0.07, upTo: Infinity }] },
  "South Dakota": { type: "none", rate: 0 },
  "Tennessee": { type: "none", rate: 0 },
  "Texas": { type: "none", rate: 0 },
  "Utah": { type: "flat", rate: 0.0485 },
  "Vermont": { type: "graduated", rates: [{ rate: 0.0335, upTo: 43500 }, { rate: 0.066, upTo: 105500 }, { rate: 0.076, upTo: 201400 }, { rate: 0.0875, upTo: Infinity }] },
  "Virginia": { type: "graduated", rates: [{ rate: 0.02, upTo: 3000 }, { rate: 0.03, upTo: 5000 }, { rate: 0.05, upTo: 17000 }, { rate: 0.0575, upTo: Infinity }] },
  "Washington": { type: "none", rate: 0 },
  "West Virginia": { type: "graduated", rates: [{ rate: 0.03, upTo: 10000 }, { rate: 0.04, upTo: 25000 }, { rate: 0.045, upTo: 40000 }, { rate: 0.06, upTo: 60000 }, { rate: 0.065, upTo: Infinity }] },
  "Wisconsin": { type: "graduated", rates: [{ rate: 0.0354, upTo: 13810 }, { rate: 0.0465, upTo: 27630 }, { rate: 0.053, upTo: 304170 }, { rate: 0.0765, upTo: Infinity }] },
  "Wyoming": { type: "none", rate: 0 },
  "District of Columbia": { type: "graduated", rates: [{ rate: 0.04, upTo: 10000 }, { rate: 0.06, upTo: 40000 }, { rate: 0.065, upTo: 60000 }, { rate: 0.085, upTo: 350000 }, { rate: 0.0925, upTo: 1000000 }, { rate: 0.099, upTo: Infinity }] },
};

// Social Security and Medicare rates
export const FICA_RATES = {
  socialSecurity: {
    employeeRate: 0.062,
    wageBase: 160200,  // 2023 wage base
  },
  medicare: {
    employeeRate: 0.0145,
    additionalRate: 0.009,  // Additional Medicare tax for high income
    additionalThreshold: 200000,  // Single filers
    additionalThresholdMarried: 250000,  // Married filing jointly
  }
};

/**
 * Calculate federal income tax based on income and filing status
 */
export const calculateFederalIncomeTax = (
  income: number, 
  filingStatus: 'single' | 'married',
  deductions: number = 0,
  retirement401k: number = 0,
  otherTaxDeferred: number = 0
): number => {
  // Apply deductions and tax-deferred contributions
  const taxableIncome = Math.max(0, income - deductions - retirement401k - otherTaxDeferred);
  
  // Select appropriate tax brackets
  const brackets = filingStatus === 'single' 
    ? FEDERAL_TAX_BRACKETS_SINGLE_2023 
    : FEDERAL_TAX_BRACKETS_MARRIED_2023;
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  let lowerBound = 0;
  
  // Calculate tax for each bracket
  for (const bracket of brackets) {
    const taxableInBracket = Math.min(bracket.upTo - lowerBound, remainingIncome);
    if (taxableInBracket <= 0) break;
    
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
    lowerBound = bracket.upTo;
    
    if (remainingIncome <= 0) break;
  }
  
  return tax;
};

/**
 * Calculate state income tax based on income and state
 */
export const calculateStateIncomeTax = (
  income: number, 
  state: string,
  deductions: number = 0
): number => {
  const stateTaxInfo = STATE_TAX_RATES[state];
  if (!stateTaxInfo) return 0;
  
  const taxableIncome = Math.max(0, income - deductions);
  
  if (stateTaxInfo.type === 'none') {
    return 0;
  } else if (stateTaxInfo.type === 'flat') {
    return taxableIncome * stateTaxInfo.rate;
  } else if (stateTaxInfo.type === 'graduated') {
    let tax = 0;
    let remainingIncome = taxableIncome;
    let lowerBound = 0;
    
    for (const bracket of stateTaxInfo.rates) {
      const taxableInBracket = Math.min(bracket.upTo - lowerBound, remainingIncome);
      if (taxableInBracket <= 0) break;
      
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
      lowerBound = bracket.upTo;
      
      if (remainingIncome <= 0) break;
    }
    
    return tax;
  } else if (stateTaxInfo.type === 'special') {
    // For special cases like NH, we'd need additional information
    // Just returning 0 for simplicity
    return 0;
  }
  
  return 0;
};

/**
 * Calculate Social Security and Medicare taxes (FICA)
 */
export const calculateFICATaxes = (income: number): { socialSecurity: number; medicare: number; total: number } => {
  // Social Security (capped at wage base)
  const socialSecurityTaxableIncome = Math.min(income, FICA_RATES.socialSecurity.wageBase);
  const socialSecurityTax = socialSecurityTaxableIncome * FICA_RATES.socialSecurity.employeeRate;
  
  // Medicare (no cap, but additional tax above threshold)
  let medicareTax = income * FICA_RATES.medicare.employeeRate;
  
  // Additional Medicare tax for high-income individuals
  if (income > FICA_RATES.medicare.additionalThreshold) {
    medicareTax += (income - FICA_RATES.medicare.additionalThreshold) * FICA_RATES.medicare.additionalRate;
  }
  
  return {
    socialSecurity: socialSecurityTax,
    medicare: medicareTax,
    total: socialSecurityTax + medicareTax
  };
};

/**
 * Calculate complete take-home pay
 */
export const calculateTakeHomePay = (
  annualIncome: number,
  state: string = 'California',
  filingStatus: 'single' | 'married' = 'single',
  retirement401kPercent: number = 0,
  retirement401kAmount: number = 0,
  otherTaxDeferred: number = 0,
  standardDeduction: boolean = true,
  itemizedDeductions: number = 0,
  payPeriods: number = 24, // Bi-monthly by default
  isBonus: boolean = false
): {
  annualIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  retirement401k: number;
  otherTaxDeferred: number;
  totalDeductions: number;
  takeHomePay: number;
  takeHomePayPerPeriod: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  taxBreakdown: { name: string; amount: number; rate: number }[];
} => {
  // Calculate 401(k) contribution
  const retirement401k = retirement401kPercent > 0 
    ? annualIncome * (retirement401kPercent / 100)
    : retirement401kAmount;
  
  // Determine which deduction to use
  const standardDeductionAmount = filingStatus === 'single' ? 13850 : 27700; // 2023 amounts
  const deductions = standardDeduction ? standardDeductionAmount : itemizedDeductions;
  
  // Calculate taxes
  let federalTax = calculateFederalIncomeTax(annualIncome, filingStatus, deductions, retirement401k, otherTaxDeferred);
  
  // Apply supplemental wage tax rate for bonuses if applicable
  if (isBonus) {
    // Supplemental wage tax rate is 22% for most bonuses
    federalTax = annualIncome * 0.22;
  }
  
  const stateTax = calculateStateIncomeTax(annualIncome, state, deductions);
  const ficaTaxes = calculateFICATaxes(annualIncome);
  
  // Calculate total deductions and take-home pay
  const totalDeductions = federalTax + stateTax + ficaTaxes.total + retirement401k + otherTaxDeferred;
  const takeHomePay = annualIncome - totalDeductions;
  const takeHomePayPerPeriod = takeHomePay / payPeriods;
  
  // Calculate effective tax rate
  const effectiveTaxRate = (federalTax + stateTax + ficaTaxes.total) / annualIncome * 100;
  
  // Determine marginal tax rate
  const marginalTaxRate = getMarginalTaxRate(annualIncome, filingStatus, state);
  
  // Create breakdown for visualization
  const taxBreakdown = [
    { name: "Take-Home Pay", amount: takeHomePay, rate: (takeHomePay / annualIncome) * 100 },
    { name: "Federal Tax", amount: federalTax, rate: (federalTax / annualIncome) * 100 },
    { name: "State Tax", amount: stateTax, rate: (stateTax / annualIncome) * 100 },
    { name: "Social Security", amount: ficaTaxes.socialSecurity, rate: (ficaTaxes.socialSecurity / annualIncome) * 100 },
    { name: "Medicare", amount: ficaTaxes.medicare, rate: (ficaTaxes.medicare / annualIncome) * 100 },
    { name: "401(k) Contribution", amount: retirement401k, rate: (retirement401k / annualIncome) * 100 },
    { name: "Other Tax-Deferred", amount: otherTaxDeferred, rate: (otherTaxDeferred / annualIncome) * 100 }
  ];
  
  return {
    annualIncome,
    federalTax,
    stateTax,
    socialSecurity: ficaTaxes.socialSecurity,
    medicare: ficaTaxes.medicare,
    retirement401k,
    otherTaxDeferred,
    totalDeductions,
    takeHomePay,
    takeHomePayPerPeriod,
    effectiveTaxRate,
    marginalTaxRate,
    taxBreakdown
  };
};

/**
 * Get the marginal tax rate based on income, filing status, and state
 */
const getMarginalTaxRate = (
  income: number, 
  filingStatus: 'single' | 'married', 
  state: string
): number => {
  // Federal marginal rate
  const brackets = filingStatus === 'single' 
    ? FEDERAL_TAX_BRACKETS_SINGLE_2023 
    : FEDERAL_TAX_BRACKETS_MARRIED_2023;
  
  let federalRate = 0;
  for (let i = 0; i < brackets.length; i++) {
    if (income <= brackets[i].upTo || i === brackets.length - 1) {
      federalRate = brackets[i].rate;
      break;
    }
  }
  
  // State marginal rate
  const stateTaxInfo = STATE_TAX_RATES[state];
  let stateRate = 0;
  
  if (stateTaxInfo?.type === 'flat') {
    stateRate = stateTaxInfo.rate;
  } else if (stateTaxInfo?.type === 'graduated') {
    for (let i = 0; i < stateTaxInfo.rates.length; i++) {
      if (income <= stateTaxInfo.rates[i].upTo || i === stateTaxInfo.rates.length - 1) {
        stateRate = stateTaxInfo.rates[i].rate;
        break;
      }
    }
  }
  
  // Combined marginal rate
  return (federalRate + stateRate) * 100;
};

/**
 * Calculate home equity after closing costs
 */
export const calculateHomeEquity = (
  homeValue: number,
  mortgageBalance: number,
  sellingPrice: number = 0,
  realtorCommission: number = 6,
  closingCosts: number = 2, // Percentage
  repairs: number = 0,
  additionalCosts: Array<{ name: string; amount: number }> = [], // Added additional costs array
  escrowFunds: number = 0 // Added escrow funds
): {
  homeValue: number;
  mortgageBalance: number;
  currentEquity: number;
  sellingPrice: number;
  realtorCommissionAmount: number;
  closingCostsAmount: number;
  repairsAmount: number;
  additionalCostsBreakdown: Array<{ name: string; amount: number }>; // Return breakdown
  totalAdditionalCosts: number; // Return total
  escrowFunds: number; // Return escrow funds
  totalSellingCosts: number;
  netProceeds: number;
  profitOrLoss: number;
} => {
  // Use selling price if provided, otherwise use home value
  const actualSellingPrice = sellingPrice > 0 ? sellingPrice : homeValue;
  
  // Calculate current equity before selling
  const currentEquity = homeValue - mortgageBalance;
  
  // Calculate selling costs
  const realtorCommissionAmount = actualSellingPrice * (realtorCommission / 100);
  const closingCostsAmount = actualSellingPrice * (closingCosts / 100);
  const repairsAmount = repairs;
  // Calculate total additional costs
  const totalAdditionalCosts = additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
  
  const totalSellingCosts = realtorCommissionAmount + closingCostsAmount + repairsAmount + totalAdditionalCosts;
  
  // Calculate net proceeds from sale, adding back escrow funds
  const netProceeds = actualSellingPrice - mortgageBalance - totalSellingCosts + escrowFunds;
  
  // Calculate profit or loss compared to original equity
  // Note: Escrow funds returned don't typically count as "profit" from the sale itself, 
  // but they are part of the cash received. The profit/loss calculation remains based on equity change.
  const profitOrLoss = (actualSellingPrice - totalSellingCosts) - (homeValue - mortgageBalance); 
  
  return {
    homeValue,
    mortgageBalance,
    currentEquity,
    sellingPrice: actualSellingPrice,
    realtorCommissionAmount,
    closingCostsAmount,
    repairsAmount,
    additionalCostsBreakdown: additionalCosts, // Return the breakdown
    totalAdditionalCosts, // Return the total
    escrowFunds, // Return escrow funds
    totalSellingCosts,
    netProceeds,
    profitOrLoss
  };
};
