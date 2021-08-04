const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model{}

    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "title cannot be empty",
                },
                notNull: {
                    msg: "title field must exist"
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "description cannot be empty",
                },
                notNull: {
                    msg: "description field must exist"
                }
            }
        },
        estimatedTime: DataTypes.STRING,
        materialsNeeded: DataTypes.STRING
    }, {sequelize})

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId'
            }
        })
    }

    return Course;
}
