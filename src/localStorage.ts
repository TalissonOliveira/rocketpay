export interface CardProps {
  id: string
  cardNumber: string
  holder: string
  expirationDate: string
  securityCode: string
  type: 'visa' | 'mastercard' | 'default'
}

export function saveCards(cards: CardProps[]) {
  localStorage.setItem('@rocketpay:cards', JSON.stringify(cards))
}

export function getCards(): CardProps[] {
  const cards = localStorage.getItem('@rocketpay:cards')

  if (!cards) {
    return []
  }

  return JSON.parse(cards)
}
