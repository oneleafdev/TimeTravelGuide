import data from '../../data/accounting.json' with { type: 'json' };

type AccountingMethod = {
  id: string;
  title: string;
  formula: string;
  method: string;
  example: string;
};

export const accountingPath = '/accounting';
export const methods: readonly AccountingMethod[] = data.methods;
export const sources: readonly { label: string; url: string }[] = data.sources;
const maxEntry = 1_000_000;

function parseEntry(raw: string, minimum: number) {
  if (!/^[0-9]+$/.test(raw)) return null;
  const value = Number(raw);
  return value >= minimum && value <= maxEntry ? value : null;
}

export function calculateCheckout(priceInput: string, quantityInput: string, paidInput: string) {
  const price = parseEntry(priceInput, 0);
  const quantity = parseEntry(quantityInput, 1);
  const paid = parseEntry(paidInput, 0);
  if (price === null || quantity === null || paid === null) return null;
  const due = price * quantity;
  return { due, difference: paid - due };
}
