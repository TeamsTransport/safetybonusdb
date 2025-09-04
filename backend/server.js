import express from 'express';
import cors from 'cors';

import drivers from './routes/drivers.js';
import trucks from './routes/trucks.js';
import safetyEvents from './routes/safetyEvents.js';
import safetyCategories from './routes/safetyCategories.js';

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/drivers', drivers);
app.use('/api/trucks', trucks);
app.use('/api/safetyEvents', safetyEvents);
app.use('/api/safetyCategories', safetyCategories);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
