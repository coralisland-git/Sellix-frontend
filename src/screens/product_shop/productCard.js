import React from 'react'
import config from 'constants/config'
import { Card } from 'reactstrap';
import LazyImage from "react-lazy-progressive-image";
import Sellix from '../../assets/images/Sellix_logo.svg';


export const getProductStock = ({ type, file_stock, stock, service_stock }) => {
    switch (type) {
        case 'file':
            return file_stock === '-1' ? '∞' : file_stock
        case 'serials':
            return stock === '-1' ? '∞' : stock
        case 'service':
            return service_stock === '-1' ? '∞' : service_stock
    }
}

const ProductCard = ({ product, preventDefault, history }) => {

    let { image_attachment, title, price_display, currency, uniqid } = product;

    return <Card className="bg-white p-0 product-card" onClick={() => preventDefault ? null : history.push({ pathname: `/product/${uniqid}` })}>
            <div style={{ minHeight: 150, width: '100%' }}>
                <LazyImage placeholder={Sellix} src={config.API_ROOT_URL + '/attachments/image/' + image_attachment}>
                    {src => <img src={src} alt={title} style={image_attachment ? { objectFit: "fill" } : { objectFit: "fill", padding: "1rem" }}/>}
                </LazyImage>
            </div>
            
            <div className="p-3 d-flex flex-column h-100">
                <h5 className="mb-1 text-black">{title}</h5>
                <div className="d-flex justify-content-between mt-1">
                    <span className="price">{`${config.CURRENCY_LIST[currency]}${price_display}`}</span>
                    <span className="stock">
                        Stock <span className="stock-size" style={getProductStock(product) === '∞' ? { position: 'relative', top: '1px' } : getProductStock(product) == 0?{color:'red'}:{}}>{getProductStock(product)}</span>
                    </span>
                </div>
            </div> 
        </Card>
}

export default ProductCard;