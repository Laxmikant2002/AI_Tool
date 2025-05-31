import { useState, useEffect } from 'react';

// Define breakpoint keys type
export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prefersReducedMotion' | 'prefersColorScheme' | 'hover';

// Predefined breakpoints
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  prefersReducedMotion: '(prefers-reduced-motion: reduce)',
  prefersColorScheme: '(prefers-color-scheme: dark)',
  hover: '(hover: hover)',
} as const;

export type MediaQueryOptions = {
  /** Initial state to use during SSR */
  ssrState?: boolean;
  /** Whether to disable the hook entirely */
  disabled?: boolean;
};

/**
 * Hook that tracks whether a media query matches
 * @param query - The media query to match against
 * @param options - Configuration options
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(
  query: string | BreakpointKey,
  options: MediaQueryOptions = {}
): boolean {
  // Get the actual media query string if a breakpoint key was provided
  const mediaQuery = (breakpoints as Record<string, string>)[query] || query;
  
  const { ssrState = false, disabled = false } = options;
  
  // Handle SSR case
  const getInitialState = () => {
    if (typeof window === 'undefined') return ssrState;
    if (disabled) return false;
    try {
      return window.matchMedia(mediaQuery).matches;
    } catch (e) {
      console.warn(`Invalid media query: ${mediaQuery}`, e);
      return false;
    }
  };

  const [matches, setMatches] = useState(getInitialState);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;

    let mounted = true;
    let mql: MediaQueryList;

    try {
      mql = window.matchMedia(mediaQuery);
    } catch (e) {
      console.warn(`Invalid media query: ${mediaQuery}`, e);
      return;
    }

    const onChange = () => {
      if (!mounted) return;
      setMatches(mql.matches);
    };

    // Set initial value
    setMatches(mql.matches);

    // Use the modern event listener API if available
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      // Fallback for older browsers
      mql.addListener(onChange);
    }

    return () => {
      mounted = false;
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, [mediaQuery, disabled]);

  return matches;
}

/**
 * Get the current active breakpoint
 * @returns The current breakpoint key
 */
export function useBreakpoint(): BreakpointKey | null {
  const breakpointEntries = Object.entries(breakpoints)
    .filter(([key]) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(key)) as [BreakpointKey, string][];
  
  const matches = breakpointEntries.map(
    ([key, query]) => [key, useMediaQuery(query)] as const
  );

  // Find the largest matching breakpoint
  const activeBreakpoint = matches
    .filter(([, matches]) => matches)
    .map(([key]) => key)
    .pop();

  return activeBreakpoint || null;
}