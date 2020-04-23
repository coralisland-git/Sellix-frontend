import React from 'react'
import config from 'constants/config'
import { Card } from 'reactstrap';

const GroupCard = ({ group, preventDefault, history }) => {

    let { image_attachment, title, uniqid, products_bound } = group;

    const minPrice = Math.min(...products_bound.map(p => parseFloat(p.price_display)))
    const productWithMinPrice = products_bound.find(p => parseFloat(p.price_display) == minPrice)

    return <Card className="bg-white p-0 product-card" onClick={() => preventDefault ? null : history.push({ pathname: `/group/${uniqid}` })}>
            <div style={{ minHeight: 150, width: '100%' }}>
                {image_attachment && <img src={config.API_ROOT_URL + '/attachments/image/' + image_attachment} alt={title} />}
            </div>
            
            <div className="p-3 d-flex flex-column h-100">
                <h5 className="mb-1 text-black">{title}</h5>
                <div className="d-flex justify-content-between mt-1">
                    <span className="stock">Starting at: {config.CURRENCY_LIST[productWithMinPrice.currency]}{productWithMinPrice.price_display}</span>
                    <span className="stock">
                        Count: <span className="stock-size">{products_bound.length}</span>
                    </span>
                </div>
            </div> 
        </Card>
}

export default GroupCard;