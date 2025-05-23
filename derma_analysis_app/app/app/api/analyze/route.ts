import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG and PNG are supported." },
        { status: 400 }
      );
    }

    // Check file size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert image to base64 for storage
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    // In a real application, here you would:
    // 1. Call Amazon Bedrock API for image analysis
    // 2. Process the response

    // For demo purposes, we'll simulate a response
    // In a real implementation, this would come from Amazon Bedrock
    const isMalignant = Math.random() > 0.5;
    const confidence = 0.7 + Math.random() * 0.25; // Random confidence between 0.7 and 0.95
    
    const result = {
      result: isMalignant ? "malignant" : "benign",
      confidence: confidence,
      additionalInfo: {
        features: isMalignant 
          ? ["Irregular borders", "Asymmetry", "Multiple colors"] 
          : ["Regular borders", "Symmetrical", "Uniform color"],
        recommendation: isMalignant
          ? "Consult a dermatologist as soon as possible"
          : "Monitor for changes and consult a dermatologist if concerned"
      }
    };

    // Store the analysis in the database
    await prisma.imageAnalysis.create({
      data: {
        originalImage: base64Image,
        result: result.result,
        confidence: result.confidence,
        additionalInfo: result.additionalInfo
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}