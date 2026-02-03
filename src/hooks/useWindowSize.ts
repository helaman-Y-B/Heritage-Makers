import { useState, useEffect } from 'react';

export function useWindowSize(breakpoint: number = 520) {
    const [isSizeSmall, setIsSizeSmall] = useState(false);
    
    function checkSize() {
        if (window.innerWidth <= breakpoint) {
            setIsSizeSmall(true);
        } else {
            setIsSizeSmall(false);
        }
    }

    useEffect(() => {
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, [breakpoint]);

    return isSizeSmall;
}