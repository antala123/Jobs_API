import express from 'express';
import { Createjobs, Deletejobs, Filterjobs, Updatejobs, getAlljobs } from '../Controller/jobsController.js';
import verifyuser from '../Middelware/verifyUser.js';

const router = express.Router();

router.post('/createjob', verifyuser, Createjobs);
router.get('/showjob', verifyuser, getAlljobs);
router.put('/update/:id', verifyuser, Updatejobs);
router.delete('/delete/:id', verifyuser, Deletejobs);
router.get('/filter', verifyuser, Filterjobs);

export default router;