// Currency detection utility based on user's locale/location

// Comprehensive currency mapping by country code
const countryCurrencyMap = {
  // Africa
  NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  GH: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  KE: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  ZA: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  EG: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  MA: { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  TZ: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  UG: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  RW: { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
  ET: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  
  // North America
  US: { code: 'USD', symbol: '$', name: 'US Dollar' },
  CA: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  MX: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  
  // Europe
  GB: { code: 'GBP', symbol: '£', name: 'British Pound' },
  DE: { code: 'EUR', symbol: '€', name: 'Euro' },
  FR: { code: 'EUR', symbol: '€', name: 'Euro' },
  IT: { code: 'EUR', symbol: '€', name: 'Euro' },
  ES: { code: 'EUR', symbol: '€', name: 'Euro' },
  NL: { code: 'EUR', symbol: '€', name: 'Euro' },
  BE: { code: 'EUR', symbol: '€', name: 'Euro' },
  PT: { code: 'EUR', symbol: '€', name: 'Euro' },
  IE: { code: 'EUR', symbol: '€', name: 'Euro' },
  AT: { code: 'EUR', symbol: '€', name: 'Euro' },
  CH: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  SE: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  NO: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  DK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  PL: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  RU: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  
  // Asia
  CN: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  JP: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  IN: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  KR: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  SG: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  HK: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  TW: { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  MY: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  TH: { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  ID: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  PH: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  VN: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  PK: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  BD: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  
  // Middle East
  AE: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  SA: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  QA: { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal' },
  KW: { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
  IL: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  TR: { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  
  // Oceania
  AU: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  NZ: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  
  // South America
  BR: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  AR: { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso' },
  CL: { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso' },
  CO: { code: 'COP', symbol: 'COP$', name: 'Colombian Peso' },
  PE: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
};

// Default currency (fallback)
const DEFAULT_CURRENCY = { code: 'USD', symbol: '$', name: 'US Dollar' };

// Get currency from browser locale
export const getCurrencyFromLocale = () => {
  try {
    // Get user's locale
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    
    // Extract country code from locale (e.g., 'en-NG' -> 'NG', 'en-US' -> 'US')
    const parts = locale.split('-');
    const countryCode = parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
    
    // Check if we have a mapping for this country
    if (countryCurrencyMap[countryCode]) {
      return countryCurrencyMap[countryCode];
    }
    
    // Fallback: try to get from Intl API
    // const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
    
    // If locale suggests a specific region, try to match
    return DEFAULT_CURRENCY;
  } catch (error) {
    console.warn('Failed to detect currency from locale:', error);
    return DEFAULT_CURRENCY;
  }
};

// Get currency using IP geolocation (async)
export const getCurrencyFromIP = async () => {
  try {
    // Use a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('IP geolocation failed');
    }
    
    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();
    
    if (countryCode && countryCurrencyMap[countryCode]) {
      return {
        ...countryCurrencyMap[countryCode],
        country: data.country_name,
        countryCode: countryCode,
      };
    }
    
    // If we have currency info from the API, use it
    if (data.currency) {
      return {
        code: data.currency,
        symbol: data.currency_symbol || data.currency,
        name: data.currency_name || data.currency,
        country: data.country_name,
        countryCode: countryCode,
      };
    }
    
    return { ...DEFAULT_CURRENCY, country: data.country_name, countryCode };
  } catch (error) {
    console.warn('Failed to detect currency from IP:', error);
    return getCurrencyFromLocale();
  }
};

// Get all available currencies for the dropdown
export const getAvailableCurrencies = () => {
  // Get unique currencies
  const uniqueCurrencies = {};
  Object.values(countryCurrencyMap).forEach(currency => {
    if (!uniqueCurrencies[currency.code]) {
      uniqueCurrencies[currency.code] = currency;
    }
  });
  
  // Sort by currency code and return as array
  return Object.values(uniqueCurrencies).sort((a, b) => a.code.localeCompare(b.code));
};

// Common currencies for quick selection (shown first in dropdown)
export const commonCurrencies = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const currencyDetector = {
  getCurrencyFromLocale,
  getCurrencyFromIP,
  getAvailableCurrencies,
  commonCurrencies,
  countryCurrencyMap,
  DEFAULT_CURRENCY,
};

export default currencyDetector;

