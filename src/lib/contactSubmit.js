import { site } from '@/data/site';

const PROJECT_LABELS = Object.fromEntries(
  site.contactForm.projectTypes.map(({ value, label }) => [value, label])
);

function getFormspreeEndpoint() {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  if (!id) return null;
  if (id.startsWith('https://')) return id;
  return `https://formspree.io/f/${id}`;
}

/**
 * Submit contact form. Prefer Formspree when configured (no server/API keys).
 * Otherwise POST to /api/contact (Resend on Vercel).
 */
export async function submitContactForm(payload) {
  const formspreeUrl = getFormspreeEndpoint();

  if (formspreeUrl) {
    const body = new FormData();
    body.append('name', payload.name);
    body.append('role', payload.role);
    body.append('company', payload.company);
    body.append('email', payload.email);
    body.append('phone', payload.phone);
    body.append(
      'projects',
      payload.projects.map((p) => PROJECT_LABELS[p] || p).join(', ')
    );
    body.append('_replyto', payload.email);
    body.append('_subject', `Contact request — ${payload.company}`);
    if (payload.website) body.append('_gotcha', payload.website);

    const res = await fetch(formspreeUrl, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: data.error || 'Unable to send your message. Please try again later.',
      };
    }
    return { ok: true };
  }

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      error: data.error || 'Unable to send your message. Please try again later.',
    };
  }
  return { ok: true };
}
