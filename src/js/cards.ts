import '../css/index.css'
import '../css/cards.css'
import { getCards, saveCards } from './utils/localStorage'
import { colors } from './utils/cardsColors'

const cards = getCards()

const cardsSection = document.querySelector('.cc-section') as HTMLElement
const noCardsDiv = document.querySelector('.cc-empty') as HTMLElement

if (cards.length !== 0) {
  noCardsDiv.style.display = 'none'
} else {
  cardsSection.style.display = 'none'
}

cards.forEach((card) => {
  cardsSection.innerHTML += `
  <div data-id='${card.id}'>
    <div class="cc">
      <div class="cc-bg">
        <svg
        width="360"
        height="230"
        viewBox="0 0 360 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_3_2547"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="360"
            height="230"
          >
            <rect width="360" height="230" rx="15.4011" fill="#16084C" />
          </mask>
          <g mask="url(#mask0_3_2547)">
            <g filter="url(#filter0_f_3_2547)">
              <path
                d="M451.518 -135.506C473.881 -89.3531 414.166 -13.4917 318.142 33.9349C222.118 81.3615 126.147 82.3939 103.784 36.2409C81.4215 -9.91221 141.136 -85.7735 237.16 -133.2C333.184 -180.627 429.156 -181.659 451.518 -135.506Z"
                fill=${colors[card.type][0]}
              />
            </g>
            <g filter="url(#filter1_f_3_2547)">
              <path
                d="M399.134 -169.756C421.497 -123.603 361.783 -47.742 265.758 -0.315356C169.734 47.1113 73.7629 48.1437 51.4003 1.99062C29.0377 -44.1624 88.7521 -120.024 184.776 -167.45C280.8 -214.877 376.772 -215.909 399.134 -169.756Z"
                fill=${colors[card.type][1]}
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_3_2547"
              x="43.2629"
              y="-225.286"
              width="468.777"
              height="351.306"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="27.9144"
                result="effect1_foregroundBlur_3_2547"
              />
            </filter>
            <filter
              id="filter1_f_3_2547"
              x="-9.12087"
              y="-259.536"
              width="468.777"
              height="351.306"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="27.9144"
                result="effect1_foregroundBlur_3_2547"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div class="cc-logo">
        <span>
          <img src="/cc-icon.svg" alt="ícone padrão de cartão" />
        </span>
        <span>
          <img
            src="/cc-default.svg"
            alt="ícone do cartão de crédito selecionado"
          />
        </span>
      </div>

      <div class="cc-info">
        <div class="cc-number">${card.cardNumber}</div>

        <div class="cc-holder">
          <div class="label">Nome do titular</div>
          <div class="value">${card.holder}</div>
        </div>

        <div class="cc-extra">
          <div class="cc-expiration">
            <div class="label">Expiração</div>
            <div class="value">${card.expirationDate}</div>
          </div>
          <div class="cc-security">
            <div class="label">CVC</div>
            <div class="value">${card.securityCode}</div>
          </div>
          <img src="/cc-chip.svg" alt="ícone de chip de cartão de crédito" />
        </div>
      </div>
    </div>

    <button type="button" class="remove-cc">
      Remover cartão
    </button>
  </div>
  `
})

const removeButtons = document.querySelectorAll<HTMLButtonElement>('.remove-cc')

removeButtons.forEach((button) => {
  button.onclick = () => {
    removeCard(button)
  }
})

function removeCard(cardButton: HTMLButtonElement) {
  const cardId = cardButton.parentElement?.getAttribute('data-id')
  const cardIndex = cards.findIndex(item => item.id === cardId)

  cards.splice(cardIndex, 1)
  cardButton.parentElement?.remove()

  saveCards(cards)

  if (cards.length === 0) {
    noCardsDiv.style.display = 'flex'
    cardsSection.style.display = 'none'
  }
}
