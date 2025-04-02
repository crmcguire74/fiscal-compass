
// Currency conversion (using hardcoded rates for demonstration)
// In a real app, these would be fetched from an API
const CURRENCY_RATES = {
  USD: 1.0,      // Base currency
  EUR: 0.93,     // 1 USD = 0.93 EUR
  GBP: 0.79,     // 1 USD = 0.79 GBP
  JPY: 150.54,   // 1 USD = 150.54 JPY
  CAD: 1.37,     // 1 USD = 1.37 CAD
  AUD: 1.54,     // 1 USD = 1.54 AUD
  CHF: 0.91,     // 1 USD = 0.91 CHF
  CNY: 7.22,     // 1 USD = 7.22 CNY
  INR: 83.37,    // 1 USD = 83.37 INR
  MXN: 17.14,    // 1 USD = 17.14 MXN
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first (as base currency)
  const inUSD = fromCurrency === 'USD' 
    ? amount 
    : amount / CURRENCY_RATES[fromCurrency as keyof typeof CURRENCY_RATES];
  
  // Then convert from USD to target currency
  return toCurrency === 'USD'
    ? inUSD
    : inUSD * CURRENCY_RATES[toCurrency as keyof typeof CURRENCY_RATES];
};

// Measurement conversion factors (to SI units)
const LENGTH_FACTORS = {
  mm: 0.001,     // 1 mm = 0.001 m
  cm: 0.01,      // 1 cm = 0.01 m
  m: 1,          // base unit
  km: 1000,      // 1 km = 1000 m
  in: 0.0254,    // 1 in = 0.0254 m
  ft: 0.3048,    // 1 ft = 0.3048 m
  yd: 0.9144,    // 1 yd = 0.9144 m
  mi: 1609.344,  // 1 mi = 1609.344 m
};

const WEIGHT_FACTORS = {
  mg: 0.000001,  // 1 mg = 0.000001 kg
  g: 0.001,      // 1 g = 0.001 kg
  kg: 1,         // base unit
  oz: 0.028349523125, // 1 oz = 0.028349523125 kg
  lb: 0.45359237,     // 1 lb = 0.45359237 kg
  st: 6.35029318,     // 1 st = 6.35029318 kg
  t: 1000,            // 1 metric ton = 1000 kg
};

const VOLUME_FACTORS = {
  ml: 0.001,     // 1 ml = 0.001 l
  l: 1,          // base unit
  pt: 0.473176,  // 1 pt (US) = 0.473176 l
  qt: 0.946353,  // 1 qt (US) = 0.946353 l
  gal: 3.78541,  // 1 gal (US) = 3.78541 l
  fl_oz: 0.0295735, // 1 fl oz (US) = 0.0295735 l
  cup: 0.24,     // 1 cup (US) = 0.24 l
};

const AREA_FACTORS = {
  mm2: 0.000001,  // 1 mm² = 0.000001 m²
  cm2: 0.0001,    // 1 cm² = 0.0001 m²
  m2: 1,          // base unit
  km2: 1000000,   // 1 km² = 1000000 m²
  in2: 0.00064516, // 1 in² = 0.00064516 m²
  ft2: 0.09290304, // 1 ft² = 0.09290304 m²
  ac: 4046.86,    // 1 acre = 4046.86 m²
  ha: 10000,      // 1 hectare = 10000 m²
};

const SPEED_FACTORS = {
  mps: 1,         // base unit
  kph: 0.277778,  // 1 km/h = 0.277778 m/s
  mph: 0.44704,   // 1 mph = 0.44704 m/s
  fps: 0.3048,    // 1 ft/s = 0.3048 m/s
  knot: 0.514444, // 1 knot = 0.514444 m/s
};

// Special case for temperature (requires formulas not just factors)
export const convertTemperature = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  if (fromUnit === toUnit) return value;
  
  // First convert to Kelvin (as a base unit)
  let kelvin: number;
  switch (fromUnit) {
    case 'c':
      kelvin = value + 273.15;
      break;
    case 'f':
      kelvin = (value + 459.67) * (5/9);
      break;
    case 'k':
      kelvin = value;
      break;
    default:
      return value;
  }
  
  // Then convert from Kelvin to target unit
  switch (toUnit) {
    case 'c':
      return kelvin - 273.15;
    case 'f':
      return kelvin * (9/5) - 459.67;
    case 'k':
      return kelvin;
    default:
      return value;
  }
};

// General conversion function for other measurements
export const convertMeasurement = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string
): number => {
  if (fromUnit === toUnit) return value;
  
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }
  
  let factors: Record<string, number>;
  switch (category) {
    case 'length':
      factors = LENGTH_FACTORS;
      break;
    case 'weight':
      factors = WEIGHT_FACTORS;
      break;
    case 'volume':
      factors = VOLUME_FACTORS;
      break;
    case 'area':
      factors = AREA_FACTORS;
      break;
    case 'speed':
      factors = SPEED_FACTORS;
      break;
    default:
      return value;
  }
  
  // Convert to base unit, then to target unit
  const baseValue = value * factors[fromUnit as keyof typeof factors];
  return baseValue / factors[toUnit as keyof typeof factors];
};
