/** Formats digits into the standard Australian ABN grouping: "XX XXX XXX XXX". */
export function formatAbn(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 8), digits.slice(8, 11)]
    .filter(Boolean)
    .join(' ')
}

/**
 * Formats digits into standard Australian phone groupings: mobiles as
 * "04XX XXX XXX", landlines (area code + number) as "0X XXXX XXXX".
 */
export function formatAuPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const isMobile = digits.startsWith('04') || digits.startsWith('05')
  const groups = isMobile
    ? [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 10)]
    : [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6, 10)]
  return groups.filter(Boolean).join(' ')
}
