import React from 'react'
import config from 'constants/config'
import { Card } from 'components/reactstrap';
import Sellix from "../../assets/images/Sellix_logo.svg";


const GroupCard = ({ group, preventDefault, onClick, center_group_titles }) => {

    let { file_name, title, products_bound } = group;

    const minPrice = Math.min(...products_bound.map(p => parseFloat(p.price_display)))
    const productWithMinPrice = products_bound.find(p => parseFloat(p.price_display) == minPrice) || {}

    let image = Sellix;
    if(file_name) {
        image = config.CDN_GROUPS_URL + file_name;
    }

    return <Card className="bg-white p-0 product-card" onClick={() => preventDefault ? null : onClick && onClick()}>
            <div style={{ minHeight: 150, width: '100%' }}>
                <img src={image} alt={title} style={file_name ? {} : { padding: "3rem", objectFit: "fill" }}/>
            </div>
            
            <div className="p-3 d-flex flex-column h-100">
                <h5 className={center_group_titles ? "mb-1 text-black text-center" : "mb-1 text-black"}>{title}</h5>
                <div className="d-flex justify-content-between mt-1">
                    <span>
                    <span className="stock">Starting at: </span>
                    <span className="price">{config.CURRENCY_LIST[productWithMinPrice.currency]}{productWithMinPrice.price_display}</span>
                    </span>
                    <span className="stock">
                        Group
                    </span>
                </div>
            </div> 
        </Card>
}

export default GroupCard;