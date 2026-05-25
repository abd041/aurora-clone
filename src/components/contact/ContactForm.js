'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import SecondaryBtn from '@/components/ui/SecondaryBtn';
import useSplitLines from '@/hooks/useSplitLines';
import { submitContactForm } from '@/lib/contactSubmit';
import { site } from '@/data/site';

const CONTACT_BG =
  '/images/f329b922e822a4c6e1929e0dd23ab82931249981-1536x1024.avif';

const PROJECT_OPTIONS = site.contactForm.projectTypes;
const FORM = site.contactForm;

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
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(max-width: 768px)').matches) return undefined;

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
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const result = await submitContactForm({
        name,
        role,
        company,
        projects,
        email,
        phone: phoneDigits,
        website: honeypot,
      });

      if (!result.ok) {
        setError(result.error || 'Unable to send your message. Please try again later.');
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
        <img src={background} alt="Background contact" />
        <ContactTitle>{FORM.pageTitle}</ContactTitle>
      </div>
      <div className="contact-right">
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
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="role">I am</label>
            <input
              type="text"
              id="role"
              name="role"
              autoComplete="organization-title"
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
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
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
              autoComplete="email"
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
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </fieldset>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="submit-message" role="status">
              {success}
            </p>
          )}
          <div className="btn-submit">
            <SecondaryBtn tag="Button" type="submit" disabled={submitting}>
              {submitting ? FORM.submittingLabel : FORM.submitLabel}
            </SecondaryBtn>
            <span>{FORM.requiredNote}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
