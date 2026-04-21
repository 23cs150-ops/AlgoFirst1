const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./services/db');
const { seedProblems } = require('./services/seedProblems');
const executeRoutes = require('./routes/executeRoutes');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

function isLocalDevOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const configuredOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map((value) => value.trim()).filter(Boolean)
    : [];

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  if (process.env.NODE_ENV !== 'production' && isLocalDevOrigin(origin)) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'algofirst-execution-backend' });
});

app.use('/api', executeRoutes);

const PORT = Number(process.env.BACKEND_PORT || 5000);

async function bootstrap() {
  try {
    await connectToDatabase();
    await seedProblems();

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

bootstrap();
