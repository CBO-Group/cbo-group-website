import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, businessName, email, phone, helpWith, message } =
    req.body as {
      name: string;
      businessName: string;
      email: string;
      phone: string;
      helpWith: string;
      message: string;
    };

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    await resend.emails.send({
      from: "CBO Group <noreply@cbogroupco.com>",
      to: [process.env.RESEND_TO_EMAIL!],
      replyTo: email,
      subject: `New Contact: ${name}${businessName ? ` — ${businessName}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;color:#262321">
          <h2 style="margin:0 0 24px;font-size:20px">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr>
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Name</td>
              <td style="padding:10px 0;color:#5A5654">${name}</td>
            </tr>
            <tr style="border-top:1px solid #E4DED7">
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Business</td>
              <td style="padding:10px 0;color:#5A5654">${businessName || "—"}</td>
            </tr>
            <tr style="border-top:1px solid #E4DED7">
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Email</td>
              <td style="padding:10px 0;color:#5A5654"><a href="mailto:${email}" style="color:#8A6D3F">${email}</a></td>
            </tr>
            <tr style="border-top:1px solid #E4DED7">
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Phone</td>
              <td style="padding:10px 0;color:#5A5654">${phone || "—"}</td>
            </tr>
            <tr style="border-top:1px solid #E4DED7">
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Help With</td>
              <td style="padding:10px 0;color:#5A5654">${helpWith || "—"}</td>
            </tr>
            <tr style="border-top:1px solid #E4DED7">
              <td style="padding:10px 16px 10px 0;font-weight:600;white-space:nowrap;vertical-align:top">Message</td>
              <td style="padding:10px 0;color:#5A5654">${message ? message.replace(/\n/g, "<br>") : "—"}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
