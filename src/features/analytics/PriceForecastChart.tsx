import { EmptyState } from '@/components/ui/empty-state';

export function PriceForecastChart() {
  return (
    <EmptyState
      title="Price history is not available yet"
      body="A price chart will appear when verified market-price history and a reliable forecast source are available. No sample prices or synthetic forecasts are displayed."
    />
  );
}
