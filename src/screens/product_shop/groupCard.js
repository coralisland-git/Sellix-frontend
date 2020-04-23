import React from 'react'
import config from 'constants/config'
import { Card } from 'reactstrap';

const GroupCard = ({ group, preventDefault, history }) => {

    let { image_attachment, title, uniqid } = group;

    return <Card className="bg-white p-0 product-card" onClick={() => preventDefault ? null : history.push({ pathname: `/group/${uniqid}` })}>
            <div style={{ minHeight: 150, width: '100%' }}>
                {image_attachment && <img src={config.API_ROOT_URL + '/attachments/image/' + image_attachment} alt={title} />}
            </div>
            
            <div className="p-3 d-flex flex-column h-100">
                <h5 className="mb-1 text-black">{title}</h5>
                <div className="d-flex justify-content-between mt-1">
                    <span className="price"></span>
                    <span className="stock">
                        Group
                    </span>
                </div>
            </div> 
        </Card>
}

export default GroupCard;