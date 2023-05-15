import express from 'express';
import * as scoreController from '../controller/score.js'


const router = express.Router();

// router.get('/', studentController.getStudent)


// GET
// 학생정보와 학생점수를 모두 출력함
router.get('/', scoreController.getStudentAndScore)

//GET
///:sc_stIdx  (sc_stIdx (학생의 일렬번호)로 점수 데이터 찾기)
// router.get('/:st_number', scoreController.getScoreByStNumber)


//POST 
// /:st_idx (st_idx를 찾아 학생정보에 학생이 있으면 점수 테이블에 데이터 추가)
router.post('/:sc_stIdx',  scoreController.createScorebyStIdx)


//PUT(student의 정보 수정)
// st_idx를 찾아 학생정보에 학생이 있으면 점수 테이블에서 해당 학생의 점수를 찾아 수정하여 넘김
router.put('/:sc_stIdx', scoreController.updateScoreByStIdx)

//DELETE
// st_idx를 찾아 학생정보에 학생이 있으면 해당 학생의 점수 테이블의 데이터를 삭제
router.delete('/:sc_stIdx', scoreController.deleteScore)

export default router;