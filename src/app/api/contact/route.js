import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/contactEmail';
import { site } from '@/data/site';

const PROJECT_OPTIONS = new Set(site.contactForm.projectTypes.map((p) => p.value));

const PROJECT_LABELS = Object.fromEntries(
  site.contactForm.projectTypes.map(({ value, label }) => [value, label])
);

function sanitize(value) {
  return String(value ?? '').trim();
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const company = sanitize(body.company);
    const name = sanitize(body.name);
    const role = sanitize(body.role);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);
    const projects = Array.isArray(body.projects)
      ? body.projects.filter((p) => PROJECT_OPTIONS.has(p))
      : [];

    if (!company || !name || !role || !email || !phone || projects.length === 0) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    const result = await sendContactEmail(
      { company, name, role, email, phone, projects },
      PROJECT_LABELS
    );

    if (!result.ok) {
      if (result.reason === 'not_configured') {
        return NextResponse.json(
          {
            error:
              'Contact email is not configured. Add RESEND_API_KEY in Vercel (see .env.example).',
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: 'Unable to send your message. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unable to send your message. Please try again later.' },
      { status: 500 }
    );
  }
}
