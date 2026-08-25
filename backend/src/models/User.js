import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
    ,
    email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},

    {
        sequelize,
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",

        defaultScope: {
            attributes: {
                exclude: ["password_hash"]
            } // do not return password hash when querying users table
        },
        scopes: {
            withPassword: {
                attributes: {}
            } // query password_hash only for comparing during login
        }
    }
);

export default User;