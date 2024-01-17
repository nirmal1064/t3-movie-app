import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";
import { z } from "zod";

export const emailPasswordSchema = z.object({
  email: z.string().email("Please Enter a valid email"),
  password: z
    .string()
    .min(3, "Your Password should be minimum 3 characters long")
    .max(15, "Your Password should be maximum 50 characters long"),
});

export const registerSchema = emailPasswordSchema.extend({
  name: z
    .string()
    .min(3, "Your Name should be minimum 3 characters long")
    .max(50, "Your Name should be maximum 50 characters long"),
});

export const loginSchema = emailPasswordSchema;

type RegisterType = { db: PrismaClient; input: z.infer<typeof registerSchema> };
type LoginType = { db: PrismaClient; input: z.infer<typeof loginSchema> };

export const registerUser = async ({ db, input }: RegisterType) => {
  const { email, name, password } = input;
  const existingUser = await db.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "User already Registered",
    });
  }
  const passwordHash = await bcrypt.hash(password, 5);
  const newUser = await db.user.create({
    data: { email, name, password: passwordHash },
  });
  return newUser;
};

export const loginUser = async ({ db, input }: LoginType) => {
  const { email, password } = input;
  console.log(`User with email ${email} trying to Login`);
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    console.error("User Not Found");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Credentials",
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password!);
  if (!passwordMatch) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Credentials",
    });
  }
  return user;
};
