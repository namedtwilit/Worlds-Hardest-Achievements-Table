export const sections = [
  { name: 'Main List', from: 1, to: 1000 },
  { name: 'Extended List', from: 1001, to: 2000 },
  { name: 'Legacy List', from: 2001, to: Infinity }
]

export const grindAnchors = [
  [1, 'a day'],
  [2, 'a week'],
  [3, 'a month'],
  [4, '6 months'],
  [5, 'a year'],
  [6, '3 years'],
  [7, '5 years'],
  [8, '10 years'],
  [9, '20 years'],
  [10, 'a lifetime']
]

export const stakesAnchors = [
  [1, 'retry in seconds'],
  [3, 'lose minutes of progress'],
  [4, 'lose hours, or a big mental hit'],
  [6, 'lose months, or a lot of money'],
  [8, 'serious injury'],
  [10, 'you probably die']
]

const round1 = (n) => Math.round(n * 10) / 10

export function oddsToScore(n) {
  return round1(Math.min(10, 1 + Math.log10(Math.max(1, n))))
}

export function parts(a) {
  return {
    luck: oddsToScore(a.odds),
    grind: a.grind,
    ceiling: oddsToScore(a.ceiling),
    stakes: a.stakes
  }
}

export const stakesWeight = 0.5
export const maxScore = 30 + 10 * stakesWeight

export function score(a) {
  const p = parts(a)
  return round1(p.luck + p.grind + p.ceiling + p.stakes * stakesWeight + (a.adjust ?? 0))
}

export function rankAll(list) {
  return [...list]
    .map((a) => ({ ...a, score: score(a), parts: parts(a) }))
    .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
    .map((a, i) => ({ ...a, rank: i + 1 }))
}

export function sectionOf(rank) {
  return sections.find((s) => rank >= s.from && rank <= s.to)
}

function anchorFor(list, v) {
  return list.reduce((best, cur) => (cur[0] <= v ? cur : best), list[0])[1]
}

export const describeGrind = (v) => `about ${anchorFor(grindAnchors, v)}`
export const describeStakes = (v) => anchorFor(stakesAnchors, v)

export function formatOdds(n) {
  if (n <= 1) return 'no luck needed'
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
