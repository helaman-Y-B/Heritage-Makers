import { NextResponse } from "next/server";
import createUser from "@/models/createUser";

export async function POST(req: Request) {
  /**
   * This function handles the POST request to create a new user. 
   * It expects a JSON body with the user's first name, last name, email, role, and password.
   * The function first parses the request body and determines the user's role, defaulting to "buyer" 
   * if an invalid role is provided.
   * It then calls the createUser function to insert the new user into the database, 
   * which includes hashing the password before storage.
   * Finally, it returns a JSON response with the created user or an error message 
   * if the operation fails.
   */
  try {
    const body = await req.json();
    // Validate role and default to "buyer" if invalid
    const role = body.role === "seller" || body.role === "buyer" ? body.role : "buyer";
    // Create the user in the database
    const user = await createUser(body.firstName, body.lastName, body.email, role, body.password);
    // Return the created user as a JSON response with a 201 status code
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
