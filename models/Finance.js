/**
 * Finance Model - .
 *
 * @module models/Finance
 */
const sequelize = require('../config/connection');
const {Model, DataTypes, Op} = require('sequelize')
class Finance extends Model{
  // static methods go here// these can be called from the server, but not from the client side scripts
      // find delinquents
  static async lateStudent(studentId){
    try{
      const rigthNow = new Date();
      const ninetyDaysAgo = new Date(rigthNow.getTime() - 90 * 24 * 60 * 60 * 1000);
      const lateStudent = await this.findOne({
        where:{ 
          last_payment: {     
            [Op.lt]: ninetyDaysAgo
          },
          payment_term:{
            [Op.lte]: ninetyDaysAgo
          },
        },
      });
      return lateStudent;
    }catch(err){
      console.error({message: 'Error in finance model, lateStudent static method', Error: err})
    }
  }
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
    },
    last_payment: {
      type: DataTypes.DATE,
      allowNull: false
    },
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