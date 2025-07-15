import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";


import appRoutes from "./routes/appRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import cookieParser from "cookie-parser";

//import { authorize }  from "./services/googleApiAuthService.js";
//import { sendEmail } from "./services/gmailApiServices.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

//app.use((req, res, next) => {
 // res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
 
//  res.header('Access-Control-Allow-Credentials', 'true');
//  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  next();
//});


app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies
// Define the allowed origin based on your frontend's port
const allowedOrigin = `${process.env.API_FE_HOST}`; // Ensure process.env.API_FE_PORT is defined

app.use(cors({
  origin: allowedOrigin , 
  credentials: true
}));

 app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://unsplash.com",
        "https://images.unsplash.com",
        "https://plus.unsplash.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      // add other directives as needed
    }
  })

 ); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
 app.use(morgan("dev")); // log the requests

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});
//console.log("API_BE_PATH", process.env.API_BE_PATH);
app.use(process.env.API_BE_PATH, appRoutes);

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}



async function initDB() {
  try {
    //await auth_google();
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isVerified BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verificationtoken VARCHAR(255),
        verificationTokenExpiresAt TIMESTAMP
      )
    `;


    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDB", error);
  }
}


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
