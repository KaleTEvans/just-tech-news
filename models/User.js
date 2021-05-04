const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table colimns and configuration
User.init(
    {
        // define an id column
        id: {
            // use the special sequielize datatypes
            type: DataTypes.INTEGER,
            // not null
            allowNull: false,
            // primary key
            primaryKey: true,
            // auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
        type: DataTypes.STRING,
        allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // no duplicates
            unique: true,
            // validate
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // must be 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle
            async beforeCreate(userData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in imported sequelize connection
        sequelize,
        // dont automatically create createdAt/updatedAt time fields
        timestamps: false,
        // dont pluralize name of db table
        freezeTableName: true,
        // use underscores
        underscored: true,
        // make it so model name stays lowercase in db
        modelName: 'user'
    }
);

module.exports = User;