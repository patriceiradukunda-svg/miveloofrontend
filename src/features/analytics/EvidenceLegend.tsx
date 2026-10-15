const E = [['●', 'Observed', 'Recorded on the platform or measured.'], ['◆', 'Supplier quote', 'A price a supplier offered. Not a sale.'], ['■', 'Completed transaction', 'An order confirmed delivered.'], ['▲', 'Official statistic', 'From a named public source.'], ['◐', 'Estimate', 'Calculated from partial data.'], ['⬡', 'Model prediction', 'A forecast. Can be wrong.']] as const;
export function EvidenceLegend() {
  return (
    <section aria-label="Types of evidence" className="rounded-3xl bg-teal-tint p-5">
      <h3 className="font-display text-xl font-semibold">How to read Miveloo numbers</h3>
      <p className="text-sm text-ink-soft">Every number is tagged with what kind of evidence it is.</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{E.map(([g, t, d]) => <div key={t} className="rounded-xl bg-white p-3"><dt className="font-bold"><span aria-hidden className="mr-2 text-teal">{g}</span>{t}</dt><dd className="text-sm text-ink-soft">{d}</dd></div>)}</dl>
    </section>
  );
}
