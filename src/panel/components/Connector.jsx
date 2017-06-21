import React from 'react'
import { PageConnection as LivePageConnection, MockPageConnection } from '../io'
import App from './App.jsx'
import './Connector.scss'

let PageConnection = LivePageConnection

if (process.env.NODE_ENV !== 'production') {
    PageConnection = MockPageConnection
}

export default class Connector extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            json: null,
        }
    }
    componentDidMount () {
        const conn = new PageConnection((msg) => {
            if (msg) {
                this.setState({ json: msg })
            } else {
                this.setState({ json: null })
            }
        })
        this._timer = setInterval(() => {
            conn.requestJSONFromBackground()
        }, 100)
    }
    componentWillUnmount () {
        clearInterval(this._timer)
    }

    render () {
        return (<div styleName="main">
            {this.state.json ?
                <App json={this.state.json} /> :
                <div>Connecting...</div>
            }
        </div>)
    }
}