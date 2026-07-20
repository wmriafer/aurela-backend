require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitCategoryRoutes = require('./routes/habitCategoryRoutes');
const habitRoutes = require('./routes/habitRoutes');
const shoppingCategoryRoutes = require('./routes/shoppingCategoryRoutes');
const shoppingItemRoutes = require('./routes/shoppingItemRoutes');
const goalRoutes = require('./routes/goalRoutes');
const studyRoutes = require('./routes/studyRoutes');
const financeRoutes = require('./routes/financeRoutes');
const noteRoutes = require('./routes/noteRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const stateRoutes = require('./routes/stateRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

// Limita tentativas de autenticação para mitigar força bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habit-categories', habitCategoryRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/shopping-categories', shoppingCategoryRoutes);
app.use('/api/shopping-items', shoppingItemRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/state', stateRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
