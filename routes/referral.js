const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendEmail = require("../utils/gmailService");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail, courseID } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail || !courseID) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const referral = await prisma.referral.create({
      data: { name:referrerName, email:referrerEmail, refereeName, refereeEmail, courseID },
    });

    const subject = "Referral Program Invitation";
    const text = `Hello ${refereeName},\n\n${referrerName} has referred you to our program.`;

    await sendEmail(referrerEmail, refereeEmail, subject, text);

    res.status(200).json({ message: "Referral submitted and email sent successfully.", referral });
  } catch (error) {
    console.error("Error submitting referral:", error);
    res.status(500).json({ error: "Error saving referral" });
  }
});

module.exports = router;
