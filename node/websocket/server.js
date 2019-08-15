let express = require('express')
let http = require('http')
let ws = require('ws')
let app = express()

let server = http.createServer(app)
let wss = new ws.Server({server})
wss.on('connection',(ws, req) => {
  console.log(req.headers);
  ws.send('hello')
  ws.on('message', msg => {
    console.log(msg.toString());
    ws.send(msg.toString().toUpperCase())
  })
})


server.listen(9093, () => console.log(9093))

