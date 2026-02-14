/**
 * Fixes products that reference missing images by swapping in existing images
 * from `public/productsImg`.
 *
 * This updates the database in-place.
 *
 * Run:
 *   node scripts/fix-missing-product-images.mjs
 */

import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const dotenvPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(dotenvPath)) return;
  const txt = fs.readFileSync(dotenvPath, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

function normalizeDbImgPath(imgPath) {
  /**
   * Converts DB values into a filesystem-relative path under `public/`.
   * Returns null for empty/invalid values.
   */
  if (typeof imgPath !== "string") return null;
  const trimmed = imgPath.trim();
  if (!trimmed) return null;
  const noLeadingSlash = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return noLeadingSlash;
}

loadEnvLocal();

const publicDir = path.join(process.cwd(), "public");
const imgDir = path.join(publicDir, "productsImg");

const validFiles = fs
  .readdirSync(imgDir)
  .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
  .filter((name) => name !== "placeHolder.png");

if (validFiles.length === 0) {
  console.error("No images found in public/productsImg to use as replacements.");
  process.exit(1);
}

const { sql } = await import("@vercel/postgres");

const { rows: products } = await sql`SELECT id, img_path FROM products ORDER BY id ASC`;

let replaced = 0;
let checked = 0;

for (let i = 0; i < products.length; i += 1) {
  const p = products[i];
  checked += 1;

  const rel = normalizeDbImgPath(p.img_path);
  const absolute = rel ? path.join(publicDir, rel) : null;

  const exists = absolute ? fs.existsSync(absolute) : false;
  if (exists) continue;

  // Choose a replacement image deterministically based on product id.
  const pick = validFiles[p.id % validFiles.length];
  const nextPath = `/productsImg/${pick}`;

  await sql`UPDATE products SET img_path = ${nextPath} WHERE id = ${p.id}`;
  replaced += 1;
}

console.log(
  JSON.stringify(
    {
      checked,
      replaced,
      note: "Products with missing images were updated to existing files from /public/productsImg.",
    },
    null,
    2,
  ),
);

