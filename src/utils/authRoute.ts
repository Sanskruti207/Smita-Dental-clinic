import { useEffect, useState } from 'react';

/**
 * Tiny address-bar router for the login screens (no extra npm package needed).
 *
 *   /                -> Public home page (clinic overview, no login needed)
 *   /patient/login   -> Patient (customer) login + new patient registration
 *   /doctor/login    -> Doctor login (Dr. Smita Bevle only)
 */
export const ROUTES = {
  home: '/',
  patientLogin: '/patient/login',
  doctorLogin: '/doctor/login'
} as const;

const NAVIGATE_EVENT = 'sdc:navigate';

/**
 * Change the address-bar URL without reloading the page.
 * Pass replace = true to overwrite the current history entry instead of adding a new one.
 */
export function navigateTo(path: string, replace = false): void {
  if (window.location.pathname !== path) {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

/** Returns the current pathname and re-renders on navigate / browser Back & Forward. */
export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  return pathname;
}
