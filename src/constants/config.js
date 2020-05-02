import paypalIcon from "../assets/images/crypto/paypal.svg";
import bitcoinIcon from "../assets/images/crypto/btc.svg";
import litecoinIcon from "../assets/images/crypto/ltc.svg";
import ethereumIcon from "../assets/images/crypto/eth.svg";
import perfectmoneyIcon from "../assets/images/crypto/perfectmoney.svg";
import stripeIcon from "../assets/images/crypto/stripe.svg";
import bitcoincashIcon from "../assets/images/crypto/bitcoincash.svg";
import skrillIcon from "../assets/images/crypto/skrill.svg";
import { Converter } from "showdown";

export default {

  // API_ROOT_URL: 'https://staging.sellix.io/api/v1',
  API_ROOT_URL: 'https://api.sellix.io/v1',
  WS_URL: 'wss://wss.sellix.io/websocket',
  CAPTCHA_SITE_KEY: '6LdwUeAUAAAAAEe0KlqQT1YaH3Gu18qCm1HFF0Fe',
  CURRENCY_LIST : { 
    'USD': '$',
    'EUR': '€',
    'AUD': '$',
    'GBP': '£',
    'JPY': '¥',
    'CAD': '$',
    'CHF': '₣',
    'CNY': '¥',
    'SEK': 'kr',
    'NZD': '$'
  },
  DISCORD_CONNECT_URL: 'https://discordapp.com/oauth2/authorize?client_id=694529072046407703&permissions=2048&scope=bot',

  PAYMENT_ICONS: {
    paypal: paypalIcon,
    bitcoin: bitcoinIcon,
    litecoin: litecoinIcon,
    ethereum: ethereumIcon,
    perfectmoney: perfectmoneyIcon,
    stripe: stripeIcon,
    bitcoincash: bitcoincashIcon,
    skrill: skrillIcon
  },

  PAYMENT_LABELS: {
    'paypal': 'PayPal',
    'bitcoin': 'Bitcoin',
    'litecoin': 'Litecoin',
    'ethereum': 'Ethereum',
    'stripe': 'Stripe',
    'perfectmoney': 'Perfect Money',
    'bitcoincash': 'Bitcoin Cash',
    'skrill': 'Skrill'
  }
}

export const converter = new Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true
});
