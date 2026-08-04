import { useState, useEffect } from 'react';

/**
 * Calculates the optimal number of table rows to fit the screen without scrolling.
 * 
 * @param defaultLimit Fallback limit for SSR
 * @param rowHeight Estimated height of a single table row in pixels (default ~65px)
 * @param offsetHeight Estimated height of all other UI elements (header, nav, pagination, etc.) in pixels
 */
export function useDynamicLimit(defaultLimit = 8, rowHeight = 65, offsetHeight = 380) {
  const [limit, setLimit] = useState(defaultLimit);

  useEffect(() => {
    const calculateLimit = () => {
      if (typeof window === 'undefined') return;
      
      const availableHeight = window.innerHeight - offsetHeight;
      // Ensure we always show at least 4 rows, even on very small screens
      const calculatedLimit = Math.max(4, Math.floor(availableHeight / rowHeight));
      
      setLimit(calculatedLimit);
    };

    // Calculate immediately on mount
    calculateLimit();

    // Recalculate if window is resized (debounced slightly for performance)
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateLimit, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [rowHeight, offsetHeight]);

  return limit;
}
