const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model{}

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "firstName cannot be empty",
                },
                notNull: {
                    msg: "firstName field must exist"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "lastName cannot be empty",
                },
                notNull: {
                    msg: "lastName field must exist"
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Email is already in use"
            },
            validate: {
                notEmpty: {
                    msg: "emailAddress cannot be empty",
                },
                notNull: {
                    msg: "emailAddress field must exist"
                },
                isEmail:{
                    msg: "Email is not a valid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "password cannot be empty",
                },
                notNull: {
                    msg: "password field must exist"
                }
            }
        }
    }, {sequelize})

    User.beforeCreate((user, options)=>{
        return bcrypt.hash(user.password, 10)
            .then(hash => {
                user.password = hash
            })
            .catch (error => {
                throw new Error("Password field must not be empty")
            })
    })

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
