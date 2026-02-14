import { NextResponse } from "next/server";
import submitMaker from "@/models/submitMaker";
import { createMakerSchema } from "@/lib/auth/validationSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  /*
    Function responsible to handle the form submission from 
    the Become a Maker page. 
    It receives the form data, processes it, and 
    interacts with the database to store the maker application.
  */
  try {
    /**
     * Requires Google authentication. We tie the maker application to the logged-in user
     * and upgrade their role to `seller` so they can manage their own products.
     */
    const session = await getServerSession(authOptions);
    const userId = Number.parseInt(session?.user?.id ?? "", 10);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ error: "You must be signed in to apply." }, { status: 401 });
    }

    // Parse the incoming JSON data from the request body
    const body = await req.json();

    // Validate the incoming data with the createMakerSchema
    const validatedData = createMakerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.message }, { status: 400 });
    }

    // Destructure the necessary fields from the body
    const { studioName, craftType, story, shopLink } = body;
    
    // Sends data to the submitMaker function which interacts with the database
    const result = await submitMaker(studioName, craftType, story, shopLink);

    // Promote the applicant to seller so they can manage their own product listings.
    // (If you later add an approval workflow, move this to the admin approval step.)
    await sql`UPDATE users SET role = ${"seller"} WHERE user_id = ${userId}`;

    // Return a success response with the result of the database operation
    return NextResponse.json({ result, roleUpdated: "seller" }, { status: 201 });
  } catch (error) {
    console.error(error);
    // Determine the error message and set appropriate status code
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
