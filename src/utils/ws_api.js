import config from 'constants/config'

var ws = null

const callbackByKey = {}

function incomingListener(response) {
    const data = JSON.parse(response.data).data
    for(const key in data) {
        if(callbackByKey[key]) {
            callbackByKey[key](data[key])
        }
    }
};

function lazyWsSend(message) {
    if(ws === null) {
        ws = new WebSocket(config.WS_URL)
        ws.addEventListener('open', function open() {
            console.log('ws opened')
            ws.send(message)
        });
        ws.addEventListener('message', incomingListener)
    } else {
        ws.send(message)
    }
}

export function sendWsMessage(json, responseKey) {
    return new Promise(resolve => {
        callbackByKey[responseKey] = resolve
        lazyWsSend(JSON.stringify(json))
    })
}

export function sendAuthedWsMessage(json, responseKey) {
    return sendWsMessage({
        jwt: localStorage.accessToken,
        ...json
    }, responseKey)
}
