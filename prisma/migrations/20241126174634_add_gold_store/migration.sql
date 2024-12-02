-- CreateTable
CREATE TABLE "gold_price" (
    "price_id" UUID NOT NULL,
    "price" INTEGER NOT NULL,
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gold_price_pkey" PRIMARY KEY ("price_id")
);
