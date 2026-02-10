import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import getProducts from "@/models/getProducts";
import { cookies } from "next/headers";

type SessionUser = {
  id: number;
  role: "admin" | "seller" | "buyer";
};

async function getSessionUser(): Promise<SessionUser | null> {
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
  const products = await getProducts();
  return NextResponse.json({ products }, { status: 200 });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const product_name = String(body.product_name || "").trim();
  const product_description = String(body.product_description || "").trim();
  const category = String(body.category || "").trim();
  const img_path = String(body.img_path || "").trim();
  const price = Number(body.price);
  const inStock = body.inStock === "on" || body.inStock === true;
  const inStockValue = inStock ? 1 : 0;

  if (!product_name || !product_description || !category || !img_path || Number.isNaN(price)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { rows } = await sql`
    INSERT INTO products
      (product_name, product_description, price, category, user_id, img_path, rating, "reviewsCount", "inStock")
    VALUES
      (${product_name}, ${product_description}, ${price}, ${category}, ${user.id}, ${img_path}, 0, 0, ${inStockValue})
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0]?.id }, { status: 201 });
}
