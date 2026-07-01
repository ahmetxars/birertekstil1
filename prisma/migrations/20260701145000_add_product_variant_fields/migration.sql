ALTER TABLE "Product"
ADD COLUMN "usageAreas" TEXT;

ALTER TABLE "Product"
ADD COLUMN "variantOptions" TEXT NOT NULL DEFAULT '[]';
