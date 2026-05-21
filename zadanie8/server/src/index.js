const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { registerAuthRoutes } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3011;

const products = [
  { id: 1, name: 'Laptop', price: 3499.99, category: 'Elektronika' },
  { id: 2, name: 'Monitor 27"', price: 899.0, category: 'Elektronika' },
  { id: 3, name: 'Klawiatura mechaniczna', price: 299.99, category: 'Akcesoria' },
  { id: 4, name: 'Biurko regulowane', price: 1299.0, category: 'Meble' },
  { id: 5, name: 'Krzesło ergonomiczne', price: 749.5, category: 'Meble' },
];

const payments = [];

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3010',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'po26-zadanie8-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

registerAuthRoutes(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (_req, res) => {
  res.json(products);
});

app.post('/api/payments', (req, res) => {
  const { cardHolder, email, items, total } = req.body;

  if (!cardHolder || !email || !items?.length || total === null || total === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Wymagane: cardHolder, email, items, total',
    });
  }

  const payment = {
    id: payments.length + 1,
    cardHolder,
    email,
    items,
    total,
    status: 'accepted',
    createdAt: new Date().toISOString(),
  };

  payments.push(payment);

  res.status(201).json({
    success: true,
    message: 'Płatność przyjęta (mock)',
    payment,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API serwer (zadanie8): http://localhost:${PORT}`);
});
