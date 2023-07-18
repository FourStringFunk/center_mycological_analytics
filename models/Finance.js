/**
 * Comment Model - Represents a comment in the tech_blog database.
 *
 * @module models/Finance
 */
const Sequelize = require('sequelize');
const {Model, DataTypes} = require('sequelize')
class Finance extends Model{
  // static methods go here
}
  Finance.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    account_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payment_term: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    employer_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    employment_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    payment_plan: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    payment_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Finance',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "student_id",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
    ]
  });

module.exports = Finance;