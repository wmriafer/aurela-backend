const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Settings = require('../models/Settings');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Já existe uma conta com este e-mail' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });
    await Settings.create({ user: user._id });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'E-mail ou senha inválidos' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'E-mail ou senha inválidos' });

    const token = signToken(user);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/profile  (nome, avatar)
async function updateProfile(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.userId);
    if (name !== undefined) user.name = String(name).trim().slice(0, 80);
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password
// Estrutura preparada: gera um token de redefinição e retorna (em produção, enviar por e-mail).
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
    // Sempre responde com sucesso, mesmo se o e-mail não existir, para não vazar quais e-mails estão cadastrados.
    if (!user) return res.json({ message: 'Se o e-mail existir, enviaremos instruções de recuperação' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
    await user.save();

    // TODO em produção: integrar um serviço de e-mail (ex: Resend, SendGrid) e enviar `token` por e-mail.
    res.json({ message: 'Se o e-mail existir, enviaremos instruções de recuperação' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

    user.passwordHash = await User.hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateProfile, forgotPassword, resetPassword };
