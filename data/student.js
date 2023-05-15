// 학생테이블 Data

import SQ from 'sequelize'  //ORM
import { sequelize } from '../db/database.js';
// import { Score } from './score.js';

const DataTypes = SQ.DataTypes; // 데이터 형식을 지정해줄 수 있음

const INCLUDE_STUDENT = {
    // select 뒤에 보고싶은 필드만 적듯이 attributes에 보고싶은 필드만 적어줌
    attributes: [
        'st_idx',      // 학생 일렬번호
        'st_number',   // 학번
        'st_name',     // 학생 이름
        'st_hp',       // 학생 전화번호
        'st_email',    // 학생 이메일
        'st_address'  // 학생 주소
        // // scores 테이블에 있는 필드들 -> 한단계 안에 있는 요소들을 한단계 밖으로 꺼내서 같은 레벨로 보이게 함
        // [Sequelize.col('score.sc_avg'), 'sc_avg'],   // 학생의 평균 점수를 sc_avg 이름으로 설정
        // [Sequelize.col('score.sc_total'), 'sc_total']
    ]
    // include에 작성한 내용을 포함
    // include: {
    //     model: Score,  // scores  테이블 객체
    //     attributes: ['sc_total', 'sc_avg']    // 위에서 작성한 attributes를 포함하여 보여주기 위해
    // }
}

// 평균점수로 내림차순하기 위해 정렬 방법을 상수로 선언
// const ORDER_DESC = {
//     order: [['createdAt', 'DESC']]
// }


//DB에 students 테이블 만들기
export const Student = sequelize.define(
    'student',  // students라는 이름의 테이블로 설정됨
    {
        // 학생의 일렬번호(고유값, PK)
        st_idx: {
            type: DataTypes.INTEGER(64),
            autoIncrement: true,  // 데이터생성시 idx값 생성(1씩 증가)
            allowNull: false,  // null값 허용x
            primaryKey: true  // pk로 지정
        },
        // 학번
        st_number: {
            type: DataTypes.INTEGER(30),
            allowNull: false,   // null값 허용x
            unique: true  // 학번은 중복될 수 없음
        },
        // 학생 이름
        st_name: {
            type: DataTypes.STRING(45),
            allowNull: false  // null값 허용x
        },
        st_hp: {
            type: DataTypes.STRING(45),
            allowNull: false  // null값 허용x
        },
        st_email: {
            type: DataTypes.STRING(128),
            allowNull: false  // null값 허용x
        },
        st_address: {
            type: DataTypes.STRING(200),
            allowNull: true  // 주소는 null 허용
        }
    },
    { timestamps: true }   // createdAt, updatedAt 자동 생성
)


// Student.hasOne(Score, {
//     foreignKey: 'sc_stIdx',
//     sourceKey: 'st_idx',
// });

// 전체 학생 데이터 출력(평균 성적으로 내림차순)
export async function getAll() {
    // ...INCLUDE_STUDENT : 복사해서 넣음
    return Student.findAll({ ...INCLUDE_STUDENT }) // INCLUDE_STUDENT로 가져온 객체의 정보들을 ORDER_DESC를 적용하여(평균점수 내림차순) 반환
}

// export async function getAll() {
//     const students = await Student.findAll({
//         attributes: ['st_idx', 'st_number', 'st_name', 'st_hp', 'st_email', 'st_address', [sequelize.fn('AVG', sequelize.col('student_scores.score')), 'avg_score'], [sequelize.fn('SUM', sequelize.col('student_scores.score')), 'total_score']],
//         include: {
//             model: Score,
//             attributes: []
//         },
//         group: ['student.st_idx'],
//         order: [[sequelize.literal('avg_score'), 'DESC']],
//     });
//     return students;
// }


// st_number(학번)으로 데이터 출력
export async function getAllByStNumber(st_number) {
    return Student.findAll({
        ...INCLUDE_STUDENT,
        where: {st_number}
    })
}



// st_idx(학생의 일렬번호)로 데이터 반환
export async function getByIdx(st_idx) {
    return Student.findOne({
        ...INCLUDE_STUDENT,
        where: { st_idx }   // where절이 무조건 먼저 나와야함, 조인했을때 어떤 테이블에서 찾는지는 다음에 작성)
    })
}

// Post 
// Student에 새로운 학생정보 등록
export async function create(st_number, st_name, st_hp, st_email, st_address = null) {
    return Student.create({ st_number, st_name, st_hp, st_email, st_address }).then((data) => {
        console.log(data)
        return data
    })
}


// Put
// 학생의 일렬번호를 보내 수정하고자하는 학생을 찾아 내용 변경
// 학생일렬번호와 학생정보 객체를 받아 모두 수정할 수 있음
export async function update(st_idx, st_name, st_hp, st_email, st_address) {
    return Student.findByPk(st_idx, INCLUDE_STUDENT).then((info) => {
        console.log(info)
        info.st_name = st_name
        info.st_hp = st_hp
        info.st_email = st_email
        info.st_address = st_address
        return info.save()  // 새로운  info 객체를 저장함
    })
}

//Delete
//st_idx를 받아 삭제를 하고자 하는 학생정보를 모두 삭제
export async function remove(st_idx) {
    return Student.findByPk(st_idx).then((st_info) => {
        st_info.destroy()   // 학생일렬번호(st_idx)로 찾은 해당 st_info를 삭제함
    })
}   