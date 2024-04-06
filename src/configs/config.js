// import dotenv from "dotenv";

// export const getVariables = () => {
//     dotenv.config();

//     return {
//         port: process.env.PORT,
//         mongoUrl: process.env.MONGO_URL,
//         secret: process.env.SECRET_KEY,
//         githubClientId: process.env.GITHUB_CLIENT_ID,
//         githubClientSecret: process.env.GITHUB_CLIENT_SECRET
//     }
// } 

// Esto va directamente conectado con .env, todas estas configuraciones si te fijas las traes del .env. 
// De aca la parte de port, mongoUrl y secret tiene que ir para app.js, la parte de github va para
// passport.config.js