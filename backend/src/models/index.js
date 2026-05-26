import User from "./User.js";
import Product from "./Product.js";
import CartItem from "./CartItem.js";

User.hasMany(CartItem, { foreignKey: "user_id", as: "cart_items" });
CartItem.belongsTo(User, { foreignKey: "user_id", as: "user" });

Product.hasMany(CartItem, { foreignKey: "product_id", as: "cart_items" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export { User, Product, CartItem };