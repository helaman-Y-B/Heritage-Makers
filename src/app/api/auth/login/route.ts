import { NextResponse } from "next/server";
import getUserByEmail from "@/models/getUserByEmail";

export async function POST(req: Request) {
  try {
    /**
     * This function is responsible for handling
     * the login process. 
     * It expects a JSON body with "email" and "password" fields.
     * It validates the input, checks the database for a matching user,
     * and if found, sets a cookie with the user information.
     */
    const body = await req.json();
    const password = typeof body.password === "string" ? body.password : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !password) {
      // If email or password is missing, return a 400 Bad Request response with an error message
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email, password);
    if (!user) {
      // If no user is found, return a 401 Unauthorized response with a generic error message
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const response = NextResponse.json(
      {
        user: {
          id: user.user_id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );
    // Set a cookie with the user information (excluding password)
    response.cookies.set("hm_user", JSON.stringify({
      id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
