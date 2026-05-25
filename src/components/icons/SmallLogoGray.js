import { AuroraSymbolFilled } from '@/components/brand/AuroraSymbol';

export default function SmallLogoGray({ className = 'Icon Icon--small-logo-gray' }) {
  return (
    <AuroraSymbolFilled
      className={className}
      size={{ width: 31, height: 33 }}
      style={{ color: 'var(--secondary)' }}
    />
  );
}
