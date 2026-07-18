"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
   FaWhatsapp,
   FaMedium,
   FaMicrosoft,
  } from "react-icons/fa";
import {
  FiInstagram,
  FiFacebook,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { profile } from "@/data/portfolio";
import { SectionEyebrow } from "./About";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value
    };

    try {
      // This calls OUR OWN Next.js API route — never Firebase directly
      // from the browser. The Firebase Admin credentials stay on the
      // server and are never sent to the client. See app/api/contact/route.ts
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="bg-ink px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="05" label="contact" />
        <h2 className="mt-6 font-display text-3xl font-bold text-paper sm:text-4xl">
          Let&apos;s ship something together.
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <ContactRow icon={<FiMapPin />} label={profile.location} />
            <ContactRow
              icon={<FiPhone />}
              label={profile.phone}
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
            />
            <ContactRow
              icon={<FiMail />}
              label={profile.email}
              href={`mailto:${profile.email}`}
            />
            <p className="text-sm text-muted">Let Connect Here:</p>
            <div className="flex flex-wrap gap-4">  
            <ContactRow
              icon={<FiGithub />}
              label=""
              href={profile.social.github}
            />
            <ContactRow
              icon={<FiLinkedin />}
              label=""
              href={profile.social.linkedin}
            />
            <ContactRow
              icon={<FaMedium />}
              label=""
              href={profile.social.medium}
            />  
            <ContactRow
              icon={<FaMicrosoft />}
              label=""
              href={profile.social.microsoftteams}
            />  
            <ContactRow
              icon={<FaWhatsapp />}
              label=""
              href={profile.social.whatsapp}
            />
            <ContactRow
              icon={<FiInstagram />}
              label=""
              href={profile.social.instagram}
            />
            <ContactRow
              icon={<FiFacebook />}
              label=""
              href={profile.social.facebook}
            />  
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-line bg-panel/60 p-6"
          >
            <Field name="name" label="Your name" type="text" required />
            <Field name="phone" label="Your mobile no." type="tel" required />
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full rounded border border-line bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-signal"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded bg-signal px-5 py-3 font-mono text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="font-mono text-xs text-signal">
                Message received — thanks, I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-xs text-red-400">{errorMsg}</p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  href
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-signal">
      <span className="text-signal">{icon}</span>
      {label}
    </span>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

function Field({
  name,
  label,
  type,
  required
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded border border-line bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-signal"
      />
    </div>
  );
}
