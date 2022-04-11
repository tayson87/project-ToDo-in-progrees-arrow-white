const express = require('express');
const { upload } = require('../util/multer');

// Controllers
const {
  loginUser,
  createUser,
  updateUser
} = require('../controllers/users.controller');

// Middlewares
const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', loginUser);

router.use(validateSession);

router.post('/', protectAdmin, upload.single('image'), createUser);

router.patch('/:id', updateUser);

module.exports = { usersRouter: router };
