import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
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
   * Resolves API caller identity from NextAuth session.
   * This is the single source of truth for product ownership checks.
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

async function getProductOwner(id: number): Promise<number | null> {
  const { rows } = await sql`SELECT user_id FROM products WHERE id = ${id} LIMIT 1`;
  return rows[0]?.user_id ?? null;
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await ctx.params;
    const productId = Number(id);
    if (Number.isNaN(productId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const ownerId = await getProductOwner(productId);
    if (ownerId === null) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (user.role === "seller" && ownerId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { rows: currentRows } = await sql`
      SELECT product_name, product_description, price, category, img_path, "inStock"
      FROM products WHERE id = ${productId} LIMIT 1
    `;
    const current = currentRows[0];
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const inStockRaw =
      body.inStock === "on" || body.inStock === true || body.inStock === false
        ? Boolean(body.inStock)
        : null;
    const inStockValue = inStockRaw === null ? current.inStock : inStockRaw ? 1 : 0;

    const next = {
      product_name: body.product_name ?? current.product_name,
      product_description: body.product_description ?? current.product_description,
      price: Number.isFinite(Number(body.price)) ? Number(body.price) : current.price,
      category: body.category ?? current.category,
      img_path: body.img_path ?? current.img_path,
      inStock: inStockValue,
    };

    await sql`
      UPDATE products
      SET product_name = ${next.product_name},
      product_description = ${next.product_description},
      price = ${next.price},
      category = ${next.category},
      img_path = ${next.img_path},
      "inStock" = ${next.inStock}
      WHERE id = ${productId}
    `;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const ownerId = await getProductOwner(productId);
  if (ownerId === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (user.role === "seller" && ownerId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await sql`DELETE FROM products WHERE id = ${productId}`;
  return NextResponse.json({ ok: true }, { status: 200 });
}
