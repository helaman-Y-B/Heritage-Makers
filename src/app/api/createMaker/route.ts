import { NextResponse } from "next/server";
import submitMaker from "@/models/submitMaker";
import { createMakerSchema } from "@/lib/auth/validationSchema";

export async function POST(req: Request) {
  /*
    Function responsible to handle the form submission from 
    the Become a Maker page. 
    It receives the form data, processes it, and 
    interacts with the database to store the maker application.
  */
  try {
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
    // Return a success response with the result of the database operation
    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error(error);
    // Determine the error message and set appropriate status code
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}