// Rutas para sesiones y registro
const sessionsRouter = require('./routes/sessions');
const registerRouter = require('./routes/register');
app.use('/api/sessions', sessionsRouter);
app.use('/api/register', registerRouter);
