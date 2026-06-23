import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import eventRoutes from './routes/events.js';
import heatmapRoutes from './routes/heatmap.js';
import sessionRoutes from './routes/sessions.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/heatmap', heatmapRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();