import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { converter } from 'constants/config'
import { Card, Row, Col } from 'reactstrap'
import { CommonActions } from 'services/global'
import { Loader, Affix } from 'components'
import ShopProductDetail from '../detail/screen'
import { Loading } from 'components'
import { api } from 'utils'


const mapStateToProps = ({ common: { user_products } }) => ({
  user_products
});

const mapDispatchToProps = dispatch => ({
  commonActions: bindActionCreators(CommonActions, dispatch)
});


class ShopGroupDetail extends React.Component {

  state = {
    loading: true,
    selectedProduct: null,
    group: null
  }

  componentDidMount() {
    let data = {
      method: 'GET',
      url: `groups/unique/${this.props.match.params.id}`
    }

    return api(data).then(res => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          group: res.data.group,
          selectedProduct: res.data.group.products_bound[0]
        })
      } else {
        throw res
      }     
    }).catch(err => {
      throw err
    })
  }

  render() {

    const { loading, selectedProduct, group } = this.state

    return loading ? Loading() : (
      <ShopProductDetail {...this.props} selectedProduct={selectedProduct} group={group}
        handleProductChange={product => this.setState({ selectedProduct: product })} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopGroupDetail)
