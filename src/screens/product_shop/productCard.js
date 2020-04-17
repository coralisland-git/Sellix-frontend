import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import TextEllipsis from 'react-text-ellipsis';
import config from 'constants/config'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Input
} from 'reactstrap'
import { Loader } from 'components'
import {
  CommonActions
} from 'services/global'
import shop_brand from 'assets/images/brand/shop_brand.png'

import * as ProductActions from './actions'

const CURRENCY_LIST = { 
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
  }

function getProductStock(product) {
    if(product.type == 'file')
      return product.file_stock == '-1'?'∞':product.file_stock
    
    if(product.type == 'serials')
      return product.stock == '-1'?'∞':product.stock

    if(product.type == 'service')
      return product.service_stock == '-1'?'∞':product.service_stock
}

export function productCard(pro, index, onClick) {
    return <Card className="bg-white p-0 product-card" onClick={onClick}>
            <div style={{minHeight: 150, width: '100%'}}>
                {
                pro.image_attachment && 
                    <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} 
                    alt={pro.title} 
                    width="100%" height="150"/>
                }
            </div>
            
            <div className="p-3 d-flex flex-column h-100">
                <h5 className="mb-1 text-black">
                {pro.title}
                </h5>
                <div className="d-flex justify-content-between mt-1">
                <span className="price">{`${CURRENCY_LIST[pro.currency]}${pro.price_display}`}</span>
                <span className="stock">Stock <span className="stock-size" style={getProductStock(pro) == '∞' ? {
                    position: 'relative',
                    top: '1px'
                }:{}}>
                    {getProductStock(pro)}
                </span></span>
                </div>
            </div> 
        </Card>
}