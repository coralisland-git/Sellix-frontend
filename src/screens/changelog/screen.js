import React, { useState, useEffect } from 'react'
import { api } from 'utils'
import { Loading } from 'components'

function ChangelogItem({item}) {

  const [showMore, setShowMore] = useState(false)

  const hasShowMore = item.message.length > 75

  return <div style={{
    display: 'flex',
    maxWidth: '800px',
    paddingBottom: '40px',
    borderBottom: '1px solid rgba(0,0,0,.1)',
    marginBottom: '40px'
  }}>
    <p style={{
      width: '170px'
    }}>
      {item.display_date}
    </p>
    <div style={{
      width: '550px'
    }}>
      <h4>{item.title}</h4>
      <p style={{
        margin: '20px 0'
      }}>{hasShowMore && !showMore ? item.message.substr(0, 75) + '...' : item.message}</p>
      {hasShowMore && <span onClick={() => setShowMore(!showMore)} style={{
        color: showMore ? '#707070' : '#613BEA',
        borderBottom: showMore ? 'none' : '1px solid #613BEA',
        marginLeft: '3px',
        paddingBottom: '2px',
        cursor: 'pointer',
        fontWeight: showMore ? 'bold' : 'normal'
      }}>Show {showMore ? 'less' : 'more'}</span>}
    </div>
    <div style={{
        marginLeft: '30px',
        background: 'rgb(228, 214, 255)',
        color: 'rgb(97, 59, 234)',
        display: 'inline-block',
        padding: '10px',
        height: '35px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: '5px'
    }}>{item.badge}</div>
  </div>
}

export class Changelog extends React.Component {

  state = {
    changelog: null
  }

  componentDidMount() {
    document.title = `Changelog | Sellix`;
    let data = {
      method: 'GET',
      url: '/changelog'
    }

    return api(data).then(res => {
      console.log(res)
        if(res.status == 200)
            return this.setState({
              changelog: res.data.changelog
            })
        else throw res
    }).catch(err => {
        throw err
    })
  }

  render() {
    const { changelog } = this.state

    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '50px'
    }}>
      <h1>Changelog</h1>
      <p>Latest notable changes</p>
      <div style={{
        marginTop: '30px'
      }}>
        { changelog === null ? Loading() : changelog.map(item => <ChangelogItem item={item}/>)}
      </div>
    </div>
  }
}

export default Changelog