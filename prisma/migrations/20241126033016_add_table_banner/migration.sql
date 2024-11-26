-- CreateTable
CREATE TABLE "banner" (
    "banner_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("banner_id")
);
