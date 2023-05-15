import express from 'express';
// import http from 'http';
import * as studentController from '../controller/student.js'
// import { body } from 'express-validator';
// import { validate } from '../middleware/validators.js'
// import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// GET
// /student?st_number= ~  (st_number (학번)로 데이터 찾기)
router.get('/', studentController.getStudent)

// GET
// /student/st_idx  (st_idx (일렬번호)로 데이터 찾기)
router.get('/:st_idx', studentController.getStudentsByIdx)


//POST (students에 데이터 추가)
router.post('/', studentController.createStudent)



//PUT(student의 정보 수정)
// st_idx를 찾아 body에 전달된 정보를 넘김
router.put('/:st_idx', studentController.updateStudent)

//DELETE
// st_idx를 찾아 해당 학생의 데이터 삭제
router.delete('/:st_idx', studentController.deleteStudent)

export default router;