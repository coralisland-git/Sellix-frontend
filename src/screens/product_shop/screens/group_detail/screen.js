import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Button } from 'components';
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
    const rating = parseFloat(product.average_score || 0)

    const isRatingGold = rating > 4

    const productStock = getProductStock(product)

    const isDisabled = productStock == 0

    const isSelected = product.uniqid === this.state.selectedProduct.uniqid

    return <div className={"option-select-option " + (isSelected && "is-selected") + " " + (isDisabled && "is-disabled")}>
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
            <span className={"stock-size " + (productStock == 0 ? "text-red" : "text-green")} style={productStock === '∞' ? { position: 'relative', top: '1px' } : {}}>{productStock}</span>
            {' '}in stock
        </span>
      </div>
    </div>
  }

  render() {

    const { selectedProduct } = this.state
    let { group, onGoBack, onProductSelect, className, hide_out_of_stock } = this.props;

    if(hide_out_of_stock === 1)
      group.products_bound = group.products_bound.filter(product => getProductStock(product) != 0)

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
          .option-select > * > * > *:not([class$=-singleValue]):not([class$=-indicatorContainer]):not([class$=-Input]) {
            // background: white !important;
            padding: 0;
          }
          *:not([class$=-singleValue]) > .option-select-option {
            padding: 8px 12px;
          }
          *:not([class$=-singleValue]) > .option-select-option:hover {
            background: rgba(0,0,0,.1);
            margin: 0;
            
          }
          .option-select > div:first-of-type > div:first-child {
            height: 50px;
          }
          .option-select input {
            opacity: 0 !important;
          }
          *[class$=-menu] *[class$=-option] {
            cursor: inherit !important;
          }
          .option-select-option.is-disabled {
            opacity: 0.6;
            pointer-events: none;
            cursor: not-allowed !important;
          }
          
          `}
        </style>
        <div>
          <Modal isOpen={true} className="blur" centered={true} className={className}>
            <ModalHeader><span style={{color: '#613BEA'}}>{group.title}</span></ModalHeader>
            <ModalBody>
              <p>Select option:</p>
              <Select 
                defaultValue={group.products_bound[0]}
                formatOptionLabel={this.formatProductOption}
                options={group.products_bound.map(product => {
                  const productStock = getProductStock(product)

                  const isDisabled = productStock == 0

                  return {
                    ...product,
                    isDisabled
                  }
                })}
                className="option-select"
                onChange={product => this.setState({ selectedProduct: product})}
                isSearchable={false}
                // menuIsOpen={true}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => onProductSelect(selectedProduct)}>Next</Button>{' '}
              <Button color="secondary" className="go-back-btn" onClick={() => onGoBack()}>Go Back</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }
}

export default ShopGroupModal
