
export function formatCurrency(n: number): string {
  const firstPart = Number(Math.floor(n)).toLocaleString('ru-RU')
  const secondPartIndex = n.toString().indexOf('.')
  let secondPart = secondPartIndex === -1 ? '00' : Number(n.toString().slice(secondPartIndex + 1))
  if (secondPart.length < 2) {
    secondPart = `${secondPart}0`
  }
  return `${firstPart},${secondPart}  ₽`
}

export function formatReadings(n: number): string {
  if (n === undefined) {
    return '-'
  }
  const firstPart = Number(Math.floor(n)).toLocaleString('ru-RU')
  const secondPartIndex = n.toString().indexOf('.')
  let secondPart = secondPartIndex === -1 ? '00' : Number(n.toString().slice(secondPartIndex + 1))
  if (secondPart.length < 2) {
    secondPart = `${secondPart}0`
  }
  return `${firstPart}.${secondPart}`
}

