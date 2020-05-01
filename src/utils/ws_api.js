import config from 'constants/config'
import jwtDecode from 'jwt-decode'

const ws = new WebSocket(config.WS_URL)

const callbackByKey = {}

ws.addEventListener('open', function open() {
    console.log('opened')
});

ws.addEventListener('message', function incoming(response) {
    const data = JSON.parse(response.data).data
    for(const key in data) {
        if(callbackByKey[key]) {
            callbackByKey[key](data[key])
        }
    }
});

export function sendWsMessage(json, responseKey) {
    return new Promise(resolve => {
        callbackByKey[responseKey] = resolve
        ws.send(JSON.stringify(json))
    })
}

export function sendAuthedWsMessage(json, responseKey) {
    return sendWsMessage({
        jwt: localStorage.accessToken,
        ...json
    }, responseKey)
}
