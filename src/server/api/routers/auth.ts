import {
  loginSchema,
  loginUser,
  registerSchema,
  registerUser,
} from "~/server/user-auth";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => registerUser({ db: ctx.db, input })),
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => loginUser({ db: ctx.db, input })),
});
