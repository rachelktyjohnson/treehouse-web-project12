const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model{}

    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Email is already in use"
            },
            validate: {
                isEmail:{
                    msg: "Email is not a valid email"
                }
            }
        },
        password: DataTypes.STRING
    }, {sequelize})

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
    }

    return User;
}
