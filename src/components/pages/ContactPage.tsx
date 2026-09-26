import { useState } from "react";
import { SubmitButton } from "../ui/SubmitButton";
import { helpOptions, CONTACT_INFO, CONTACT_COPY } from "../../constants/contact";
import type { ContactState } from "../../types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E4DED7",
  borderRadius: 2,
  fontSize: 15,
  fontFamily: "'Work Sans',sans-serif",
  background: "#FFFFFF",
};

export function ContactPage() {
  const [contact, setContact] = useState<ContactState>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    helpWith: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const setField = (field: keyof ContactState, value: string) =>
    setContact((prev) => ({ ...prev, [field]: value }));

  const { eyebrow, heading, body, form, sidebar } = CONTACT_COPY;

  return (
    <div
      style={{ maxWidth: 1060, margin: "0 auto", padding: "132px 24px 100px" }}
      data-screen-label="Contact"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 56px" }}>
        <p
          style={{
            fontFamily: "'Source Serif 4',serif",
            fontStyle: "italic",
            fontSize: 15,
            color: "#8A6D3F",
            margin: "0 0 16px",
          }}
        >
          {eyebrow}
        </p>
        <h1
          style={{
            fontFamily: "'Source Serif 4',serif",
            fontSize: 34,
            fontWeight: 500,
            color: "#262321",
            margin: "0 0 18px",
          }}
        >
          {heading}
        </h1>
        <p
          style={{ fontSize: 16, lineHeight: 1.7, color: "#5A5654", margin: 0 }}
        >
          {body}
        </p>
      </div>
      <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px", minWidth: 300 }}>
          {submitted ? (
            <div style={{ borderTop: "1px solid #E4DED7", paddingTop: 30 }}>
              <h3
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: 22,
                  color: "#262321",
                  margin: "0 0 10px",
                }}
              >
                {form.successTitle}
              </h3>
              <p style={{ fontSize: 15, color: "#5A5654", margin: 0 }}>
                {form.successBody}
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setSubmitError(false);
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contact),
                  });
                  if (!res.ok) throw new Error("Failed");
                  setSubmitted(true);
                } catch {
                  setSubmitError(true);
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  {form.labels.name}
                </label>
                <input
                  type="text"
                  required
                  value={contact.name}
                  onChange={(e) => setField("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  {form.labels.businessName}
                </label>
                <input
                  type="text"
                  value={contact.businessName}
                  onChange={(e) => setField("businessName", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#262321",
                      margin: "0 0 6px",
                    }}
                  >
                    {form.labels.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setField("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#262321",
                      margin: "0 0 6px",
                    }}
                  >
                    {form.labels.phone}
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  {form.labels.helpWith}
                </label>
                <select
                  value={contact.helpWith}
                  onChange={(e) => setField("helpWith", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">{form.labels.helpWithPlaceholder}</option>
                  {helpOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  {form.labels.message}
                </label>
                <textarea
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setField("message", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <SubmitButton disabled={submitting}>
                {submitting ? form.submitSending : form.submitIdle}
              </SubmitButton>
              {submitError && (
                <p style={{ fontSize: 14, color: "#B94040", margin: 0 }}>
                  {form.errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
        <div
          style={{ flex: "1 1 260px", minWidth: 260, position: "relative" }}
        >
          <p
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 16,
              color: "#262321",
              margin: "0 0 24px",
              borderTop: "1px solid #E4DED7",
              paddingTop: 20,
            }}
          >
            {sidebar.heading}
          </p>
          <p style={{ margin: "0 0 20px" }}>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#8A6D3F",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {sidebar.phoneLabel}
            </span>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 20,
                fontWeight: 500,
                color: "#262321",
                textDecoration: "none",
              }}
            >
              {CONTACT_INFO.phone}
            </a>
          </p>
          <p style={{ margin: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#8A6D3F",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {sidebar.emailLabel}
            </span>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 17,
                fontWeight: 500,
                color: "#262321",
                textDecoration: "none",
              }}
            >
              {CONTACT_INFO.email}
            </a>
          </p>
          <img
            src="/images/CBO-logo-brown.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -180,
              right: -60,
              width: 420,
              height: "auto",
              opacity: 0.08,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
