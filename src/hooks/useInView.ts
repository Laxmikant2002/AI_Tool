import { useState, useEffect, useCallback, RefObject } from 'react';

/**
 * Options for the useInView hook
 * @extends IntersectionObserverInit
 */
interface UseInViewOptions extends IntersectionObserverInit {
  /** Whether to disconnect the observer once the element enters the viewport */
  once?: boolean;
  /** Whether to freeze the state after the first time element enters viewport */
  freeze?: boolean;
  /** Callback function when element enters viewport */
  onEnter?: (entry: IntersectionObserverEntry) => void;
  /** Callback function when element leaves viewport */
  onLeave?: (entry: IntersectionObserverEntry) => void;
  /** Callback function on each intersection change */
  onChange?: (entry: IntersectionObserverEntry) => void;
}

interface UseInViewReturn {
  /** Whether the element is currently in view */
  isInView: boolean;
  /** The current IntersectionObserverEntry if available */
  entry: IntersectionObserverEntry | null;
  /** Function to force update the observer */
  updateObserver: () => void;
  /** The intersection ratio of the element (0 to 1) */
  intersectionRatio: number;
}

/**
 * Hook that tracks whether an element is in the viewport
 * @param elementRef - React ref object for the target element
 * @param options - Configuration options for the intersection observer
 * @returns Object containing visibility state and utility functions
 */
export function useInView(
  elementRef: RefObject<Element>,
  options: UseInViewOptions = {}
): UseInViewReturn {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);

  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    once = false,
    freeze = false,
    onEnter,
    onLeave,
    onChange
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const isElementInView = entry.isIntersecting;

    // Update the entry regardless of frozen state
    setEntry(entry);
    onChange?.(entry);

    // Don't update state if frozen
    if (isFrozen) return;

    setIsInView(isElementInView);

    if (isElementInView) {
      onEnter?.(entry);
      if (once || freeze) {
        setIsFrozen(true);
      }
      if (once && entry.target && observer) {
        observer.unobserve(entry.target);
      }
    } else {
      onLeave?.(entry);
    }
  }, [once, freeze, isFrozen, observer, onEnter, onLeave, onChange]);

  // Function to force update the observer
  const updateObserver = useCallback(() => {
    if (!elementRef.current || !observer) return;
    
    observer.unobserve(elementRef.current);
    setIsFrozen(false);
    observer.observe(elementRef.current);
  }, [elementRef, observer]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Support both single and multiple thresholds
    const thresholds = Array.isArray(threshold) 
      ? threshold 
      : [threshold];

    const newObserver = new IntersectionObserver(handleIntersection, {
      threshold: thresholds,
      root,
      rootMargin
    });

    setObserver(newObserver);
    newObserver.observe(element);

    return () => {
      newObserver.disconnect();
      setObserver(null);
    };
  }, [elementRef, threshold, root, rootMargin, handleIntersection]);

  return {
    isInView,
    entry,
    updateObserver,
    intersectionRatio: entry?.intersectionRatio ?? 0
  };
}