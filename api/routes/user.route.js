const express = require('express');
const { upload } = require('../util/multer');

// Controllers
const {
  loginUser,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser
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

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.delete('/:id', deleteUser);

module.exports = { usersRouter: router };
