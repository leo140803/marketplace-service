-- CreateTable
CREATE TABLE "store" (
    "store_id" UUID NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("store_id")
);
