import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db.js";

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slug: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price_cents: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_url: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: "general"
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM("active", "draft", "archived"),
        allowNull: false,
        defaultValue: "active"
    }

},
    {
        sequelize,
        tableName: "products",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });


export default Product;