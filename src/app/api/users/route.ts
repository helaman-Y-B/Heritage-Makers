import { NextResponse } from "next/server";
import createUser from "@/models/createUser";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await createUser(body.firstName, body.lastName, body.email);
        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}