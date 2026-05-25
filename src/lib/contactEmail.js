import nodemailer from 'nodemailer';
import { site } from '@/data/site';

const DEFAULT_TO = site.contact.email;

function buildPlainText(payload) {
  const projects = payload.projects
    .map((p) => `- ${p}`)
    .join('\n');
  return [
    `New contact request — ${site.brand.name}`,
    '',
    `Company: ${payload.company}`,
    `Name: ${payload.name}`,
    `Role: ${payload.role}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    'Projects:',
    projects,
  ].join('\n');
}

export function buildContactEmail(payload, projectLabels) {
  const projects = payload.projects
    .map((p) => `<li>${projectLabels[p] || p}</li>`)
    .join('');
  const html = `
    <h2>New contact request — ${site.brand.name}</h2>
    <p><strong>Company:</strong> ${payload.company}</p>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Role:</strong> ${payload.role}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Phone:</strong> ${payload.phone}</p>
    <p><strong>Projects:</strong></p>
    <ul>${projects}</ul>
  `;
  return {
    html,
    text: buildPlainText({
      ...payload,
      projects: payload.projects.map((p) => projectLabels[p] || p),
    }),
  };
}

async function sendViaSmtp({ to, from, replyTo, subject, html, text }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return { ok: false, reason: 'smtp_not_configured' };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: from || process.env.CONTACT_FROM_EMAIL || `"${site.brand.name}" <${user}>`,
    to,
    replyTo,
    subject,
    html,
    text,
  });

  return { ok: true };
}

async function sendViaResend({ to, from, replyTo, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: 'resend_not_configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from || process.env.CONTACT_FROM_EMAIL || `${site.brand.name} <onboarding@resend.dev>`,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[contact] Resend error:', res.status, detail);
    return { ok: false, reason: 'resend_failed' };
  }

  return { ok: true };
}

/**
 * Sends contact form email. Prefers Resend when RESEND_API_KEY is set; SMTP optional fallback.
 */
export async function sendContactEmail(payload, projectLabels) {
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const replyTo = payload.email;
  const subject = `Contact request — ${payload.company}`;
  const { html, text } = buildContactEmail(payload, projectLabels);

  if (process.env.RESEND_API_KEY) {
    const resend = await sendViaResend({ to, replyTo, subject, html });
    if (resend.ok) return { ok: true, provider: 'resend' };
    return { ok: false, reason: resend.reason === 'resend_not_configured' ? 'not_configured' : 'send_failed' };
  }

  const smtp = await sendViaSmtp({ to, replyTo, subject, html, text });
  if (smtp.ok) return { ok: true, provider: 'smtp' };

  return { ok: false, reason: 'not_configured' };
}
