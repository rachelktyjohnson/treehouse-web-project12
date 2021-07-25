const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model{}

    Course.init({
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        estimatedTime: DataTypes.STRING,
        materialsNeeded: DataTypes.STRING
    }, {sequelize})

    Course.assosicate = (models) => {
        Course.belongsTo(models.User, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
    }

    return Course;
}
