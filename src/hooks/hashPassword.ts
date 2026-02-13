import * as argon2 from "argon2";

async function hashPassword(password: string): Promise<string> {
  /**
   * This function takes a plain text password as input and returns a hashed version of the password.
   * It uses the argon2 hashing algorithm to securely hash the password, 
   * which is suitable for storing in a database.
   * The function returns the hashed password as a string.
   */
    try {
        return await argon2.hash(password);
    } catch (err) {
        throw new Error("Failed to hash password");
    }
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
    /**
     * This function takes a hashed password and a plain text password as input 
     * and verifies if the plain text password matches the hashed password.
     * 
     * It uses the argon2 verification function to compare the hash with the provided password.
     * The function returns true if the password is correct, and false otherwise.
     */
    try {
        return await argon2.verify(hash, password);
    } catch (err) {
        throw new Error("Failed to verify password");
    }
    
}

export { hashPassword, verifyPassword };