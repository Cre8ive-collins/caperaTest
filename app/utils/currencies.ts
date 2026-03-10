import type { FxMarketType } from "~/types/fx";

export interface CurrencyOption {
  code: string;
  label: string;
  marketType: FxMarketType;
  logo: string;
}

export const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: "NGN", label: "Nigerian Naira", marketType: "fiat", logo: "https://flagcdn.com/w40/ng.png" },
  { code: "USD", label: "US Dollar", marketType: "fiat", logo: "https://flagcdn.com/w40/us.png" },
  { code: "EUR", label: "Euro", marketType: "fiat", logo: "https://flagcdn.com/w40/eu.png" },
  { code: "GBP", label: "British Pound", marketType: "fiat", logo: "https://flagcdn.com/w40/gb.png" },
  { code: "JPY", label: "Japanese Yen", marketType: "fiat", logo: "https://flagcdn.com/w40/jp.png" },
  { code: "CAD", label: "Canadian Dollar", marketType: "fiat", logo: "https://flagcdn.com/w40/ca.png" },
  { code: "AUD", label: "Australian Dollar", marketType: "fiat", logo: "https://flagcdn.com/w40/au.png" },
  { code: "CHF", label: "Swiss Franc", marketType: "fiat", logo: "https://flagcdn.com/w40/ch.png" },
  { code: "USDT", label: "Tether USD", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png" },
  { code: "USDC", label: "USD Coin", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdc.png" },
  { code: "DAI", label: "Dai", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/dai.png" },
  { code: "FDUSD", label: "First Digital USD", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usd.png" },
  { code: "TUSD", label: "TrueUSD", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/tusd.png" },
  { code: "PYUSD", label: "PayPal USD", marketType: "stable", logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usd.png" },
];
