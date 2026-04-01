import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    featured: publicProcedure.query(async () => {
      return await getFeaturedProducts();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getProductById(input);
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          featured: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can create products",
          });
        }
        const product = await createProduct({
          title: input.title,
          description: input.description || null,
          imageUrl: input.imageUrl || null,
          featured: input.featured,
        });
        if (!product) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create product",
          });
        }
        return product;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update products",
          });
        }
        const { id, ...updateData } = input;
        const product = await updateProduct(id, updateData);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        return product;
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can delete products",
          });
        }
        const success = await deleteProduct(input);
        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        return { success: true };
      }),
  })
});

export type AppRouter = typeof appRouter;
