import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { converter } from 'constants/config'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { CommonActions } from 'services/global'
import { Loader, Affix } from 'components'
import ShopProductDetail from '../detail/screen'
import { Loading } from 'components'
import { api } from 'utils'
import Select from 'react-select'
import { getProductStock } from 'screens/product_shop/productCard';
import config from 'constants/config';


class ShopGroupModal extends React.Component {

  state = {
    loading: true,
    selectedProduct: null
  }

  componentDidMount() {
    const { group } = this.props

    this.setState({
      selectedProduct: group.products_bound[0]
    })
  }

  formatProductOption = product => {
    const rating = product.average_score || 0

    const isRatingGold = rating > 4

    const isSelected = product.uniqid === this.state.selectedProduct.uniqid

    return <div className={"option-select-option " + (isSelected && "is-selected")}>
      <div>
        <span>{product.title}</span>
        <span className={isRatingGold && "text-gold"} style={{marginLeft: '10px'}}>
          <span className={isRatingGold && "text-gold"} style={{fontSize: '18px', position: 'relative'}}>⭑</span>
        {rating.toFixed(2)}</span>
      </div>
      <div style={{margin: '2px 0'}}>
        <span className="price">{`${config.CURRENCY_LIST[product.currency]}${product.price_display}`}</span>
        <span style={{fontSize: '6px', position: 'relative', top: '-3px', marginLeft: '5px', marginRight: '5px'}}>
          {'  ●  '}
        </span>
        <span className="stock">
            <span className="stock-size" style={getProductStock(product) === '∞' ? { position: 'relative', top: '1px' } : getProductStock(product) == 0?{color:'red'}:{}}>{getProductStock(product)}</span>
            {' '}in stock
        </span>
      </div>
    </div>
  }

  render() {

    const { selectedProduct } = this.state
    let { group, onGoBack, onProductSelect } = this.props;

    return (
      <div>
        <style>
          {`
          body {
            padding-right: 0px !important;
          }
          .text-gold {
            color: gold !important;
          }
          .option-select, .option-select * {
            user-select: none !important;
          }
          .option-select > * > * > *:not([class$=-singleValue]):not([class$=-indicatorContainer]) {
            background: white !important;
            padding: 0;
          }
          *:not([class$=-singleValue]) > .option-select-option {
            padding: 8px 12px;
          }
          *:not([class$=-singleValue]) > .option-select-option:hover {
            background: rgba(0,0,0,.1);
            margin: 0;
            
          }
          *[class$=-singleValue] > .option-select-option span:not(.text-gold) {
            color: rgba(0,0,0,.9) !important;
          }
          *:not([class$=-singleValue]) > .option-select-option:hover span:not(.text-gold) {
            color: black !important;
          }
          *:not([class$=-singleValue]) > .option-select-option.is-selected span:not(.text-gold) {
            color: black !important;
          }
          .option-select > div:first-of-type > div:first-child {
            height: 50px;
          }
          .option-select input {
            opacity: 0 !important;
          }
          `}
        </style>
        <div>
          <Modal isOpen={true} className="blur" centered={true}>
            <ModalHeader><span style={{color: '#613BEA'}}>{group.title}</span></ModalHeader>
            <ModalBody>
              <p>Select option:</p>
              <Select 
                defaultValue={group.products_bound[0]}
                formatOptionLabel={this.formatProductOption}
                options={group.products_bound}
                className="option-select"
                onChange={product => this.setState({ selectedProduct: product})}
                // menuIsOpen={true}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => onProductSelect(selectedProduct)}>Next</Button>{' '}
              <Button color="secondary" onClick={() => onGoBack()}>Go Back</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }
}

export default ShopGroupModal
