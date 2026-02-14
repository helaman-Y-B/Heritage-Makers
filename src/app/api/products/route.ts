import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import getProducts from "@/models/getProducts";
import { addProductSchema } from "@/lib/auth/validationSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { Role } from "@/lib/auth/roles";
import { cookies } from "next/headers";
import { isRoleAllowed } from "@/lib/auth/activeRole";

type SessionUser = {
  id: number;
  role: Role;
};

async function getSessionUser(): Promise<SessionUser | null> {
  /**
   * Resolves the current API user from NextAuth session.
   * Returns `null` when no valid authenticated session is available.
   */
  const session = await getServerSession(authOptions);
  const id = Number.parseInt(session?.user?.id ?? "", 10);
  const maxRole = session?.user?.role;
  if (!Number.isFinite(id) || !maxRole) {
    return null;
  }

  // Apply "active role" cookie if it's allowed for this user.
  const cookieStore = await cookies();
  const requested = cookieStore.get("hm_active_role")?.value as Role | undefined;
  const role = requested && isRoleAllowed(maxRole, requested) ? requested : maxRole;

  return { id, role };
}

export async function GET(req: Request) {
  /**
   * Returns products for the API.
   * If the requester is a seller, we scope to their products by default.
   * A valid `makerId` query param can also request a specific maker's products.
   */
  try {
    const user = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const makerIdParam = searchParams.get("makerId");
    const parsedMakerId = makerIdParam ? Number.parseInt(makerIdParam, 10) : NaN;

    const ownerUserId =
      Number.isFinite(parsedMakerId)
        ? parsedMakerId
        : user?.role === "seller"
          ? user.id
          : undefined;

    const products = await getProducts({ ownerUserId });
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
