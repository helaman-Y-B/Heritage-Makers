import Link from "next/link";

export default function Navigation() {
    return (
        <>
        <nav id="nav-bar" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link className="nav-content" href="/products">Products</Link>
            <Link href="/about" className="nav-content">About</Link>
            <Link href="/contact" className="nav-content">Contact</Link>
        </nav>
        </>
    )
}