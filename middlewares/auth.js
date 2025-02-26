const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: "Forbidden 🛑🛑" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.User.findUnique({
      where: { id: payload.id }, // Prisma uses `id`, not `_id`
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token!" });
  }
};
