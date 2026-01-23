'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import navIcon from "@/app/nav-icon.png";

export default function Navigation() {

    // State to handle nav open/close
   const [isOpen, setIsOpen] = useState(false);

   const handleNav = () => {
        setIsOpen(!isOpen);
   }



    return (
        <>
        <nav id="nav-bar" className={isOpen ? "openNav" : "closedNav"} onClick={handleNav} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Image id="nav-arrow" className={isOpen ? "rotated" : ""} src={navIcon} alt="Menu Icon" width={40} height={40} />
            <Link className="nav-content" href="/products">Products</Link>
            <Link href="/about" className="nav-content">About</Link>
            <Link href="/contact" className="nav-content">Contact</Link>
        </nav>
        </>
    )
}