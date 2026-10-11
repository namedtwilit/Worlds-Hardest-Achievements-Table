export const weights = {
  luck: 1,
  grind: 3,
  gate: 4
}

export const sections = [
  { name: 'Main List', from: 1, to: 1000 },
  { name: 'Extended List', from: 1001, to: 2000 },
  { name: 'Legacy List', from: 2001, to: Infinity }
]

export function score(a) {
  return (
    weights.luck * a.luck +
    weights.grind * Math.log2(1 + a.grind) +
    weights.gate * Math.log10(a.gate) +
    (a.adjust ?? 0)
  )
}

export function rankAll(list) {
  return [...list]
    .map((a) => ({ ...a, score: score(a) }))
    .sort((a, b) => b.score - a.score)
    .map((a, i) => ({ ...a, rank: i + 1 }))
}

export function sectionOf(rank) {
  return sections.find((s) => rank >= s.from && rank <= s.to)
}

function plural(n, word) {
  return `${n} ${n === 1 ? word : word + 's'}`
}

export function formatGrind(years) {
  if (years < 1 / 12) return plural(Math.max(1, Math.round(years * 365)), 'day')
  if (years < 1) return plural(Math.round(years * 12), 'month')
  return plural(+years.toFixed(1), 'year')
}

export function formatGate(n) {
  if (n >= 1e9) return `1 in ${+(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `1 in ${+(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `1 in ${+(n / 1e3).toFixed(1)}K`
  return `1 in ${n}`
}

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function formatDate(d) {
  const [y, m, day] = d.split('-')
  if (day) return `${+day} ${months[m - 1]} ${y}`
  if (m) return `${months[m - 1]} ${y}`
  return y
}
