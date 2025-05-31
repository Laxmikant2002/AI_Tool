import React, { createContext, useContext, useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { ANIMATION_DURATION, TRANSITION_DURATION } from '../constants';

// Animation Types
type TransitionTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

interface TransitionOptions {
  duration?: number;
  timing?: TransitionTiming;
  delay?: number;
}

interface AnimationOptions extends TransitionOptions {
  direction?: AnimationDirection;
  iterationCount?: number | 'infinite';
}

interface Transitions {
  fast: string;
  normal: string;
  slow: string;
  bounce: string;
  spring: string;
}

interface Animations {
  fadeIn: string;
  fadeOut: string;
  slideIn: string;
  slideInRight: string;
  slideInLeft: string;
  slideInUp: string;
  slideInDown: string;
  scaleIn: string;
  scaleOut: string;
  pulse: string;
  spin: string;
  bounce: string;
}

interface AnimationContextType {
  isReducedMotion: boolean;
  transitions: Transitions;
  animations: Animations;
  createTransition: (properties: string | string[], options?: TransitionOptions) => string;
  createAnimation: (name: keyof Animations, options?: AnimationOptions) => string;
}

const AnimationContext = createContext<AnimationContextType>({
  isReducedMotion: false,
  transitions: {
    fast: 'none',
    normal: 'none',
    slow: 'none',
    bounce: 'none',
    spring: 'none'
  },
  animations: {
    fadeIn: 'none',
    fadeOut: 'none',
    slideIn: 'none',
    slideInRight: 'none',
    slideInLeft: 'none',
    slideInUp: 'none',
    slideInDown: 'none',
    scaleIn: 'none',
    scaleOut: 'none',
    pulse: 'none',
    spin: 'none',
    bounce: 'none'
  },
  createTransition: () => 'none',
  createAnimation: () => 'none'
});

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useTheme();

  // Utility function to create transition strings
  const createTransition = useMemo(() => {
    return (properties: string | string[], options: TransitionOptions = {}) => {
      if (reducedMotion) return 'none';
      
      const {
        duration = TRANSITION_DURATION,
        timing = 'ease',
        delay = 0
      } = options;

      const props = Array.isArray(properties) ? properties.join(', ') : properties;
      return `${props} ${duration}ms ${timing}${delay ? ` ${delay}ms` : ''}`;
    };
  }, [reducedMotion]);

  // Utility function to create animation strings
  const createAnimation = useMemo(() => {
    return (name: keyof Animations, options: AnimationOptions = {}) => {
      if (reducedMotion) return 'none';
      
      const {
        duration = ANIMATION_DURATION,
        timing = 'ease',
        delay = 0,
        direction = 'normal',
        iterationCount = 1
      } = options;

      return `${name} ${duration}ms ${timing} ${delay}ms ${direction} ${iterationCount}`;
    };
  }, [reducedMotion]);

  // Define transitions with CSS variables and memoization
  const transitions = useMemo<Transitions>(() => ({
    fast: reducedMotion ? 'none' : `all ${TRANSITION_DURATION / 2}ms var(--ease-out)`,
    normal: reducedMotion ? 'none' : `all ${TRANSITION_DURATION}ms var(--ease-out)`,
    slow: reducedMotion ? 'none' : `all ${TRANSITION_DURATION * 1.5}ms var(--ease-out)`,
    bounce: reducedMotion ? 'none' : `all ${TRANSITION_DURATION}ms var(--bounce)`,
    spring: reducedMotion ? 'none' : `all ${TRANSITION_DURATION}ms var(--spring)`
  }), [reducedMotion]);

  // Define animations with CSS variables and memoization
  const animations = useMemo<Animations>(() => ({
    fadeIn: reducedMotion ? 'none' : `fadeIn ${ANIMATION_DURATION}ms var(--ease-out)`,
    fadeOut: reducedMotion ? 'none' : `fadeOut ${ANIMATION_DURATION}ms var(--ease-out)`,
    slideIn: reducedMotion ? 'none' : `slideIn ${ANIMATION_DURATION}ms var(--ease-out)`,
    slideInRight: reducedMotion ? 'none' : `slideInRight ${ANIMATION_DURATION}ms var(--ease-out)`,
    slideInLeft: reducedMotion ? 'none' : `slideInLeft ${ANIMATION_DURATION}ms var(--ease-out)`,
    slideInUp: reducedMotion ? 'none' : `slideInUp ${ANIMATION_DURATION}ms var(--ease-out)`,
    slideInDown: reducedMotion ? 'none' : `slideInDown ${ANIMATION_DURATION}ms var(--ease-out)`,
    scaleIn: reducedMotion ? 'none' : `scaleIn ${ANIMATION_DURATION}ms var(--ease-out)`,
    scaleOut: reducedMotion ? 'none' : `scaleOut ${ANIMATION_DURATION}ms var(--ease-out)`,
    pulse: reducedMotion ? 'none' : 'pulse 2s var(--ease-in-out) infinite',
    spin: reducedMotion ? 'none' : 'spin 1s linear infinite',
    bounce: reducedMotion ? 'none' : 'bounce 1s var(--bounce) infinite'
  }), [reducedMotion]);

  const value = useMemo(() => ({
    isReducedMotion: reducedMotion,
    transitions,
    animations,
    createTransition,
    createAnimation
  }), [reducedMotion, transitions, animations, createTransition, createAnimation]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}