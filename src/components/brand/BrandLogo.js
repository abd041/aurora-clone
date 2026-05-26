import { site } from '@/data/site';
import Logo from '@/components/icons/Logo';
import { AuroraSymbolFilled } from '@/components/brand/AuroraSymbol';

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
    <AuroraSymbolFilled
      className={className}
      size={size}
      aria-label={name}
    />
  );
}
