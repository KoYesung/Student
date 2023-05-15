// 학생 점수 테이블 Data

import SQ, { Sequelize } from 'sequelize'  //ORM
import { sequelize } from '../db/database.js';
import { Student } from './student.js';

const DataTypes = SQ.DataTypes; // 데이터 형식을 지정해줄 수 있음

const INCLUDE_SCORE = {
    // select 뒤에 보고싶은 필드만 적듯이 attributes에 보고싶은 애들만 적어줌
    attributes: [
        'sc_java',
        'sc_python',
        'sc_c',
        'sc_total',
        'sc_avg',
        // students 테이블에 있는 요소들 -> 한단계 안에 있는 요소들을 한단계 밖으로 꺼냄
        [Sequelize.col('student.st_idx'), 'st_idx'],
        [Sequelize.col('student.st_number'), 'st_number'],
        [Sequelize.col('student.st_name'), 'st_name'],
        [Sequelize.col('student.st_hp'), 'st_hp'],
        [Sequelize.col('student.st_email'), 'st_email'],
        [Sequelize.col('student.st_address'), 'st_address']
    ],
    include: {
        model: Student,
        attributes: [],
        as: 'student'
    }
}


const ORDER_DESC = {
    order: [['sc_avg', 'DESC']]
}

export const Score = sequelize.define(
    'score',
    {
        sc_stIdx: {
            type: DataTypes.INTEGER(30),
            allowNull: false,
            references: {
                model: Student,
                key: 'st_idx'
            }
        },
        sc_java: {
            type: DataTypes.INTEGER(30),
            allowNull: false,
        },
        sc_python: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        },
        sc_c: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        },
        sc_total: {
            type: DataTypes.INTEGER(30),
            get() {
                return this.getDataValue('sc_java') + this.getDataValue('sc_python') + this.getDataValue('sc_c');
            }
        },
        sc_avg: {
            type: DataTypes.INTEGER(30),
            get() {
                return (this.getDataValue('sc_java') + this.getDataValue('sc_python') + this.getDataValue('sc_c')) / 3;
            }
        }
    },
    { timestamps: true }
)



// Student 테이블과 join(Student의 st_idx와 Score테이블의 sc_stIdx로 연결)
// onDelete:'cascade'  -> Student의 정보가 삭제될 때 Score에 있는 정보도 같이 삭제
Score.belongsTo(Student, { foreignKey: 'sc_stIdx', targetKey:'st_idx', onDelete: 'cascade' })

// // 전체 학생 데이터 출력(평균 성적으로 내림차순)
// export async function getAll(){
//     // ...INCLUDE_USER : 계속 사용할 객체 -> 복사해서 넣음
//     return Student.findAll({...INCLUDE_STUDENT, ...ORDER_DESC}) // Student 객체에서 전체 찾음
// }

//학생정보와 학생점수를 모두 조회
export async function getBoth(){
    return Score.findAll({
        ...INCLUDE_SCORE,
        ...ORDER_DESC
    })
}



// sc_stIdx로 데이터 조회
export async function getScoreByStIdx(sc_stIdx) {
    return Score.findAll({
        where: { sc_stIdx }  ,
        ...INCLUDE_SCORE,
        ...ORDER_DESC
        // include: {
        //     ...INCLUDE_SCORE.include,
            
        // }
    })
}

// Post 
// st_idx (학생의 일렬번호) 를 받아 해당 학생의 점수를 등록
export async function createScore(sc_stIdx, sc_java, sc_python, sc_c) {
    const student = await Student.findOne({ where: { st_idx: sc_stIdx } });
    if (!student) {
        throw new Error('해당 학생을 찾을 수 없습니다!');
    }
    // if문 통과시
    const total = sc_java + sc_python + sc_c;
    const avg = total / 3.0;
    return Score.create({ sc_java, sc_python, sc_c, sc_stIdx, sc_total: total, sc_avg: avg }).then((data) => {
        console.log(data)
        return data
    })
}



// Put
// 학생의 일렬번호를 보내 수정하고자하는 학생을 찾아 점수를 변경
export async function updateScore(sc_stIdx, sc_java, sc_python, sc_c) {
    return Score.findOne({
        where: { st_idx : sc_stIdx }
        // include: {
        //     ...INCLUDE_SCORE
        // }
    }).then((score) => {
        if (!score) {
            throw new Error('점수를 찾을 수 없습니다!');
        }
        score.sc_java = sc_java
        score.sc_python = sc_python
        score.sc_c = sc_c
        return score.save()  // 새로운  score 객체를 저장함
    })
}

//Delete
//학생의 일렬번호(sc_stIdx)를 받아 삭제를 하고자 하는 학생의 점수를 삭제
export async function removeScore(sc_stIdx) {
    return Score.findOne({where: {sc_stIdx}}).then((score) => {
        if(!score){
            throw new Error('점수를 찾을 수 없습니다!')
        }
        score.destroy()   // 학생일렬번호(st_idx)로 찾은 해당 학생의 점수 score를 삭제함
    })
}   