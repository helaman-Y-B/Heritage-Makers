import { NextResponse } from "next/server";
import submitMaker from "@/models/submitMaker";
import { createMakerSchema } from "@/lib/auth/validationSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function POST(req: Request) {
  // Accepts maker applications from authenticated users.
  // This route intentionally does NOT grant seller access immediately.
  try {
    // We bind the application to the signed-in account so admins can review
    // and upgrade the correct user later.
    const session = await getServerSession(authOptions);
    const userId = Number.parseInt(session?.user?.id ?? "", 10);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ error: "You must be signed in to apply." }, { status: 401 });
    }

    const body = await req.json();

    // Validate and normalize payload before writing to DB.
    const validatedData = createMakerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.message }, { status: 400 });
    }

    const { studioName, craftType, story, shopLink } = validatedData.data;
    
    // Model inserts a pending application and blocks duplicate pending requests.
    const result = await submitMaker(userId, studioName, craftType, story, shopLink);

    return NextResponse.json(
      {
        result,
        message: "Application received. An admin will review and approve if successful.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    // Duplicate application errors are user-correctable; others are server failures.
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
