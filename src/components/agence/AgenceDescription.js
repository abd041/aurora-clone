'use client';

import RevealLines from '@/components/ui/RevealLines';

export default function AgenceDescription({ description }) {
  if (!description) return null;
  const html = description.replace(/\n/g, '<br />');
  return (
    <RevealLines tag="p" split="words" theme="blue" html={html} />
  );
}
