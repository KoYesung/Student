import dotenv from 'dotenv'
dotenv.config()

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if(value == null) {
        throw new Error(`Key ${key} is undefined`)
    }
    return value;
}


export const config = {
    // //jwt에 관한 모든 것을 객체로 저장
    // jwt: {
    //     secretKey: required('JWT_SECRET'),
    //     expireInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)) // 숫자로 변환시킴, 혹시 env에 값이 없을 때 86400이 작동됨(기본값)
    // },
    // bcrypt: {
    //     saltRounds:parseInt(required('BCRYPT_SALT_ROUND', 12))  // 기본값은 12로 설정
    // },
    host: {
        port:parseInt(required('SERVER_PORT', 8080))  // 기본값은 8080
    },
    db: {
        host:required('DB_HOST'),
        user:required('DB_USER'),
        database:required('DB_DATABASE'),
        password:required('DB_PASSWORD')
    }
}


