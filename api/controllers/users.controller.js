const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ref, uploadBytes } = require('firebase/storage');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');
const { storage } = require('../util/firebase');

dotenv.config({ path: './config.env' });

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user given an email and has status active
  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  const userRole = user.role;

  // Compare entered password vs hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRE_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      token,
      userRole
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 'active' }
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id
    }
  });

  if (!user) {
    return next(new AppError(404, 'user not found !'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, lastName, age, email, password, role } = req.body;
  console.log(req.body);
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const image = req.file

  const newUser = await User.create({
    name,
    lastName,
    age,
    email,
    password: hashedPassword,
    role
  });
  console.log('image', req.file);

  const refImg = ref(storage, `/img/${newUser.id}/${req.file.originalname}`);

  const img = await uploadBytes(refImg, req.file.buffer);

  await newUser.update({
    img: img.metadata.fullPath
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'name', 'lastName', 'age', 'email');

  const user = await User.findOne({
    where: { id, status: 'active' }
  });
  if (!user) {
    return next(new AppError(404, 'User   not found '));
  }

  await user.update({
    ...data
  });

  res.status(204).json({
    status: 'success'
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' }
  });
  if (!user) {
    return next(new AppError(404, 'User   not found '));
  }

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
