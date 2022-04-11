// Models
const { User } = require('../models/user.model');
const { Todo } = require('../models/todo.model.js');


const initModels = () => {
  // 1 User <--> M todo
  User.hasMany(Todo);
  Todo.belongsTo(User);


};

module.exports = { initModels };
