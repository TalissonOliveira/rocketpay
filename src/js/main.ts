import '../css/index.css'
import IMask from 'imask'
import { cardsDynamicMasks } from './utils/cardsDynamicMasks'
import { CardProps, getCards, saveCards } from './utils/localStorage'
import { colors } from './utils/cardsColors'

window.addEventListener("load", () => {
  clearFormFields()
})

const cards = getCards()

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')

const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')

function setCardType(type: 'visa' | 'mastercard' | 'default') {
  ccBgColor01?.setAttribute('fill', colors[type][0])
  ccBgColor02?.setAttribute('fill', colors[type][1])
  ccLogo?.setAttribute('src', `/cc-${type}.svg`)
}

globalThis.setCardType = setCardType

interface MaskedDynamic extends IMask.MaskedDynamic {
  compiledMasks: (IMask.MaskedDynamic["compiledMasks"][0] & { regex: RegExp, cardtype: string })[]
}

const cardNumber = document.querySelector('#card-number') as HTMLInputElement
const cardNumberPattern = {
  mask: cardsDynamicMasks,
  dispatch: function (appended: string, dynamicMasked: MaskedDynamic) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'')
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex))

    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

cardNumberMasked.on('accept', () => {
  // @ts-ignore
  const cardType = cardNumberMasked.masked.currentMask?.cardtype

  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number: string) {
  const ccNumber = document.querySelector<HTMLDivElement>('.cc-number')

  if (ccNumber) {
    ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number
  }
}

const cardHolder = document.querySelector('#card-holder') as HTMLInputElement
const cardHolderPattern = {
  mask: /^[a-zA-Z'\u00C0-\u00FF ]{0,40}$/,
}

const cardHolderMasked = IMask(cardHolder, cardHolderPattern)

cardHolderMasked.on('accept', () => {
  updateCardHolder(cardHolderMasked.value)
})

function updateCardHolder(holder: string) {
  const ccHolder = document.querySelector<HTMLDivElement>('.cc-holder .value')

  if (ccHolder) {
    ccHolder.innerText = holder.trim().length === 0 ? 'FULANO DA SILVA' : holder
  }
}

const expirationDate = document.querySelector('#expiration-date') as HTMLInputElement
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date: string) {
  const ccExpiration = document.querySelector<HTMLDivElement>('.cc-expiration .value')

  if (ccExpiration) {
    ccExpiration.innerText = date.length === 0 ? '02/32' : date
  }
}

const securityCode = document.querySelector('#security-code') as HTMLInputElement
const securityCodePattern = {
  mask: '0000'
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code: string) {
  const ccSecurity = document.querySelector<HTMLDivElement>('.cc-security .value')

  if (ccSecurity) {
    ccSecurity.innerText = code.length === 0 ? '123' : code
  }
}

function clearFormFields() {
  cardNumber.value = ''
  cardHolder.value = ''
  expirationDate.value = ''
  securityCode.value = ''

  updateCardNumber('')
  updateCardHolder('')
  updateExpirationDate('')
  updateSecurityCode('')
  setCardType('default')
}

const addbutton = document.querySelector<HTMLButtonElement>('#add-card')

addbutton?.addEventListener('click', async () => {
  const formFields = document.querySelectorAll<HTMLInputElement>('form input')

  for (const field of Array.from(formFields)) {
    if (field.value.trim() === '') {
      alert('Preencha todos os campos!')
      field.focus()

      return
    }
  }

  const card: CardProps = {
    // @ts-ignore
    type: cardNumberMasked.masked.currentMask?.cardtype,
    id: String(cardNumberMasked.value) + Math.random(),
    cardNumber: cardNumberMasked.value,
    holder: cardHolder.value,
    expirationDate: expirationDateMasked.value,
    securityCode: securityCodeMasked.value
  }

  cards.push(card)
  saveCards(cards)
  clearFormFields()
})

document.querySelector('form')?.addEventListener('submit', (event) => {
  event.preventDefault()
})
