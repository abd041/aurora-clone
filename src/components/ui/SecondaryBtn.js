'use client';

import Link from 'next/link';

export default function SecondaryBtn({ tag, theme, href, children, className = '', ...props }) {
  const classes = ['secondary-btn', theme && `theme--${theme}`, className]
    .filter(Boolean)
    .join(' ');

  if (tag === 'Link' && href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (tag === 'Button') {
    const { type = 'button', ...buttonProps } = props;
    return (
      <button type={type} className={classes} {...buttonProps}>
        {children}
      </button>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
