const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function toUnix(date) {
  const [y, m, d] = date.split('-').map(Number)
  const ms = new Date(0)
  ms.setUTCFullYear(y, (m || 1) - 1, d || 1)
  ms.setUTCHours(0, 0, 0, 0)
  return Math.floor(ms.getTime() / 1000)
}

const pad = (n) => String(n).padStart(2, '0')

export function formatMoment(t) {
  const d = new Date(t * 1000)
  const date = `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  const time = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  return { date, time }
}

export function shift(t, unit, amount) {
  const d = new Date(t * 1000)
  if (unit === 'year') d.setUTCFullYear(d.getUTCFullYear() + amount)
  else if (unit === 'month') d.setUTCMonth(d.getUTCMonth() + amount)
  else if (unit === 'day') d.setUTCDate(d.getUTCDate() + amount)
  else if (unit === 'hour') d.setUTCHours(d.getUTCHours() + amount)
  else if (unit === 'minute') d.setUTCMinutes(d.getUTCMinutes() + amount)
  else d.setUTCSeconds(d.getUTCSeconds() + amount)
  return Math.floor(d.getTime() / 1000)
}
