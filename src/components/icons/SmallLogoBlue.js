import { AuroraSymbolFilled } from '@/components/brand/AuroraSymbol';

export default function SmallLogoBlue({ className = 'Icon Icon--small-logo-blue' }) {
  return (
    <AuroraSymbolFilled
      className={className}
      size={{ width: 31, height: 30 }}
      style={{ color: 'var(--primary)' }}
    />
  );
}
