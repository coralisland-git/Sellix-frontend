import React from 'react'
import { Card, CardBody, Row, Col, FormGroup } from 'components/reactstrap'
import { Loader } from 'components'

import './style.scss'

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const Goods = ({ loading, order }) => {

    return (
        <Card>
            <CardBody className="goods">
                {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                {!loading &&
                <Row className="">
                    <Col lg={12}>
                        <FormGroup className="mb-4">
                            <h4 className="title">Delivered Goods</h4>
                        </FormGroup>
                    </Col>
                    <Col lg={12}>
                        <Row style={{ maxHeight: "20rem", overflowY: "scroll" }}>
                            <Col lg={12}>
                                    {order.product_type === "serials" &&
                                    (order.serials && order.serials.length ? <pre>{order.serials.map(serial => <span key={serial}>{serial}</span>)}</pre> : <label>No product has been delivered</label>)}
                                    {order.product_type === "service" &&
                                    (order.service_text ? <pre><span>{order.service_text}</span></pre> : <label>No product has been delivered</label>)}
                                    {order.product_type === "file" &&
                                    (order.file ? <pre><span>File Name: {order.file.original_name}</span><br/><span>Size: {formatBytes(order.file.size)}</span></pre> : <label>No product has been delivered</label>)}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                }
            </CardBody>
        </Card>
    )
}

export default Goods
