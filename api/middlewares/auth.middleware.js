const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.validateSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'Invalid session'));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: decodedToken.id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(401, 'Invalid session'));
  }

  req.currentUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  if (currentUser.id !== +id) {
    return next(new AppError(403, `You can't update other users accounts`));
  }

  next();
});

exports.protectAdmin = catchAsync(async (req, res, next) => {
  console.log(req.currentUser);
  if (req.currentUser.role !== 'admin') {
    return next(new AppError(403, 'Access denied'));
  }

  // Grant access
  next();
});
