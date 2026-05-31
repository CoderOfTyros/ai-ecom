import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db.js";

class OrderItem extends Model { }

OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_snapshot: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_price_cents: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    line_total_cents: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "order_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});


export default OrderItem;