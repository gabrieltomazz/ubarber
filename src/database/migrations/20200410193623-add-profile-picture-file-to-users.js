'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'file_id',
      {
          type: Sequelize.INTEGER,
          reference: {model: 'Files', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,        
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users','file_id')
  }
};
