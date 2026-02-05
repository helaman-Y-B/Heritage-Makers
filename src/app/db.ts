import { neon } from "@neondatabase/serverless";

export async function db() {
    const sql = neon(`${process.env.DATABASE_URL}`);

    if (sql != null) {
        console.log(`Connection to DB created ${sql}`)
    }
}