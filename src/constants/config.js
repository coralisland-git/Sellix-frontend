import paypalIcon from "../assets/images/crypto/paypal.svg";
import bitcoinIcon from "../assets/images/crypto/btc.svg";
import litecoinIcon from "../assets/images/crypto/ltc.svg";
import ethereumIcon from "../assets/images/crypto/eth.svg";
import perfectmoneyIcon from "../assets/images/crypto/perfectmoney.svg";
import stripeIcon from "../assets/images/crypto/stripe.svg";
import bitcoincashIcon from "../assets/images/crypto/bitcoincash.svg";
import skrillIcon from "../assets/images/crypto/skrill.svg";

import cancelledIcon from 'assets/images/order/Cancelled_Icon.svg'
import completedIcon from 'assets/images/order/Check_Icon.svg'
import paritalIcon from 'assets/images/order/Partially_Icon.svg'
import pendingIcon from 'assets/images/order/Pending_Icon.svg'

import { Converter, extension } from "showdown";


export default {
  // API_ROOT_URL: 'https://staging.sellix.io/api/v1',
  API_ROOT_URL: 'https://api.sellix.io/v1',
  WS_URL: 'wss://wss.sellix.io/websocket',
  CAPTCHA_SITE_KEY: '6LdwUeAUAAAAAEe0KlqQT1YaH3Gu18qCm1HFF0Fe',
  STATUS_ICON: {
    '0': pendingIcon,
    '1': completedIcon,
    '2': cancelledIcon,
    '4': paritalIcon,
  },
  CURRENCY_OPTIONS: [
    { value: 'USD', label: 'USD'},
    { value: 'EUR', label: 'EUR'},
    { value: 'JPY', label: 'JPY'},
    { value: 'GBP', label: 'GBP'},
    { value: 'AUD', label: 'AUD'},
    { value: 'CAD', label: 'CAD'},
    { value: 'CHF', label: 'CHF'},
    { value: 'CNY', label: 'CNY'},
    { value: 'SEK', label: 'SEK'},
    { value: 'NZD', label: 'NZD'},
    { value: 'PLN', label: 'PLN'}
  ],

   ORDER_OPTIONS: [
     {value: 'all', label: 'All'},
     {value: '0', label: 'Pending'},
     {value: '1', label: 'Completed'},
     {value: '2', label: 'Cancelled'},
     {value: '3', label: 'Confirmation'},
     {value: '4', label: 'Partial'}
  ],
  CURRENCY_LIST : { 
    'USD': '$',
    'EUR': '€',
    'AUD': 'A$',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'CHF': '₣',
    'CNY': '¥',
    'SEK': 'kr',
    'NZD': 'ZN$',
    'PLN': 'zł',
  },
  PAYMENT_OPTS : {
    'paypal': 'PayPal',
    'bitcoin': 'BTC',
    'litecoin': 'LTC',
    'ethereum': 'ETH',
    'skrill': 'Skrill',
    'stripe': 'Stripe',
    'bitcoincash': 'BCH',
    'perfectmoney': 'Perfect Money'
  },

  PAYMENT_OPTS_FULL_NAME : {
    'paypal': 'PayPal',
    'bitcoin': 'Bitcoin',
    'litecoin': 'Litecoin',
    'ethereum': 'Ethereum',
    'skrill': 'Skrill',
    'stripe': 'Stripe',
    'bitcoincash': 'Bitcoin Cash',
    'perfectmoney': 'Perfect Money'
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
  },
  ORDER_STATUS: {
    '0': 'Pending',
    '1': 'Completed',
    '2': 'Cancelled',
    '3': 'Confirmation',
    '4': 'Partial'
  },

  TYPE_OPTIONS: [
    { value: 'file', label: 'File' },
    { value: 'serials', label: 'Serials' },
    { value: 'service', label: 'Service' },
  ],

  DELIMITER_OPTIONIS: [
    { value: 'comma', label: 'Comma' },
    { value: 'newline', label: 'New Line' },
    { value: 'custom', label: 'Custom' }
  ],

  CUSTOM_TYPE: [
    { value: 'number', label: 'Number' },
    { value: 'text', label: 'Text' },
    { value: 'hidden', label: 'Hidden' },
    { value: 'largetextbox', label: 'Large Textbox' },
    { value: 'checkbox', label: 'Checkbox' },
  ]
}

extension('targetlink', () => [{
  type: 'html',
  filter: (text) => (''+text).replace(/<a\s+href=/gi, '<a target="_blank" href=')
}])

export const converter = new Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
  extensions: ['targetlink']
});
