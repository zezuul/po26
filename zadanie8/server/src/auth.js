const crypto = require('crypto');

const users = [];
const csrfBySession = new Map();

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email.trim().toLowerCase());
}

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Wymagane logowanie' });
  }
  next();
}

function registerAuthRoutes(app) {
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body ?? {};
    const errors = {};

    if (!name?.trim()) errors.name = 'Imię jest wymagane';
    if (!email?.trim()) errors.email = 'E-mail jest wymagany';
    else if (!validateEmail(email)) errors.email = 'Niepoprawny format adresu e-mail';
    if (!password) errors.password = 'Hasło jest wymagane';
    else if (password.length < 6) errors.password = 'Hasło musi mieć min. 6 znaków';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const normalized = email.trim().toLowerCase();
    if (findUserByEmail(normalized)) {
      return res.status(400).json({
        success: false,
        errors: { email: 'Użytkownik z tym e-mailem już istnieje' },
      });
    }

    const user = {
      id: users.length + 1,
      email: normalized,
      password,
      name: String(name).trim(),
      displayName: String(name).trim(),
    };
    users.push(user);

    return res.status(201).json({
      success: true,
      message: 'Rejestracja zakończona — zaloguj się',
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Podaj e-mail i hasło' });
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
    }

    req.session.userId = user.id;
    return res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.displayName },
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const sid = req.sessionID;
    req.session.destroy(() => {
      csrfBySession.delete(sid);
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    const user = users.find((u) => u.id === req.session.userId);
    if (!user) return res.status(401).json({ error: 'Sesja nieważna' });
    return res.json({
      id: user.id,
      email: user.email,
      name: user.displayName,
    });
  });

  app.get('/api/csrf-token', requireAuth, (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    csrfBySession.set(req.sessionID, token);
    return res.json({ csrfToken: token });
  });

  app.post('/api/account/settings', requireAuth, (req, res) => {
    const headerToken = req.headers['x-csrf-token'];
    const expected = csrfBySession.get(req.sessionID);

    if (!headerToken || !expected || headerToken !== expected) {
      return res.status(403).json({
        success: false,
        error: 'CSRF — brak lub nieprawidłowy token',
      });
    }

    const user = users.find((u) => u.id === req.session.userId);
    if (!user) return res.status(401).json({ error: 'Brak użytkownika' });

    const { displayName } = req.body ?? {};
    if (displayName) {
      user.displayName = String(displayName).trim();
    }

    csrfBySession.delete(req.sessionID);

    return res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.displayName },
    });
  });
}

module.exports = { registerAuthRoutes, users };
