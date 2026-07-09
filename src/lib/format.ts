/** Formats digits into the standard Australian ABN grouping: "XX XXX XXX XXX". */
export function formatAbn(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8), digits.slice(8, 11)]
    .filter(Boolean)
    .join(' ')
}
