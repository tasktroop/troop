require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

const logger = require('./src/utils/logger');
const { scheduleReports } = require('./src/analytics/weeklyReport');

const authRoutes = require('./src/routes/auth');
const leadsRoutes = require('./src/routes/leads');
const notesRoutes = require('./src/routes/notes');
const approvalsRoutes = require('./src/routes/approvals');
const webhooksRoutes = require('./src/routes/webhooks');
const billingRoutes = require('./src/routes/billing');
const llmRoutes = require('./src/routes/llm');
const whatsappRoutes = require('./src/routes/whatsapp');
const socialRoutes = require('./src/routes/social');
const analyticsRoutes = require('./src/routes/analytics');
const tenantMiddleware = require('./src/middleware/tenant');
const { requireRole } = require('./src/middleware/rbac');

const app = express(); // ✅ ONLY ONCE

// 🔧 Basic setup
app.set('trust proxy', 1);

// 🔐 Security & middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(helmet());
app.use(compression());

// 🚦 Rate limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });

app.use('/auth', authLimiter);
app.use('/leads', apiLimiter);
app.use('/approvals', apiLimiter);

// ❤️ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🌐 Routes
app.get('/', (req, res) => res.send('Backend is live 🚀'));

app.use('/auth', authRoutes);
app.use('/webhook', webhooksRoutes);

app.use(tenantMiddleware);

app.use('/billing', requireRole(['admin']), billingRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/leads', leadsRoutes);
app.use('/', notesRoutes);
app.use('/approvals', approvalsRoutes);
app.use('/llm', llmRoutes);
app.use('/whatsapp', whatsappRoutes);
app.use('/social', socialRoutes);

// 🔧 Mock route
app.delete('/users/:id', requireRole(['admin']), (req, res) => {
  res.json({ msg: "User deleted" });
});

// ⏰ Cron
scheduleReports();

// 🚀 Start server (ONLY ONCE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});