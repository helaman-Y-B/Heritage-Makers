import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { createRequire } from "module";

type Argon2Module = {
  hash: (password: string) => Promise<string>;
  verify: (hash: string, password: string) => Promise<boolean>;
};

let argon2ModulePromise: Promise<Argon2Module | null> | null = null;

async function loadArgon2(): Promise<Argon2Module | null> {
  /**
   * Loads `argon2` lazily so missing dependency errors do not crash app build.
   * When unavailable, callers fall back to a built-in crypto strategy.
   */
  if (!argon2ModulePromise) {
    argon2ModulePromise = (async () => {
      try {
        const require = createRequire(import.meta.url);
        return require("argon2") as Argon2Module;
      } catch {
        return null;
      }
    })();
  }

  return argon2ModulePromise;
}

function hashWithScrypt(password: string): string {
  /**
   * Generates a deterministic scrypt-based hash format:
   * `scrypt$<saltHex>$<derivedKeyHex>`.
   */
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

function verifyScryptHash(hash: string, password: string): boolean {
  /**
   * Validates scrypt hashes produced by `hashWithScrypt`.
   * Returns false for unknown formats or malformed payloads.
   */
  if (!hash.startsWith("scrypt$")) return false;
  const [, salt, storedKeyHex] = hash.split("$");
  if (!salt || !storedKeyHex) return false;

  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(storedKeyHex, "hex");
  if (storedKey.length !== derivedKey.length) return false;
  return timingSafeEqual(storedKey, derivedKey);
}

function verifyLegacySha256Hash(hash: string, password: string): boolean {
  /**
   * Supports older seeded/test users that may store sha256 password digests.
   * This keeps login resilient while migrations are in progress.
   */
  const digest = createHash("sha256").update(password).digest("hex");
  return hash === digest;
}

async function hashPassword(password: string): Promise<string> {
  /**
   * Hashes user passwords using argon2 when available.
   * Falls back to scrypt to keep local/dev environments functional.
   */
  const argon2 = await loadArgon2();
  if (argon2) {
    return argon2.hash(password);
  }

  return hashWithScrypt(password);
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  /**
   * Verifies passwords across supported formats:
   * argon2, scrypt (fallback), and legacy sha256 values.
   */
  if (!hash) return false;

  if (hash.startsWith("$argon2")) {
    const argon2 = await loadArgon2();
    if (!argon2) {
      throw new Error("Password verification unavailable: argon2 package is missing");
    }
    return argon2.verify(hash, password);
  }

  if (hash.startsWith("scrypt$")) {
    return verifyScryptHash(hash, password);
  }

  return verifyLegacySha256Hash(hash, password);
}

export { hashPassword, verifyPassword };
