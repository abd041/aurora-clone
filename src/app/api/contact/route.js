import { NextResponse } from 'next/server';

const PROJECT_OPTIONS = new Set([
  'website',
  'branding',
  'photo_video',
  'brochure',
  'autre',
]);

const PROJECT_LABELS = {
  website: 'Website',
  branding: 'Branding',
  photo_video: 'Photo & Video',
  brochure: 'Brochure',
  autre: 'Other',
};

function sanitize(value) {
  return String(value ?? '').trim();
}

function buildEmailHtml(payload) {
  const projects = payload.projects
    .map((p) => `<li>${PROJECT_LABELS[p] || p}</li>`)
    .join('');
  return `
    <h2>New contact request — Aurora Agency</h2>
    <p><strong>Company:</strong> ${payload.company}</p>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Role:</strong> ${payload.role}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Phone:</strong> ${payload.phone}</p>
    <p><strong>Projects:</strong></p>
    <ul>${projects}</ul>
  `;
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
    const phone = sanitize(body.phone).replace(/\s/g, '');
    const projects = Array.isArray(body.projects)
      ? body.projects.filter((p) => PROJECT_OPTIONS.has(p))
      : [];

    if (!company || !name || !role || !email || !phone || projects.length === 0) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (10 digits).' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Contact service is not configured. Set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL || 'contact@aurora-agency.ovh';
    const from =
      process.env.CONTACT_FROM_EMAIL || 'Aurora Agency <onboarding@resend.dev>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Contact request — ${company}`,
        html: buildEmailHtml({ company, name, role, email, phone, projects }),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[contact] Resend error:', res.status, detail);
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
