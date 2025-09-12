import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const jwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
