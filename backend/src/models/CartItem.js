import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../db.js";


class CartItem extends Model { }

CartItem.init({
    id: {
        DataTypes: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        DataTypes: INTEGER,
        allowNull: false
    },
    product_id: {
        DataTypes: INTEGER,
        allowNull: false
    },
    quantity: {
        DataTypes: INTEGER,
        allowNull: false,
        validate: { min: 1, max: 99 }
    }
},
    {
        sequelize,
        tableName: "cart_items",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

export default CartItem;