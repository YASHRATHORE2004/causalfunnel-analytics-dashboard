import express from 'express';
import { getSessions, getSessionById } from '../controllers/sessionsController.js';

const router = express.Router();

router.get('/', getSessions);
router.get('/:sessionId', getSessionById);

export default router;
