export const CALCULATOR_CATEGORIES = [
  {
    id: 'home-mortgage',
    name: 'Home & Mortgage',
    description: 'Calculators for home buying, mortgage payments, and refinancing',
    icon: 'home',
  },
  {
    id: 'retirement',
    name: 'Retirement Planning',
    description: 'Tools for planning your retirement and estimating future needs',
    icon: 'piggy-bank',
  },
  {
    id: 'investment',
    name: 'Investment & Wealth',
    description: 'Calculate investment growth, returns, and portfolio analysis',
    icon: 'trending-up',
  },
  {
    id: 'debt',
    name: 'Debt Management',
    description: 'Tools to help manage and pay off various types of debt',
    icon: 'credit-card',
  },
  {
    id: 'insurance',
    name: 'Insurance Planning',
    description: 'Calculate insurance needs and compare different plans',
    icon: 'shield',
  },
  {
    id: 'tax',
    name: 'Tax Planning',
    description: 'Estimate taxes and plan for tax-efficient strategies',
    icon: 'dollar-sign',
  },
  {
    id: 'education',
    name: 'Education Planning',
    description: 'Plan for education costs and student loan management',
    icon: 'book',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Calculate health costs and plan for medical expenses',
    icon: 'heart',
  },
  {
    id: 'business',
    name: 'Business & Entrepreneur',
    description: 'Tools for business planning and entrepreneurial decisions',
    icon: 'briefcase',
  },
  {
    id: 'life-events',
    name: 'Life Event Planning',
    description: 'Plan for major life events like weddings, children, and more',
    icon: 'calendar',
  },
  {
    id: 'tools',
    name: 'Practical Tools',
    description: 'Everyday calculators and converters for quick references',
    icon: 'calculator',
  },
];

export const COMPOUND_INTEREST_DEFAULTS = {
  principal: 10000,
  monthlyContribution: 500,
  interestRate: 7,
  years: 20,
  compoundingFrequency: 'monthly',
};

export const COMPOUNDING_FREQUENCIES = [
  { value: 'daily', label: 'Daily', timesPerYear: 365 },
  { value: 'monthly', label: 'Monthly', timesPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', timesPerYear: 4 },
  { value: 'semiannually', label: 'Semi-annually', timesPerYear: 2 },
  { value: 'annually', label: 'Annually', timesPerYear: 1 },
];

export const CURRENCY_DEFAULTS = {
  amount: 100,
  fromCurrency: 'USD',
  toCurrency: 'EUR',
};

export const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
];

export const MEASUREMENT_CATEGORIES = [
  { id: 'length', name: 'Length' },
  { id: 'weight', name: 'Weight' },
  { id: 'volume', name: 'Volume' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'area', name: 'Area' },
  { id: 'speed', name: 'Speed' },
];

export const MEASUREMENT_UNITS = {
  length: [
    { id: 'mm', name: 'Millimeters (mm)' },
    { id: 'cm', name: 'Centimeters (cm)' },
    { id: 'm', name: 'Meters (m)' },
    { id: 'km', name: 'Kilometers (km)' },
    { id: 'in', name: 'Inches (in)' },
    { id: 'ft', name: 'Feet (ft)' },
    { id: 'yd', name: 'Yards (yd)' },
    { id: 'mi', name: 'Miles (mi)' },
  ],
  weight: [
    { id: 'mg', name: 'Milligrams (mg)' },
    { id: 'g', name: 'Grams (g)' },
    { id: 'kg', name: 'Kilograms (kg)' },
    { id: 'oz', name: 'Ounces (oz)' },
    { id: 'lb', name: 'Pounds (lb)' },
    { id: 'st', name: 'Stone (st)' },
    { id: 't', name: 'Metric Tons (t)' },
  ],
  volume: [
    { id: 'ml', name: 'Milliliters (ml)' },
    { id: 'l', name: 'Liters (l)' },
    { id: 'pt', name: 'Pints (pt)' },
    { id: 'qt', name: 'Quarts (qt)' },
    { id: 'gal', name: 'Gallons (gal)' },
    { id: 'fl_oz', name: 'Fluid Ounces (fl oz)' },
    { id: 'cup', name: 'Cups' },
  ],
  temperature: [
    { id: 'c', name: 'Celsius (°C)' },
    { id: 'f', name: 'Fahrenheit (°F)' },
    { id: 'k', name: 'Kelvin (K)' },
  ],
  area: [
    { id: 'mm2', name: 'Square Millimeters (mm²)' },
    { id: 'cm2', name: 'Square Centimeters (cm²)' },
    { id: 'm2', name: 'Square Meters (m²)' },
    { id: 'km2', name: 'Square Kilometers (km²)' },
    { id: 'in2', name: 'Square Inches (in²)' },
    { id: 'ft2', name: 'Square Feet (ft²)' },
    { id: 'ac', name: 'Acres' },
    { id: 'ha', name: 'Hectares' },
  ],
  speed: [
    { id: 'mps', name: 'Meters per Second (m/s)' },
    { id: 'kph', name: 'Kilometers per Hour (km/h)' },
    { id: 'mph', name: 'Miles per Hour (mph)' },
    { id: 'fps', name: 'Feet per Second (ft/s)' },
    { id: 'knot', name: 'Knots' },
  ],
};
