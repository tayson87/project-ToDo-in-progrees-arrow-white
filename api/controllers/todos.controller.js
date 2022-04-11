// Models
const { Todo } = require('../models/todo.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

exports.getAllTask = catchAsync(async (req, res, next) => {
  const todos = await Todo.findAll({
    include: [{ model: User, attributes: { exclude: ['password'] } }]
  });

  res.status(200).json({
    status: 'success',
    data: { todos }
  });
});

exports.getTaskById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findOne({
    where: {
      id
    },
    include: [{ model: User, attributes: { exclude: ['password'] } }]
  });

  if (!todo) {
    return next(new AppError(404, 'Todo not found !'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      todo
    }
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description, userId } = req.body;

  const newTodo = await Todo.create({
    title,
    description,
    userId
  });

  res.status(201).json({
    status: 'success',
    data: { newTodo }
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'title', 'description', 'status');

  const todo = await Todo.findOne({
    where: { id }
  });

  if (!todo) {
    return next(new AppError(404, 'todo   not found '));
  }
  await todo.update({
    ...data
  });

  res.status(204).json({
    status: 'success'
  });
});
