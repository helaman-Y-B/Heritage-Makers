import { NextResponse } from "next/server";
import getUserByEmail from "@/models/getUserByEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
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
