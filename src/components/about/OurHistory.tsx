'use client';

import styles from './AboutPage.module.css';
import Image from 'next/image';
import { useState } from "react";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function OurHistory() {

    const isSizeSmall = useWindowSize(520);

    const [isOpen, setIsOpen] = useState(false);

    const handleText = () => {
        setIsOpen(!isOpen);

    }

    return (
        <div className={styles.aboutUs}>
            {isSizeSmall ? (
                <>
                    <Image src="/historyImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText} onClick={handleText}>
                        <h1>{isOpen ? "Our History" : " Click Me! " }</h1>
                        <p className={isOpen ? styles.openHistory : styles.closedHistory}>Founded in 2010, Heritage Makers began as a small collective of artisans passionate about preserving traditional crafts. Over the years, we have grown into a vibrant community that celebrates cultural heritage through handmade products and storytelling.</p>
                    </div>
                </>
            ) : (
                <>
                    <Image src="/historyImg.jpg" alt="Artisan working on traditional craft" width={600} height={400} className={styles.aboutImages} sizes="100vw"></Image>
                    <div className={styles.aboutText}>
                        <h1>Our History</h1>
                        <p className={styles.openHistory}>Founded in 2010, Heritage Makers began as a small collective of artisans passionate about preserving traditional crafts. Over the years, we have grown into a vibrant community that celebrates cultural heritage through handmade products and storytelling.</p>
                    </div>
                </>
            )}
            
        </div>
    );
}