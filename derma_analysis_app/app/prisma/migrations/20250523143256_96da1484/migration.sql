-- CreateTable
CREATE TABLE "ImageAnalysis" (
    "id" TEXT NOT NULL,
    "originalImage" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "additionalInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAnalysis_pkey" PRIMARY KEY ("id")
);

