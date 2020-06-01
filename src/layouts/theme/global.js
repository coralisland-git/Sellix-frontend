import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

    h1, h2, h3, h4, h5, p, label, a, th, td, input, select, textarea, 
    .Select-placeholder, .close span, span.price, .neutral-count,
    .order-detail-info span,
    .stock-info span {
        color: ${({ theme }) => theme.text} !important;
    }

    
    .admin-container {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }

    .sweet-alert h2 {
        color: rgb(89, 89, 89) !important;
    }

    .text-green {
        color: #2BB224 !important;
    }

    .text-red {
        color: #f74141  !important;
    }

    .shop-container {
        background-color: ${({ theme }) => theme.shopContainerBackground} !important;
    }

    .shop-container .shop-section {
        background-color: ${({ theme }) => theme.shopSectionBackground} !important;
    }

    .shop-product-screen .filter-button button:not(.btn-primary),
    .productsort-screen .filter-button button:not(.btn-primary),
    .shop-container header,
    .admin-container .app-header {
        background: ${({ theme }) => theme.cardBody} !important;
    }

    .moon-icon {
        color: ${({ theme }) => theme.moonIconColor} !important;
    }

    
    .admin-container .app-header *:not(.badge) {
        color: ${({ theme }) => theme.text};
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: ${({ theme }) => theme.tableStripedRowBG} !important;
    }

    .shop-container .app-header .dropdown-item,
    .admin-container .app-header .dropdown-item {
        color: ${({ theme }) => theme.headerDropDownColor} !important;
        i {color: ${({ theme }) => theme.headerDropDownColor};}
    }

    .order-screen {
        .text-completed {
            color: ${({ theme }) => theme.textCompleted} !important;
        }
        .text-pending {
            color: ${({ theme }) => theme.textPending} !important;
        }
        .text-cancelled {
            color: ${({ theme }) => theme.textCancelled} !important;
        }
        .text-partial {
            color: ${({ theme }) => theme.textPartial} !important;
        }
    }

    .shop-container .app-header .dropdown-item:hover,
    .shop-container .app-header .dropdown-item.active,
    .admin-container .app-header .dropdown-item:hover,
    .admin-container .app-header .dropdown-item.active {
        background: ${({ theme }) => theme.headerDropDownActiveBGColor} !important;
        color: ${({ theme }) => theme.headerDropDownActiveColor} !important;
        i {color: ${({ theme }) => theme.headerDropDownActiveColor} !important;}
    }

    

    .admin-container .sidebar {
        background: ${({ theme }) => theme.body};
    }

    .switch-primary .switch-input:checked + .switch-slider {
        background-color: #613BEA !important;
    }

    .bitcoin-paying-screen .bottom,
    .detail-product-screen .stock-info {
        background-color: ${({ theme }) => theme.stockInfoBg};
        
    }

    .bitcoin-paying-screen .bottom h4,
    .bitcoin-paying-screen .bottom h5 {
        color: ${({ theme }) => theme.text} !important;
    }

    .new-select i {
        color: ${({ theme }) => theme.text} !important;
    }

    .detail-product-screen .pay-button {
        background-color: ${({ theme }) => theme.payButton} !important;
        border: 1px solid ${({ theme }) => theme.payButtonBorder} !important;
    }

    .detail-product-screen .stock-info {
        // background: ${({ theme }) => theme.cardBody};
    }


    .page_description_card {
        // background-color: #fcfdfd;
        border-right: 1px solid ${({ theme }) => theme.borderRight} !important;
      
        @media (max-width: 991px){
          & {
            border-right: none !important;
            border-bottom: 1px solid ${({ theme }) => theme.borderRight} !important;
          }
        }
      }

    .border-right,
    .border-bottom {
        border-color: ${({ theme }) => theme.borderRight} !important;
    }

    .bitcoin-paying-screen .top .btc-address,
    .searchbar .header-search-input,
    table tbody td .badge-normal,
    .Select-control,
    .react-datepicker__input-container input,
    .create-product-screen .payment-checkbox,
    .create-product-screen .file-switch .switch-slider,
    .image-uploader .drag-drop-area,
    .btn-default,
    .detail-product-screen .paypal-instant,
    .datepicker2
      {
        background-color: ${({ theme }) => theme.widget} !important;
        border: 1px solid ${({ theme }) => theme.widgetBorder} !important;
    }

    table tbody td {
        border-top: 1px solid ${({ theme }) => theme.tdBorder} !important;
    }

    .react-bootstrap-daterangepicker-container button {
        background-color: ${({ theme }) => theme.widget} !important;
    }

    .form-control {
        background-color: ${({ theme }) => theme.widget} !important;
        border: 1px solid ${({ theme }) => theme.widgetBorder} !important;
    }

    .card .card-header .header-search-input,
    .query-sorting {
        background-color: ${({ theme }) => theme.cardBody} !important;
        border: 1px solid ${({ theme }) => theme.widgetBorder} !important;
    }

    .react-bs-table-container .react-bs-table {
        background-color: ${({ theme }) => theme.cardBody} !important;
    }

    .order-screen .live-card .card-body,
    .dashboard-screen .card.grey .card-body,
    .blacklist-screen .card.grey .card-body
        background-color: ${({ theme }) => theme.widget} !important;
        background: ${({ theme }) => theme.widget} !important;
        // border: 1px solid ${({ theme }) => theme.cardBody} !important;
    }

    .dashboard-screen .card .card-body h3,
    .analytics-screen .card.grey .card-body h3 {
        color: ${({ theme }) => theme.text} !important;
    }

    .admin-container .sidebar,
    .settings-sidebar,
    .card.grey .card-body {
        background: ${({ theme }) => theme.cardBody} !important;
    }

    .shop-container .app-header .dropdown-item,
    .admin-container .app-header .dropdown-item {
        background: ${({ theme }) => theme.dropdownColor} !important;
        color: ${({ theme }) => theme.text};
    }

    .shop-container .shop-navs .nav-link {
        background-color: ${({ theme }) => theme.shopSectionBackground} !important;
    }

    .shop-container .report-count {
        background-color: ${({ theme }) => theme.shopSectionBackground} !important;
    }

    .admin-container footer {
        background-color: ${({ theme }) => theme.shopContainerBackground} !important;
        background: ${({ theme }) => theme.shopContainerBackground} !important;
    }

    .app-header .navbar-nav .dropdown-menu:after {
        border-bottom: 10px solid ${({ theme }) => theme.dropdownColor} !important;
    }

    .order-screen .filter-btn {
        background-color: ${({ theme }) => theme.shopContainerBackground};
    }

    .card-body {
        background: ${({ theme }) => theme.cardBody} !important;
    }

    .admin-container .logo-background {
        background-color: ${({ theme }) => theme.cardBody} !important;
    }

    .shop-product-screen .product-card, .productsort-screen .product-card {
        background-color: ${({ theme }) => theme.cardBody} !important;
    }

    .shop-product-screen .card.grey .card-body,
    .productsort-screen .card.grey  .card-body {
        background: ${({ theme }) => theme.body} !important;
        background-color: ${({ theme }) => theme.body} !important;
    }

    .detail-product-screen .card,
    .bitcoin-paying-screen .card {
        background-color: ${({ theme }) => theme.cardBody} !important;
    }
    
    .modal-dialog .modal-content .modal-header,
    .modal-dialog .modal-content {
        background-color: ${({ theme }) => theme.cardBody} !important;
    }


    .productsort-screen .item,
    .categorysort-screen .item {
        border-bottom-color:  ${({ theme }) => theme.sortItemBorder} !important;
    }

    .productsort-screen .floating .item,
    .categorysort-screen .floating .item {
        background-color: ${({ theme }) => theme.sortItemBackground} !important;
    }

    ${({theme}) => theme.name === 'dark' && `
        .mde-header * {
            color: ${theme.text} !important;
        }

        .react-mde, .react-mde *:not(.selected) {
            border-color: ${theme.payButtonBorder} !important;
        }

        .mde-header {
            background: ${theme.cardBody}
        }

        .react-mde textarea {
            background: ${theme.body}
        }

        .react-mde .grip {
            background: ${theme.cardBody}
        }
    `}

    .feedback-shop-screen .badge {
        background: ${({ theme }) => theme.widgetBorder} !important;
    }

    .transparent-bg {
        background: transparent !important;
    }

    .cursor-pointer {
        cursor: pointer;
    }
     
    ${({theme}) => theme.name === 'dark' && `
        *[class$=control] {
            background-color: ${theme.widget} !important;
            border: 1px solid ${theme.widgetBorder} !important;
        }

        *[class$=control] *:not(.text-green):not(.text-red):not(.text-gold) {
            color: ${theme.text} !important;
        }

        *[class$=-menu] {
            background-color: #241e4c !important;
            border-radius: 5px !important;
            color: ${theme.text} !important;
        }

        *[class$=-menu] *[class$=-option] {
            background-color: #241e4c !important;
            cursor:pointer;
        }

        *[class$=-menu] *[class$=-option]:hover {
            background-color: ${theme.widget} !important;
            color: white !important;
        }

        *[class$=control] *:not(.text-green):not(.text-red):not(.text-gold) {
            color: ${theme.text} !important;
        }

        *[class$=multiValue] * {
            color: black !important;
        }

        .go-back-btn {
            background: #270e84 !important;
            color: white !important;
            border: none !important;
        }

        .go-back-btn:hover {
            background: #230c76 !important;
        }

        .quantity-picker.text-grey {
            opacity: 0.5 !important;
        }
    `}

    *:not([class$=-singleValue]) > .option-select-option.is-selected span:not(.text-gold):not(.text-green):not(.text-red) {
        color: ${({ theme }) => theme.baseOpposite} !important;
    }

    *:not([class$=-singleValue]) > .option-select-option:hover span:not(.text-gold):not(.text-green):not(.text-red) {
        color: ${({ theme }) => theme.baseOpposite} !important;
    }
    
    ${({theme}) => theme.name === 'light' && `
        .option-select > * > * > *:not([class$=-singleValue]):not([class$=-indicatorContainer]):not([class$=-Input]) {
            background: white !important;
        }

        .option-select-option:not(.is-disabled) *:not(.text-gold):not(.text-green):not(.text-red) {
            color: black !important;
        }

        .option-select-option:not(.is-disabled):not(.is-selected) * {
            opacity: 0.85 !important;
        }

        *[class$=-control][class*=css-]{
            background-color: #FCFCFE !important;
            border: 1px solid ${theme.widgetBorder} !important;
        }

        *[class$=-singleValue] > .option-select-option span:not(.text-gold):not(.text-green):not(.text-red) {
            color: rgba(0,0,0,.9) !important;
        }
    `}

    .currency-select {
        top: 0;
        height: 100%;
    }

    .currency-select > div:first-of-type {
        height: 100%;
    }
`