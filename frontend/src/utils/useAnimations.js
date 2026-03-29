import { useEffect, useRef } from 'react';

/**
 * Custom hook for applying entrance animations to elements
 * @param {string} animationClass - CSS animation class to apply
 * @param {number} delay - Optional delay in milliseconds
 * @returns {React.Ref} Reference to attach to animated element
 */
export function useAnimateOnMount(animationClass = 'animate-fade-in', delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // Apply animation after optional delay
      const timer = setTimeout(() => {
        ref.current?.classList.add(animationClass);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [animationClass, delay]);

  return ref;
}

/**
 * Custom hook for staggered animations on multiple elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animationClass - CSS animation class to apply
 * @param {number} staggerDelay - Delay between each element in milliseconds
 */
export function useStaggerAnimation(selector, animationClass = 'animate-slide-up', staggerDelay = 100) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, index * staggerDelay);
    });
  }, [selector, animationClass, staggerDelay]);
}

/**
 * Custom hook for observing when elements enter viewport
 * @param {string} selector - CSS selector for elements to observe
 * @param {string} animationClass - CSS animation class to apply when visible
 */
export function useIntersectionAnimation(selector, animationClass = 'animate-slide-up') {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [selector, animationClass]);
}
