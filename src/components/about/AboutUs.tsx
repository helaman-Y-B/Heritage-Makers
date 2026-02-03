'use client';

import styles from './AboutPage.module.css';
import Image from 'next/image';
import { useState } from "react";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function AboutUs() {

    const isSizeSmall = useWindowSize(520);

    const [isOpen, setIsOpen] = useState(false);

    const handleText = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.aboutUs}>
            {isSizeSmall ? (
                <>
                    <Image src="/aboutImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText} onClick={handleText}>
                        <h1>{isOpen ? "About the Heritage Makers Community" : " Click Me! "}</h1>
                        <p className={isOpen ? styles.openAbout : styles.closedAbout}>The Heritage Makers Community is dedicated to preserving and celebrating the rich cultural heritage of our makers and artisans. We provide a platform for sharing traditional crafts, stories, and techniques that have been passed down through generations.</p>
                    </div>
                </>
            ) : (
                <>
                    <Image src="/aboutImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText}>
                        <h1>About the Heritage Makers Community</h1>
                        <p className={styles.openAbout}>The Heritage Makers Community is dedicated to preserving and celebrating the rich cultural heritage of our makers and artisans. We provide a platform for sharing traditional crafts, stories, and techniques that have been passed down through generations.</p>
                    </div>
                </>
            )}
        </div>
    )
}