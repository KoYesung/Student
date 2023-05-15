// 모델과 뷰를 연결하는 역할
import * as StudentRepository from '../data/student.js'
// import * as ScoreRepository from '../data/score.js'
import { getSocketIO } from '../connection/socket.js';





// st_number(학번)으로 데이터 찾기
export async function getStudent(req, res) {
    const st_number = req.query.st_number;  // 학번
    const data = await (st_number
        ? StudentRepository.getAllByStNumber(st_number)  // st_number이 있으면(?st_number= ~~)
        : StudentRepository.getAll());  // ?st_number= 형태로만 입력되면 모두 출력됨
    // console.log(data)
    res.status(200).json(data);
}

// st_idx로 데이터 찾기
export async function getStudentsByIdx(req, res){
    const st_idx = req.params.st_idx;  // 학생의 일렬번호
    const student = await StudentRepository.getByIdx(st_idx)  // 일렬번호로 학생객체 찾음
    // 해당학생이 있으면
    if(student){
        res.status(200).json(student)  // json형태로 객체 전송
    }else{  // 없으면
        res.status(404).json({message: '학생 정보를 찾을 수 없습니다!😭'})  // 에러메시지
    }
}

// Post
// 학생정보 보내서 저장시키기
export async function createStudent(req, res){
    const { st_number, st_name, st_hp, st_email, st_address } = req.body;  // body에 json형태로 전달할 값
    const st_info = await StudentRepository.create(st_number, st_name, st_hp, st_email, st_address) // 전달할 값을 저장하는 객체 생성
    res.status(201).json(st_info) 
    getSocketIO().emit('students', st_info)
}


//Put
// 학생의 정보를 모두 수정할 수 있도록 body에 json형태로 받음
export async function updateStudent(req, res) {
    const st_idx = req.params.st_idx;
    const st_name = req.body.st_name;
    const st_hp = req.body.st_hp;
    const st_email = req.body.st_email;
    const st_address = req.body.st_address;

    const student = await StudentRepository.getByIdx(st_idx);
    if (!student) {
        res.status(404).json({ message: '학생 정보를 찾을 수 없습니다!😭' });
        return;
    }
    
    //새로 수정할 student 정보
    const updatedStudent = await StudentRepository.update(st_idx, st_name, st_hp, st_email, st_address);
    res.status(200).json(updatedStudent);
}




//Delete
// 학생의 일ㄹ렬번호를 받아 해당 student객체 삭제
export async function deleteStudent(req, res, next){
    const st_idx = req.params.st_idx;
    const student = await StudentRepository.getByIdx(st_idx);
    if(!student){
        res.status(404).json({message: '학생 정보를 찾을 수 없습니다!😭'})
    }
    // 위 if문을 통과하면
    await StudentRepository.remove(st_idx)
    res.sendStatus(204);  
    
}