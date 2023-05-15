// 모델과 뷰를 연결하는 역할
import * as ScoreRepository from '../data/score.js'
import * as StudentRepository from '../data/student.js'
import { getSocketIO } from '../connection/socket.js';


// 학생정보와 학생점수를 모두 찾기
export async function getStudentAndScore(req, res) {
    const scores = await ScoreRepository.getBoth()
    res.status(201).json(scores)
}



// Post
// 학생의 일렬번호(st_idx) 보내서 점수를 입력받아 저장하기
export async function createScorebyStIdx(req, res) {
    const sc_stIdx = req.params.sc_stIdx;   // /score/sc_stIdx값
    const student = await StudentRepository.getByIdx(sc_stIdx)   // student의 st_idx값으로 student객체를 찾음
    // student객체를 찾지못하면
    if (!student) {
        res.status(404).json({ message: '학생 정보가 없습니다!' })
    }
    //if문 통과시 실행
    const { sc_java, sc_python, sc_c } = req.body;  // json형태로 보내는 값
    const score = await ScoreRepository.createScore(sc_stIdx, sc_java, sc_python, sc_c)   // 새로운 점수 데이터 create
    res.status(201).json(score)  // 201status와 함께 json형태로 client에 보냄
    getSocketIO().emit('scores', score)
}




//Put
// 학생의 일렬번호를 보내서 해당 학생의 점수를 수정하기
export async function updateScoreByStIdx(req, res) {
    // 학생의 일렬번호
    const sc_stIdx = req.params.sc_stIdx;
    //학생의 일렬번호로 학생객체를 찾음
    const student = await StudentRepository.getByIdx(sc_stIdx);
    // 학생정보가 없다면
    if (!student) {
        res.status(404).json({ message: '학생 정보가 없습니다!' });
        return;
    }
    // 학생의 일렬번호를 보내 score 객체를 찾음
    const score = await ScoreRepository.getScoreByStIdx(sc_stIdx);

    //수정할 점수를 body의 json형태로 전달
    const { sc_java, sc_python, sc_c } = req.body;

    score.sc_java = sc_java;
    score.sc_python = sc_python;
    score.sc_c = sc_c;

    // 전달한 점수 score객체로 점수를 update함
    const updatedScore = await ScoreRepository.updateScore(sc_stIdx, sc_java, sc_python, sc_c);
    res.status(200).json(updatedScore);
}



//Delete
// 학생의 일렬번호(st_idx)를 보내서 해당 학생의 점수를 삭제하기(점수만 삭제함)
export async function deleteScore(req, res) {
    //학생의 일렬번호
    const sc_stIdx = req.params.sc_stIdx;
    // 학생의 일렬번호로 학생 객체를 찾음
    const student = await StudentRepository.getByIdx(sc_stIdx)
    //학생정보가 없다면
    if (!student) {
        res.status(404).json({ message: '학생 정보가 없습니다!' })
    }
    
    // 위 if문을 통과하면 해당학생의 점수 정보를 삭제
    await ScoreRepository.removeScore(sc_stIdx)
    res.sendStatus(204);

}
