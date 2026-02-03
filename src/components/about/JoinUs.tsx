'use client';

import styles from './AboutPage.module.css';
import Image from 'next/image';
import { useState } from "react";

export default function JoinUs() {

    const [isOpen, setIsOpen] = useState(false);

    const handleText = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.aboutUs}>
            <Image src="/comunityImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages}></Image>
            <div className={styles.aboutText} onClick={handleText}>
                <h1>{isOpen ? "Join Us!" : " Click Me! " }</h1>
                <p className={isOpen ? styles.openJoin : styles.closedJoin}>Become a part of the Heritage Makers Community! Whether you're an artisan looking to showcase your work or someone passionate about cultural heritage, we welcome you to join us in our mission to preserve and celebrate traditional crafts.</p>
            </div>
        </div>
    );
}