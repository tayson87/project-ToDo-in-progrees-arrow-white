const express = require('express');
const cors = require('cors');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { usersRouter } = require('./routes/user.route');
const { todosRouter } = require('./routes/todo.route');

const app = express();
app.use(cors());

// Enable incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/task', todosRouter);

app.use(globalErrorHandler);

module.exports = { app };
