import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js'

class Socket {
    constructor(server) {
        this.io = new Server(server, {
            // CORS(Cross-Origin Resource Sharing)를 허용
            cors: {
                origin:'*'  
            }
        })
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;  // 해당 토큰을 눈에 보이지 않게 header에 전달
            if(!token){
                return next(new Error('Authentication Error'))
            }
            jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
                if(error){
                    return next(new Error('Authentication Error'))
                }
                next()
            })
        })

        this.io.on('connection', () => {
            console.log('Socket client connected!')
        })
    }
}

let socket;
export function initSocket(server){
    if(!socket){
        socket = new Socket(server)
    }
}

export function getSocketIO(){
    if(!socket){
        throw new Error('init를 먼저 호출해주세요!')
    }
    return socket.io;
}