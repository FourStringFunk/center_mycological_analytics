/**
 * Students Model - .
 *
 * @module models/Students
 */
const sequelize = require('../config/connection');
const {Model, DataTypes, ValidationError} = require('sequelize')
const bcrypt = require('bcrypt')


class Students extends Model{
  // validate user password
async validatePassword(loginPw){
  return bcrypt.compareSync(loginPw, this.password_hash);
}
static async getCompletedCourses(studentId){
  try{
    if(!studentId){
      throw new ValidationError('Error, no student id provided')
    }
    const student = await this.findByPk(studentId)
    if(!student){
      throw new ValidationError('Student not found');
    }
    const completedCourses = student.completed_courses || [];
    return completedCourses
  }catch(err){
    console.error('Unable to retrieve completed courses: ', err);
  }
}

}
Students.init( {
    id: {
      autoIncrement: false,
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "email"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    enrollment_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    address_1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address_2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    completed_courses: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, 
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password_hash = await bcrypt.hash(newUserData.password_hash, 10);
      },
      beforeUpdate: async (newUserData) => {
        newUserData.password_hash = await bcrypt.hash(newUserData.password_hash, 10);
      },
      },
    sequelize,
    tableName: 'Students',
    timestamps: true,
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
module.exports = Students;
