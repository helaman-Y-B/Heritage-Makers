'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import navIcon from "@/app/nav-icon.png";

export default function Navigation() {

    // State to track window size
    const [isSizeSmall, setIsSizeSmall] = useState(false);
    
    // Function to check window size
    function checkSize() {
        if (window.innerWidth <= 520) {
            setIsSizeSmall(true);
        } else {
            setIsSizeSmall(false);
        }
    }

    // State to handle nav open/close
    const [isOpen, setIsOpen] = useState(false);

    const handleNav = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        checkSize(); // Initial check
        window.addEventListener('resize', checkSize); // Add event to listen for window resize and execute checkSize
        return () => window.removeEventListener('resize', checkSize); // Remove the event after the check is done
        // The empty array ensures that this code runs only once when the component appear on the screen
    }, []);

    return (
        <>
        <nav id="nav-bar" className={isOpen ? "openNav" : "closedNav"} onClick={handleNav} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* Only show the nav icon if the screen size is small otherwise show nothing */}
            {isSizeSmall ? (
                <Image id="nav-arrow" className={isOpen ? "rotated" : ""} src={navIcon} alt="Menu Icon" width={40} height={40} />
            ) : (null)}
            <Link className="nav-content" href="/products">Products</Link>
            <Link href="/about" className="nav-content">About</Link>
            <Link href="/contact" className="nav-content">Contact</Link>
        </nav>
        </>
    )
}