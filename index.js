import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import StudentRouter from './router/student.js'
import ScoreRouter from './router/score.js'
import { config } from './config.js'
import { initSocket } from './connection/socket.js'
import { sequelize } from './db/database.js'

const app = express()

//미들웨어 
app.use(express.json())  
app.use(cors())
app.use(morgan('tiny'))  // 사용자들이 접속하면 log를 콘솔에 찍음(HTTP 요청 로깅을 간단하게 처리하고자 할 때 사용)

// router
app.use('/student', StudentRouter)
app.use('/score', ScoreRouter)

// app.use((req, res, next) => {
//     res.sendStatus(404)
// })

// DB 연결 확인하기
sequelize.sync().then(() => {
    // console.log(client)
    const server = app.listen(config.host.port)  
    initSocket(server); 
    
})

// 서버에러
app.use((error, req, res, next) => {
    console.log(error)
    res.sendStatus(500)
})
