// src/index.js

const express = require('express');
const exphbs = require('express-handlebars');
const expressWs = require('express-ws');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { initializeDB } = require('./models/db.js');

const app = express();
expressWs(app);

const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto',
  resave: true,
  saveUninitialized: true,
}));

// Middleware para verificar la sesión
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// Rutas para Productos y Carritos
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de WebSocket
app.ws('/api/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(`Mensaje recibido: ${msg}`);
    ws.send('Mensaje recibido por el servidor');
  });
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
