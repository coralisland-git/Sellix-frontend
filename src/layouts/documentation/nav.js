import React, {useEffect, useState} from 'react'
import withRouter from "react-router-dom/withRouter"
import AppSidebar from '@coreui/react/es/Sidebar'
import Scrollspy from "react-scrollspy";

import './style.scss'


const NAV = [
  { key: 'get_started', value: 'GET STARTED', level: 1 },
  { key: 'introduction', value: 'Introduction', level: 2 },
  { key: 'authentication', value: 'Authentication', level: 2 },
  { key: 'pagination', value: 'Pagination', level: 2 },
  { key: 'errors', value: 'Errors', level: 2 },
  { key: 'webhooks', value: 'Webhooks', level: 2 },

  { key: 'api_reference', value: 'API REFERENCE', level: 1 },
  { key: 'blacklists', value: 'Blacklists', level: 2 },
  { key: 'blacklist-object', value: 'Blacklist Object' },
  { key: 'blacklist-get', value: 'Get Blacklist' },
  { key: 'blacklist-list', value: 'List Blacklist' },
  { key: 'blacklist-create', value: 'Create a Blacklist' },
  { key: 'blacklist-update', value: 'Update a Blacklist' },
  { key: 'blacklist-destroy', value: 'Destroy a Blacklist' },

  { key: 'categories', value: 'Categories', level: 2 },
  { key: 'category-object', value: 'Category Object' },
  { key: 'category-get', value: 'Get a Category' },
  { key: 'category-list', value: 'List All Categories' },
  { key: 'category-create', value: 'Create a Category' },
  { key: 'category-edit', value: 'Edit Category' },
  { key: 'category-delete', value: 'Delete Category' },

  { key: 'coupons', value: 'Coupons', level: 2 },
  { key: 'coupon-object', value: 'Coupon Object' },
  { key: 'coupon-get', value: 'Get a Coupon' },
  { key: 'coupon-list', value: 'List All Coupons' },
  { key: 'coupon-create', value: 'Create a Coupon' },
  { key: 'coupon-edit', value: 'Edit Coupon' },
  { key: 'coupon-delete', value: 'Delete Coupon' },

  { key: 'feedbacks', value: 'Feedbacks', level: 2 },
  { key: 'feedback-object', value: 'Feedback Object' },
  { key: 'feedback-get', value: 'Get a Feedback' },
  { key: 'feedback-list', value: 'List All Feedback' },
  { key: 'feedback-reply', value: 'Reply Feedback' },

  { key: 'orders', value: 'Orders', level: 2 },
  { key: 'order-object', value: 'Order Object' },
  { key: 'order-get', value: 'Get an Order' },
  { key: 'order-list', value: 'List All Orders' },

  { key: 'products', value: 'Products', level: 2 },
  { key: 'product-object', value: 'Product Object' },
  { key: 'product-get', value: 'Get a Product' },
  { key: 'product-list', value: 'List All Products' },
  { key: 'product-create', value: 'Create a Product' },
  { key: 'product-edit', value: 'Edit Product' },
  { key: 'product-delete', value: 'Delete Product' },

  { key: 'queries', value: 'Queries', level: 2 },
  { key: 'query-object', value: 'Query Object' },
  { key: 'query-get', value: 'Get a Query' },
  { key: 'query-list', value: 'List All Queries' },
  { key: 'query-reply', value: 'Reply Query' },
  { key: 'query-close', value: 'Close Query' },
  { key: 'query-reopen', value: 'Reopen Query' },

  { key: 'sellix_checkout', value: 'SELLIX CHECKOUT', level: 1 },
  { key: 'sellix-checkout', value: 'Payments', level: 2 },
  { key: 'sellix-checkout-flow', value: 'Checkout Flow' },
  { key: 'sellix-checkout-create', value: 'Create a Payment' },
  { key: 'sellix-checkout-delete', value: 'Delete Payment' },
]



export const Nav = ({ history }) => {

  let [activeNode, setActiveNode] = useState(null)
  let [initial, setInitial] = useState(false)

  let hash = history.location.hash.substr(1);

  useEffect(() => {
    if(initial) {
      let elmnt = document.getElementById(hash);
      elmnt.scrollIntoView();
      setInitial(false)
    }

    if (hash !== "") {
      setInitial(true)
    }
  }, [hash])

  const onUpdate = (el) => {
    if(el && ((el.id !== "introduction" && !initial) || !initial)){
      history.push(`/documentation#${el.id}`)
    } else {
      setInitial(false)
    }
    if(el) {
      setActiveNode(el.id.split('-')[0].slice(0, 4))
    }
  }

  return <AppSidebar className="pt-3 mb-5" fixed display="lg" >
    <div className="d-nav">

      <Scrollspy items={ NAV.map((({ key }) => key)) } className="section-nav" currentClassName="active" offset={ -50 } onUpdate={onUpdate}>
        {NAV.map(({ value, level, key }) => level === 1 ?
            <li className="lv-1" key={key}>{value}</li> :
            <li className={ level === 2 ? 'lv-2' : key.indexOf(activeNode) > -1 ? 'lv-3 vs' : 'lv-3' } key={key}>
              <a href={`/documentation#${key}`}>{value}</a>
            </li>
        )}
      </Scrollspy>

    </div>
  </AppSidebar>
}

export default withRouter(Nav)
