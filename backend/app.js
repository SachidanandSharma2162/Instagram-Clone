import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import connectDB from "./config/databaseConnection.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import cookieParser from "cookie-parser";


// Load environment variables
dotenv.config();

// App config
const app = express();
const port = 4000;

// Connect to MongoDB
connectDB();

// Middleware (Order matters!)
app.use(cors(
  {
    origin: "http://localhost:5173", // React app URL
    credentials: true, // Allow credentials (cookies)
  }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public"))); // 
// Session is required for flash messages
app.use(session({
  secret: process.env.SESSION_SECRET, // You can move this to .env
  resave: false,
  saveUninitialized: false,
}));

// Flash middleware
app.use(flash());

// Make flash messages accessible in views (or for APIs)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/users", userRouter);
app.use("/posts",postRouter)

// Health check
app.get("/", (req, res) => {
  res.send("API working");
});

// Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
