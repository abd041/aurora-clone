'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import SecondaryBtn from '@/components/ui/SecondaryBtn';
import useIsMobile from '@/hooks/useIsMobile';
import useSplitLines from '@/hooks/useSplitLines';

const CONTACT_BG =
  '/images/f329b922e822a4c6e1929e0dd23ab82931249981-1536x1024.avif';

const PROJECT_OPTIONS = [
  { id: 'website', value: 'website', label: 'Website' },
  { id: 'branding', value: 'branding', label: 'Branding' },
  { id: 'photo_video', value: 'photo_video', label: 'Photo & Video' },
  { id: 'brochure', value: 'brochure', label: 'Brochure' },
  { id: 'autre', value: 'autre', label: 'Other' },
];

function ContactTitle({ children }) {
  const ref = useRef(null);
  useSplitLines(ref, { delay: 0.75 });
  return (
    <h1 className="contact-title" ref={ref}>
      {children}
    </h1>
  );
}

export default function ContactForm({ background = CONTACT_BG }) {
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [projects, setProjects] = useState([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const parallaxRef = useRef(null);

  useEffect(() => {
    parallaxRef.current?.scrollTrigger?.kill();
    parallaxRef.current?.kill();

    parallaxRef.current = gsap
      .timeline({
        scrollTrigger: {
          trigger: '.contact-head',
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      .fromTo(
        '.contact-title',
        { yPercent: 0 },
        { yPercent: -50, clearProps: 'all' },
        0
      );

    return () => {
      parallaxRef.current?.scrollTrigger?.kill();
      parallaxRef.current?.kill();
      parallaxRef.current = null;
    };
  }, []);

  const toggleProject = (value) => {
    setProjects((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!name || !role || !company || !email || !phone || projects.length === 0) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number (10 digits).');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          company,
          projects,
          email,
          phone: phone.replace(/\s/g, ''),
          website: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Unable to send your message. Please try again later.');
        return;
      }

      setSuccess('Thank you for your message. We will get back to you as soon as possible.');
      setName('');
      setRole('');
      setCompany('');
      setProjects([]);
      setEmail('');
      setPhone('');
      setHoneypot('');
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Unable to send your message. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-head">
      <div className="contact-left">
        <div className="contact-fade" />
        <div className="contact-overlay" />
        <img src={background} alt="Background contact" />
      </div>
      <div className="contact-right">
        <ContactTitle>Contact</ContactTitle>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="submit-message">{success}</p>}
        <form className="form" onSubmit={onSubmit} noValidate>
          <label
            className="contact-honeypot"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              opacity: 0,
              height: 0,
              overflow: 'hidden',
            }}
          >
            <span>Website</span>
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
          <fieldset>
            <label htmlFor="name">Hello my name is</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
          {isMobile ? (
            <>
              <fieldset>
                <label htmlFor="role">I am</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={submitting}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="company">from the company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={submitting}
                />
              </fieldset>
            </>
          ) : (
            <fieldset>
              <label htmlFor="role">I am</label>
              <input
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
              />
              <label htmlFor="company">from the company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={submitting}
              />
            </fieldset>
          )}
          <fieldset className="checkbox-inputs">
            <label className="fake-label">and I am contacting you for a project of</label>
            {PROJECT_OPTIONS.map((opt) => (
              <Fragment key={opt.id}>
                <input
                  type="checkbox"
                  id={opt.id}
                  value={opt.value}
                  checked={projects.includes(opt.value)}
                  onChange={() => toggleProject(opt.value)}
                  disabled={submitting}
                />
                <label htmlFor={opt.id}>{opt.label}</label>
              </Fragment>
            ))}
          </fieldset>
          <fieldset>
            <label htmlFor="email">My email is</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="tel">and you can call me at</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
          <div className="btn-submit">
            <SecondaryBtn tag="Button" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Request an appointment'}
            </SecondaryBtn>
            <span>*All fields are required</span>
          </div>
        </form>
      </div>
    </section>
  );
}
