
// Define types for our storage
export interface UserFinancialData {
  // Personal financial data
  monthlyIncome?: number;
  annualIncome?: number;
  monthlyExpenses?: number;
  savingsRate?: number;
  
  // Assets
  currentSavings?: number;
  homeValue?: number;
  investmentAccounts?: number;
  
  // Debt profile
  totalDebt?: number;
  mortgageBalance?: number;
  carLoanBalance?: number;
  studentLoanBalance?: number;
  creditCardDebt?: number;
  
  // Investment preferences
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  
  // Last updated timestamp
  lastUpdated?: number;
  
  // Calculator-specific data
  calculators?: {
    [calculatorId: string]: any;
  };
}

// Storage key for local storage
const STORAGE_KEY = 'finlife-calculator-data';

// Get all financial data from localStorage
export const getFinancialData = (): UserFinancialData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
  }
  return {};
};

// Save all financial data to localStorage
export const saveFinancialData = (data: UserFinancialData): void => {
  try {
    // Add last updated timestamp
    const dataToSave = {
      ...data,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Clear all financial data from localStorage
export const clearFinancialData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
};

// Update specific calculator data
export const saveCalculatorData = (calculatorId: string, data: any): void => {
  try {
    const existingData = getFinancialData();
    const calculators = existingData.calculators || {};
    
    saveFinancialData({
      ...existingData,
      calculators: {
        ...calculators,
        [calculatorId]: data,
      },
    });
  } catch (error) {
    console.error(`Error saving data for calculator ${calculatorId}:`, error);
  }
};

// Get specific calculator data
export const getCalculatorData = (calculatorId: string): any => {
  try {
    const data = getFinancialData();
    return data.calculators?.[calculatorId] || null;
  } catch (error) {
    console.error(`Error retrieving data for calculator ${calculatorId}:`, error);
    return null;
  }
};
