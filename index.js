const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");
const { handleError } = require("./controller/error");
const { userRoutes } = require("./routes/user");
const { mealsRoutes } = require("./routes/meals");
const { configCloudinary } = require("./config/cloudinary");
const { paymentRoutes } = require("./routes/payment");

require("dotenv").config({ path: "./.env.local" });

const app = express();

const PORT = 3000 || process.env.PORT;

connectDB();
configCloudinary();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://bunkbee-client.vercel.app"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/meals", mealsRoutes);
app.use("/payment", paymentRoutes);

app.use(handleError);

app.listen(PORT, () => console.log("Server is running!!"));
