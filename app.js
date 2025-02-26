require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api", require("./routes/auth"));
app.use("/api/referrals", require("./routes/referral"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`Server listening on port: ${PORT}`);

  try {
    await prisma.$connect();
    console.log("Connected to MySQL database successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
});
