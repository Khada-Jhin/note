var net = require('net')
var fs= require('fs')
var server = net.createServer()
const prot = 80
server.on('connection', conn =>{
  conn.on('data', d=>{
    var d= d.toString()
    console.log(d);
    
    var lines = d.split('/r/n')
    var firstLine= lines.shift()
    var [method, path] = firstLine.split(' ')
    var fileContent = fs.readFileSync('.' + path)

    try {
      var fileContent = fs.readFileSync('.' + path)
    } catch (error) {
      //console.log(error);
      fileContent = 'error'
    }
    
    conn.write(`HTTP/1.1 200 OK\r\n`)
    //conn.write(`content-Type: text/html\r\n`)
    conn.write(`\r\n`)
    conn.write(fileContent)
    conn.end()
    
  })
})

server.listen(prot, () => {
  console.log('server listening on port', prot);
  
})