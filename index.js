const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "./.env.local" });

const app = express();

const PORT = 3000 || process.env.PORT;


app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://bunkbee-client.vercel.app"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());



app.listen(PORT, () => console.log("Server is running!!"));