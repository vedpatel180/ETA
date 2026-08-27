import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_TRAINS, ZONAL_METRICS, STATION_CONCOURSE_FEEDS } from './src/data/trainsData';
import { recomputeTrainETAs } from './src/utils/predictionEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'RailETA Dynamic Forecast Engine', timestamp: new Date().toISOString() });
  });

  // Train directory
  app.get('/api/trains', (req, res) => {
    res.json(INITIAL_TRAINS);
  });

  // Train live dynamic ETA
  app.get('/api/trains/:trainNo', (req, res) => {
    const { trainNo } = req.params;
    const train = INITIAL_TRAINS.find((t) => t.trainNumber === trainNo);
    if (!train) {
      res.status(404).json({ error: 'Train not found' });
      return;
    }
    const computed = recomputeTrainETAs(train);
    res.json(computed);
  });

  // Station concourse digital display board feed
  app.get('/api/stations/:stationCode/display-board', (req, res) => {
    const { stationCode } = req.params;
    const feed = STATION_CONCOURSE_FEEDS[stationCode.toUpperCase()] || [];
    res.json(feed);
  });

  // SIH 2026 Observability Metrics
  app.get('/api/ops/metrics', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      zonalMetrics: ZONAL_METRICS,
      nationalAvgMaeMl: 2.3,
      nationalAvgMaeStatic: 18.6,
      ingestionHealth: {
        gps: 99.8,
        coa: 99.2,
        smms: 98.9,
        tms: 98.1,
        weather: 99.5
      }
    });
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailETA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
