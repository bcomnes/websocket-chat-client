const URWS = require('universal-reconnecting-websocket')

const ws = new URWS('wss://ws-chat-server.herokuapp.com')
const cw = document.querySelector('.chat-window')
const msgBox = document.querySelector('#message')
const sendButton = document.querySelector('#send-button')

ws.on('state', (state) => {
  const newLine = document.createElement('div')
  newLine.innerText = state
  cw.appendChild(newLine)
})

ws.on('message', (msg) => {
  const newLine = document.createElement('div')
  switch (msg.type) {
    case 'message': {
      newLine.innerText = `${msg.sender}: ${msg.msg}`
      break
    }
    default: {
      newLine.innerText = JSON.stringify(msg)
      break
    }
  }
  cw.appendChild(newLine)
})

ws.on('error', (err) => {
  console.error(err)
  const newLine = document.createElement('div')
  newLine.innerText = err
  cw.appendChild(newLine)
})

ws.on('info', (ev) => {
  console.error(err)
  const newLine = document.createElement('div')
  newLine.innerText = ev
  cw.appendChild(newLine)
})

ws.on('connect', () => { // Handle the connect event maybe
  msgBox.removeAttribute('disabled')
  sendButton.removeAttribute('disabled')
})

ws.on('state', (state) => { // Handle the connect event maybe
  if (state === 'waiting')
  msgBox.setAttribute('disabled', true)
  sendButton.setAttribute('disabled', true)
})

sendButton.addEventListener('click', (ev) => {
  const msg = msgBox.value

  if (msg.startsWith('/name')) {
    ws.send({
      action: 'name',
      name: msg.split('/name ')[1]
    })
  } else {
    ws.send({
      action: 'message',
      msg
    })
  }

  msgBox.value = ""
})


ws.start()
