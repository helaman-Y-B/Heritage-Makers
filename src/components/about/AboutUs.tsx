'use client';

import styles from './AboutPage.module.css';
import Image from 'next/image';
import { useState } from "react";

export default function AboutUs() {

    const [isOpen, setIsOpen] = useState(false);

    const handleText = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.aboutUs}>
            <Image src="/chair.png" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages}></Image>
            <div className={styles.aboutText} onClick={handleText}>
                <h1>{isOpen ? "About the Heritage Makers Community" : " Click Me! "}</h1>
                <p className={isOpen ? styles.openAbout : styles.closedAbout}>The Heritage Makers Community is dedicated to preserving and celebrating the rich cultural heritage of our makers and artisans. We provide a platform for sharing traditional crafts, stories, and techniques that have been passed down through generations.</p>
            </div>
        </div>
    )
}