import express from 'express';
import { Login, Register } from '../Controller/authController.js';
import { rateLimit } from 'express-rate-limit';

//ip limiter:
const limiter = rateLimit({
    windowMs: 30 * 60 * 2000, // 30 minutes
    limit: 200, // Limit each IP to 200 requests per `window` (here, per 30 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});


const router = express.Router();


// limiter add middleware
router.post('/create', limiter, Register);
router.post('/login', limiter, Login);


export default router;