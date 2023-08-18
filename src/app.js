require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const passportSetup = require("./handlers/Passport");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const { router } = require("./routes/index");
const { db } = require("./db");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
// Set up session middleware
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true })
);
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// const io = socketIO(server);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(process.env.REACT_APP_ROOM).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(5001, () => {
  console.log("SERVER RUNNING");
});

app.use("/api", router);

app.listen(PORT, () => {
  db.on("error", (err) => {
    console.log(err);
  });
  db.on("open", () => {
    console.log("Database Connected");
    console.log(`Server Started: http://localhost:${PORT}`);
  });
});

// Initiate Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback URL
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (req.isAuthenticated()) {
      // Set a cookie with user data
      res.cookie("userData", JSON.stringify(req.user, null, 5), {
        maxAge: 900000,
      }); // Set the cookie with a 15-minute expiration
      res.redirect("http://localhost:3000/");
    } else {
      res.redirect("/login");
    }
  }
);

// Profile page (protected route)
app.get("/profile", (req, res) => {
  const userDataCookie = req.cookies.userData;

  if (userDataCookie) {
    const userData = JSON.parse(userDataCookie);
    res.json(userData);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get("/login", (req, res) => {
  res.redirect("/auth/google");
});
