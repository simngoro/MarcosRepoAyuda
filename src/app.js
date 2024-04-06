import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRouter from "./routes/session.routes.js";
import passport from "passport";
import initializePassport from "./configs/passport.config.js";
import { getVariables } from "./configs/config.js";

const { port, mongoUrl, secret } = getVariables();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: secret,
    store: MongoStore.create({
        mongoUrl: mongoUrl
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});

app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);

const httpServer = app.listen(port, async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Server on`);
    } catch (err) {
        console.log(err);
    }
});
