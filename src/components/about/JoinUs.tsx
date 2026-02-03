'use client';

import styles from './AboutPage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function JoinUs() {

    const isSizeSmall = useWindowSize(520);

    const [isOpen, setIsOpen] = useState(false);

    const handleText = () => {
        setIsOpen(!isOpen);
    }


    return (
        <div className={styles.aboutUs}>
            {isSizeSmall ? (
                <>
                    <Image src="/comunityImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText} onClick={handleText}>
                        <h1>{isOpen ? "Join Us!" : " Click Me! " }</h1>
                        <p className={isOpen ? styles.openJoin : styles.closedJoin}>Become a part of the Heritage Makers Community! Whether you're an artisan looking to showcase your work or someone passionate about cultural heritage, we welcome you to join us in our mission to preserve and celebrate traditional crafts.</p>
                    </div>
                </>
            ) : (
                <>
                    <Image src="/comunityImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText}>
                        <h1>Join Us!</h1>
                        <p className={styles.openJoin}>Become a part of the Heritage Makers Community! Whether you're an artisan looking to showcase your work or someone passionate about cultural heritage, we welcome you to join us in our mission to preserve and celebrate traditional crafts.</p>
                    </div>
                </>
            )}
        </div>
    );
}