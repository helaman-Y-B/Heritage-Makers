import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import getProducts from "@/models/getProducts";
import { cookies } from "next/headers";
import { addProductSchema } from "@/lib/auth/validationSchema";

type SessionUser = {
  id: number;
  role: "admin" | "seller" | "buyer";
};

async function getSessionUser(): Promise<SessionUser | null> {
  /**
   * Retrieves the current user's session information from cookies.
   * Parses the "hm_user" cookie to extract the user's ID and role.
   * Returns an object containing the user's ID and role, or null if the cookie is not found or invalid.
   */
  const cookieStore = await cookies();
  const raw = cookieStore.get("hm_user")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id: number; role: SessionUser["role"] };
    return { id: parsed.id, role: parsed.role };
  } catch {
    return null;
  }
}

export async function GET() {
  // Fetches the list of products from the database and returns it as a JSON response.
  try {
    const products = await getProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Handles the creation of a new product. Validates the incoming data, checks user authorization,
  // and inserts the new product into the database if all checks.
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    // Validate with Zod schema
    const validatedData = addProductSchema.safeParse(body);
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const { product_name, description, category, img_path, price, inStock } = validatedData.data;
    const inStockValue = inStock ? 1 : 0;

    const { rows } = await sql`
      INSERT INTO products
        (product_name, product_description, price, category, user_id, img_path, rating, "reviewsCount", "inStock")
      VALUES
        (${product_name}, ${description}, ${price}, ${category}, ${user.id}, ${img_path}, 0, 0, ${inStockValue})
      RETURNING id
    `;

    return NextResponse.json({ id: rows[0]?.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to add product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
