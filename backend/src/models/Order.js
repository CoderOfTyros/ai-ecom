import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db.js";


class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "confirmed"
    },
    subtotal_cents: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_address: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    shipping_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    total_cents: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "cod"
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "unpaid"
    }

}, {
    sequelize,
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});


export default Order;