import "dotenv/config";
import { sequelize } from "./db.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./utils/asyncHandler.js";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import adminProductsRouter from "./routes/adminProducts.js";
import adminOrdersRouter from "./routes/adminOrders.js"
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";


function assertEnv(...keys) {
    const missing = keys.filter((k) => !process.env[k]);

    if (missing.length) {
        throw new Error(`Missing required env variables: ${missing.join(", ")}`);
    }
}

assertEnv("JWT_SECRET");

const app = express();
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    app.set("trust proxy", 1);
    // Trust the first proxy in front of us (needed for secure cookies + correct req.ip behind a load balancer / CDN
}

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true
    })
);

//Routes

app.get("/health", (req, res) => {
    res.json({
        ok: true,
        service: "backend",
        time: new Date().toISOString()
    })
});

if (!isProd) {
    app.get("/db-test", asyncHandler(async (req, res) => {
        const [rows] = await sequelize.query("SELECT NOW() as now");
        res.json({ ok: true, dbTime: rows[0].now });
    }
    ));
}

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/admin", adminProductsRouter);
app.use("/admin", adminOrdersRouter);


// 404 must be after all routes
app.use(notFound);

// Error handler must be the final middleware
app.use(errorHandler);

async function start() {
    await sequelize.authenticate();
    console.log("DB connected.");

    const server = app.listen(PORT, () => {
        console.log(`Backend: http://localhost:${PORT}`);
        console.log(`CORS origin: ${CORS_ORIGIN}`);
    });


    // force exit if shutdown hangs
    const shutdown = (signal) => {
        console.log(`${signal} received, shutting down...`);;

        const killTimer = setTimeout(() => {
            console.error("Shutdown timed out, forcing exit");
            process.exit(1); // 1 for failure, 0 for success

        }, 10_000);

        killTimer.unref();

        server.close(async () => {
            try {
                await sequelize.close();
                console.log("Clean shutdown complete.");
                process.exit(0);
            } catch (err) {
                console.error("Error during shutdown", err);
                process.exit(1);
            }
        })
    };

    process.on("SIGTERM", () => shutdown("SIGTERM")); // signal sent from host asking app to stop
    process.on("SIGINT", () => shutdown("SIGINT")); // signal by pressing ctrl + c
}

start().catch((err) => {
    console.error("Failed to start server: ", err);
    process.exit(1);
});
