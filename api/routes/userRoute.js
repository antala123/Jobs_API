import express from 'express';
import verifyuser from '../Middelware/verifyUser.js';
import { Update } from '../Controller/userController.js';

const router = express.Router();

router.put('/update', verifyuser, Update)

export default router;