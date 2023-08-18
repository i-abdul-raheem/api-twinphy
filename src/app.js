require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { router } = require("./routes/index");
const { db } = require("./db");
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

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
