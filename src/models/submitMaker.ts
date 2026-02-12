import { sql } from "@vercel/postgres";

export default async function submitMaker(
    /**
     * Fuction responsable to submit the maker application to the database. 
     * It checks if a maker with the same studio name already exists, and if not, 
     * it inserts the new maker into the database.
     */
// Parameters for the maker application
  studioName: string,
  craftType: string,
  story:string,
  shopLink?: string
) {
    // Checks if maker already exists with the same studio name
    const { rows } = await sql`SELECT * FROM makers WHERE studio_name = ${studioName}`;
    if (rows.length > 0) {
        throw new Error("Maker with this studio name already exists");
    }
    // Inserts the new maker into the database and returns the inserted record
    const { rows: inserted } = await sql`
        INSERT INTO makers (studio_name, craft_type, story, shop_link)
        VALUES (${studioName}, ${craftType}, ${story}, ${shopLink})
        RETURNING *`;
    return inserted;
}