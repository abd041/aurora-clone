import { site } from '@/data/site';
import Logo from '@/components/icons/Logo';

/**
 * Header wordmark — uses site.brand.logoWordmark image when set, else built-in SVG.
 */
export default function BrandLogo({ className = 'Icon no-size' }) {
  const { logoWordmark, name } = site.brand;

  if (logoWordmark) {
    return (
      <img
        src={logoWordmark}
        alt={name}
        className={className}
        width={163}
        height={45}
        decoding="async"
      />
    );
  }

  return <Logo className={className} ariaLabel={name} />;
}

/**
 * Footer / compact icon — image path or built-in figure-8 symbol SVG.
 */
export function BrandIcon({ className = 'Icon Icon--logo-small no-size', size = 40 }) {
  const { logoIcon, name } = site.brand;

  if (logoIcon) {
    return (
      <img
        src={logoIcon}
        alt={name}
        className={className}
        width={size}
        height={size}
        decoding="async"
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 20V10c5.524 0 10-4.477 10-10h10.002c0 11.046-8.956 20-20.002 20M40.006 20V10c-5.524 0-10-4.477-10-10H20.004c0 11.046 8.956 20 20.002 20M0 40V30c5.524 0 10-4.478 10-10.001h10.002c0 11.046-8.956 20-20.002 20M40.006 40V30c-5.524 0-10-4.478-10-10.001H20.004c0 11.046 8.956 20 20.002 20"
      />
    </svg>
  );
}
