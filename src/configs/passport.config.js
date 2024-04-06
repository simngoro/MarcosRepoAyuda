// Aca va la configuracion de la libreria Passport, para esta te recomendaria ver la clase asi entendes mejor
// de todas maneras te dejo codigo comentado, nosotros durante el curso usamos passport con denominadas 3
// estrategias, la estrategia register, login y github. 

// CLASE 22 PASSPORT AVANZADO

// import passport from "passport";
// import local, { Strategy } from "passport-local";
// import { userModel } from "../models/user.model.js";
// import { createHash, isValidPassword } from "../utils/bcrypt.js";
// import { Strategy as GithubStrategy } from "passport-github2";
// import { getVariables } from "./config.js";
// import Users from "../dao/mongo/users.mongo.js";

// PORQUE ESTOS IMPORTS?

// passport: Libreria de passport.
// local and Strategy: Estrategia de passport para autenticacion usuario/contraseña.
// userModel: El model de usuario que esta en models/user.model.js.
// createHash and isValidPassword: Funciones para hashear y validar contraseñas usando bcrypt.
// GithubStrategy: Estrategia de passport para autenticacion con github .
// getVariables: Funcion para conseguir las variables de entorno de github (vienen de config.js, que a la vez vienen de .env).
// Users: Una clase para operaciones de usuario que vienen de "../dao/mongo/users.mongo.js".



// const { githubClientId, githubClientSecret } = getVariables();
// const LocalStrategy = local.Strategy;
// const userService = new Users();

// const initializePassport = () => {
//     passport.use("register", new LocalStrategy(
//         {passReqToCallback: true, usernameField: "email"},
//         async (req, username, password, done) => {
//             const { first_name, last_name, email, age } = req.body;
//             try {
//                 const user = await userService.getUser(username);
//                 if (user) {
//                     console.log("User already registered");
//                     return done(null, false);
//                 }
//                 const newUser = {
//                     first_name,
//                     last_name,
//                     email,
//                     age,
//                     password: createHash(password)
//                 }
//                 const result = await userService.createUser(newUser);
//                 return done(null, result);
//             } catch (error) {
//                 console.error(error);
//                 return done("Error creating user" + error);
//             }
//         }
//     ));

//     passport.use("login", new LocalStrategy(
//         {usernameField: "email"},
//         async (username, password, done) => {
//             try {
//                 const user = await userService.getUser(username);
//                 if (!user) {
//                     console.log("User not found");
//                     return done(null, false);
//                 }
//                 if (!isValidPassword(user, password)) {
//                     return done(null, false);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 return done(error);
//             }
//         }
//     ));

//     passport.use("github", new GithubStrategy(
//         {
//             clientID: githubClientId,
//             callbackURL: "http://localhost:8080/api/sessions/githubcallback",
//             clientSecret: githubClientSecret
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 const user = await userService.getUser(profile.username);
//                 if (!user) {
//                     const newUser = {
//                         first_name: profile._json.name.split(" ")[0],
//                         last_name: profile._json.name.split(/\s+/).pop(),
//                         email: profile.username,
//                         age: 0,
//                         password: "Github"
//                     }
//                     const result = await userService.createUser(newUser);
//                     return done(null, result);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 return done(error);
//             }
//         }
//     ));

//     passport.serializeUser((user, done) => {
//         done(null, user._id);
//     });

//     passport.deserializeUser(async (id, done) => {
//         const user = await userService.getUserById(id);
//         done(null, user);
//     });
// }

// export default initializePassport;