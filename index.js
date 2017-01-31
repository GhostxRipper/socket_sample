const { Server } = require('ws')
const http = require('http')
const fs = require('fs')

console.log('🤘')

const server = http.createServer((request, response) => {
  const index = fs.readFileSync('public/index.html')
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(index)
})

const webSocket = new Server({ port: 3000 })

webSocket.broadcast = (data) => webSocket.clients.forEach( client => client.send(data) )

webSocket.on('connection', (socket) => {
  socket.on('message', (data) => {
    socket.send(JSON.stringify({ event: 'message', data:data }))
  })

  const id = setInterval(() => {
    socket.send(JSON.stringify({ event: 'recuriveMessage', data: 'yolo' }))
  }, 2500) // 2,5 second

  socket.on('close', () => clearInterval(id))
})

server.listen(6001)
console.log('WebSocket Server run on 127.0.0.1:3000')
console.log('HTTP Server run on 127.0.0.1:6001')
