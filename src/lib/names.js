export function othersText(others) {
  if (!others) return ''
  if (typeof others === 'number') return others === 1 ? '1 other' : `${others} others`
  return others
}

export function credit(a) {
  const names = [...a.by]
  const rest = othersText(a.others)
  if (rest) names.push(rest)
  if (names.length <= 2) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
}
