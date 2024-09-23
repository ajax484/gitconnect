import { createStorageClient } from "@/lib/server/appWrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    console.log(
      file,
      `${file?.name}_${new Date().toUTCString()}`,
      "avatar file"
    );

    const { storage } = await createStorageClient();

    const result = await storage.createFile("images", ID.unique(), file);

    const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/images/files/${result.$id}/view?project=66ea6e22002abdcd28be&project=66ea6e22002abdcd28be&mode=admin`;

    return NextResponse.json(
      { message: "Image uploaded successfully", url },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error uploading image", error },
      { status: 500 }
    );
  }
}
