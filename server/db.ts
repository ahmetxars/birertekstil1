import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, Product, InsertProduct } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  try {
    return await db.select().from(products);
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get featured products: database not available");
    return [];
  }

  try {
    return await db.select().from(products).where(eq(products.featured, true));
  } catch (error) {
    console.error("[Database] Failed to get featured products:", error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return undefined;
  }
}

export async function createProduct(product: InsertProduct): Promise<Product | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create product: database not available");
    return null;
  }

  try {
    const result = await db.insert(products).values(product);
    const insertedId = result[0].insertId;
    const created = await getProductById(Number(insertedId));
    return created || null;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    return null;
  }
}

export async function updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update product: database not available");
    return null;
  }

  try {
    await db.update(products).set(product).where(eq(products.id, id));
    const updated = await getProductById(id);
    return updated || null;
  } catch (error) {
    console.error("[Database] Failed to update product:", error);
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete product: database not available");
    return false;
  }

  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete product:", error);
    return false;
  }
}
