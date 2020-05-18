import React, { useState } from 'react'
import { api } from 'utils'
import { Loading } from 'components'
import { Container } from 'components/reactstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CommonActions } from 'services/global'
import {createChangelog} from './actions'

import "./styles.scss";

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    createChangelog: bindActionCreators(createChangelog, dispatch),
  })
}
const mapStateToProps = (state) => {
  return ({

  })
}


function ChangelogItem({ item }) {

  const [showMore, setShowMore] = useState(false)

  const hasShowMore = item.message.length > 75

  return <div className={"changelog-container"}>
    <h4>{item.title}</h4>
    <div className={"changelog"}>
      <p>{item.display_date}</p>
      <p style={{ padding: '0 3rem', width: "30rem" }}>{hasShowMore && !showMore ? item.message.substr(0, 75) + '...' : item.message}</p>
      <div className={'changelog-badge'}>{item.badge}</div>
    </div>
    {hasShowMore && <span onClick={() => setShowMore(!showMore)} className={'changelog-show-more'}>Show {showMore ? 'less' : 'more'}</span>}
  </div>
}

export class Changelog extends React.Component {

  state = {
    changelog: null
  }

  componentDidMount() {
    document.title = `Changelog | Sellix`;

    return api.get('/changelog')
      .then(res => {
        if (res.status === 200) {
          this.setState({
            changelog: res.data.changelog
          })
        } else {
          throw res
        }
      }).catch(err => {
        throw err
      })
  }

  render() {
    const { changelog } = this.state

    return <div className={'changelog-screen'}>
      <div className="section text-center">
        <Container className="home-container" fluid>
          <h1>Changelog</h1>
          <p className={'large'}>Latest notable changes</p>
        </Container>
      </div>

      <div className="section text-center bg-white" style={{ paddingBottom: "5rem", display: 'flex'}}>
        <Container className="home-container d-flex flex-column justify-content-center align-items-center">
          {changelog === null ? <Loading /> : changelog.map((item, key) => <ChangelogItem key={key} item={item} />)}
        </Container>
      </div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Changelog)