import express from 'express';
import { getHeatmap } from '../controllers/heatmapController.js';

const router = express.Router();

router.get('/', getHeatmap);

export default router;