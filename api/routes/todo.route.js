const express = require('express');

// Controllers
const {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/todos.controller');

// Middlewares
const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(validateSession);

router.route('/').post(protectAdmin, createTask).get(getAllTask);

router.route('/:id').get(getTaskById).patch(updateTask).delete(deleteTask);

module.exports = { todosRouter: router };
