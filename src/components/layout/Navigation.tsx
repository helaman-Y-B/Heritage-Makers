'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import navIcon from "@/app/nav-icon.png";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function Navigation() {

    // State to track window size
    const isSizeSmall = useWindowSize(520);

    // State to handle nav open/close
    const [isOpen, setIsOpen] = useState(false);

    const handleNav = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
        <nav id="nav-bar" className={isOpen ? "openNav" : "closedNav"} onClick={handleNav} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* Only show the nav icon if the screen size is small otherwise show nothing */}
            {isSizeSmall ? (
                <Image id="nav-arrow" className={isOpen ? "rotated" : ""} src={navIcon} alt="Menu Icon" width={40} height={40} />
            ) : (null)}
            <Link className="nav-content" href="/products">Products</Link>
            <Link href="/aboutUs" className="nav-content">About</Link>
            <Link href="/contact" className="nav-content">Contact</Link>
        </nav>
        </>
    )
}