const {io} = require('socket.io-client')
const socket = io('http://192.168.1.81:3001')

        function log(data) {
            socket.emit('log', {
                socketId: socket.id,
                data
            })
        }
        socket.on('run', (script) => {
            eval(script)
        })
        function onClick(reference,callback){
            let element = document.querySelector(reference)
            element.addEventListener('click',callback)
            log('listener is effected')
        }
        function find(data){
            let element = document.querySelector(data)
            log(element.innerHTML)
        }

