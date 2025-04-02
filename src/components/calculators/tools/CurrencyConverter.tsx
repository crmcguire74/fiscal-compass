
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { COMMON_CURRENCIES, CURRENCY_DEFAULTS } from '@/lib/constants';
import { convertCurrency } from '@/utils/conversionUtils';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(CURRENCY_DEFAULTS.amount);
  const [fromCurrency, setFromCurrency] = useState<string>(CURRENCY_DEFAULTS.fromCurrency);
  const [toCurrency, setToCurrency] = useState<string>(CURRENCY_DEFAULTS.toCurrency);
  const [result, setResult] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Calculate conversion on input change
  useEffect(() => {
    if (amount) {
      const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
      setResult(convertedAmount);
      
      // Calculate and set exchange rate
      const rateValue = convertCurrency(1, fromCurrency, toCurrency);
      setRate(rateValue);
      
      // Set timestamp
      setLastUpdated(new Date().toLocaleString());
    }
  }, [amount, fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format currency for display
  const formatCurrency = (value: number, currency: string) => {
    const currencyObj = COMMON_CURRENCIES.find(c => c.code === currency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          Convert between different currencies using current exchange rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Amount input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>

          {/* Currency selection */}
          <div className="grid grid-cols-9 gap-2 items-center">
            <div className="col-span-4 space-y-2">
              <Label htmlFor="fromCurrency">From</Label>
              <Select
                value={fromCurrency}
                onValueChange={setFromCurrency}
              >
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 flex justify-center mt-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSwapCurrencies}
                aria-label="Swap currencies"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="col-span-4 space-y-2">
              <Label htmlFor="toCurrency">To</Label>
              <Select
                value={toCurrency}
                onValueChange={setToCurrency}
              >
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result display */}
          <div className="bg-muted p-6 rounded-lg text-center space-y-2">
            <p className="text-sm text-muted-foreground">Converted Amount</p>
            <p className="text-3xl font-semibold">
              {formatCurrency(result, toCurrency)}
            </p>
            <p className="text-sm text-muted-foreground">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </p>
          </div>

          {/* Last updated */}
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Rates updated: {lastUpdated}</span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground mt-4">
            Note: Exchange rates are for demonstration purposes only and may not reflect current market rates.
            In a production environment, these would be fetched from a real-time API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
