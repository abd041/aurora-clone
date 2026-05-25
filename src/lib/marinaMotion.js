/**
 * Marina motion constants — keep GSAP and CSS transitions aligned.
 * GSAP ease strings approximate CSS --ease-premium / --ease-out-expo.
 */

export const MARINA_COLORS = {
  primary: '#326080',
  secondary: '#B5D2E6',
  accent: '#805232',
  cream: '#FFF1E7',
};

/** Default UI reveal — maps to ~0.28s CSS --transition-interactive */
export const MARINA_EASE = {
  out: 'power3.out',
  outExpo: 'expo.out',
  inOut: 'power2.inOut',
};

export const MARINA_DURATION = {
  fast: 0.28,
  base: 0.35,
  slow: 0.5,
};
