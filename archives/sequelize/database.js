const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('learn-node-js-max', 'root', '12345678', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
