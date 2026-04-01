import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user contexts
const adminUser = {
  id: 1,
  openId: "admin-user",
  email: "admin@example.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const regularUser = {
  id: 2,
  openId: "regular-user",
  email: "user@example.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createContext(user: typeof adminUser | typeof regularUser | null): TrpcContext {
  return {
    user: user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Products Router", () => {
  describe("products.list", () => {
    it("should return all products for public access", async () => {
      const caller = appRouter.createCaller(createContext(null));
      const result = await caller.products.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("products.featured", () => {
    it("should return only featured products for public access", async () => {
      const caller = appRouter.createCaller(createContext(null));
      const result = await caller.products.featured();
      expect(Array.isArray(result)).toBe(true);
      // All returned products should have featured = true
      result.forEach((product) => {
        expect(product.featured).toBe(true);
      });
    });
  });

  describe("products.create", () => {
    it("should allow admin to create a product", async () => {
      const caller = appRouter.createCaller(createContext(adminUser));
      const result = await caller.products.create({
        title: "Test Product",
        description: "Test Description",
        imageUrl: "https://example.com/image.jpg",
        featured: false,
      });
      expect(result).toBeDefined();
      expect(result.title).toBe("Test Product");
      expect(result.description).toBe("Test Description");
    });

    it("should reject non-admin users from creating products", async () => {
      const caller = appRouter.createCaller(createContext(regularUser));
      try {
        await caller.products.create({
          title: "Test Product",
          description: "Test Description",
          featured: false,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should reject unauthenticated users from creating products", async () => {
      const caller = appRouter.createCaller(createContext(null));
      try {
        await caller.products.create({
          title: "Test Product",
          description: "Test Description",
          featured: false,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should require a title", async () => {
      const caller = appRouter.createCaller(createContext(adminUser));
      try {
        await caller.products.create({
          title: "",
          description: "Test",
          featured: false,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("too_small");
      }
    });
  });

  describe("products.update", () => {
    it("should allow admin to update a product", async () => {
      const caller = appRouter.createCaller(createContext(adminUser));
      
      // First create a product
      const created = await caller.products.create({
        title: "Original Title",
        description: "Original Description",
        featured: false,
      });

      // Then update it
      const updated = await caller.products.update({
        id: created.id,
        title: "Updated Title",
        featured: true,
      });

      expect(updated.title).toBe("Updated Title");
      expect(updated.featured).toBe(true);
    });

    it("should reject non-admin users from updating products", async () => {
      const caller = appRouter.createCaller(createContext(regularUser));
      try {
        await caller.products.update({
          id: 1,
          title: "Updated Title",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("products.delete", () => {
    it("should allow admin to delete a product", async () => {
      const caller = appRouter.createCaller(createContext(adminUser));
      
      // First create a product
      const created = await caller.products.create({
        title: "Product to Delete",
        description: "This will be deleted",
        featured: false,
      });

      // Then delete it
      const result = await caller.products.delete(created.id);
      expect(result.success).toBe(true);
    });

    it("should reject non-admin users from deleting products", async () => {
      const caller = appRouter.createCaller(createContext(regularUser));
      try {
        await caller.products.delete(1);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
