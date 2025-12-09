import Resend from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

// Vercel / Netlify-style serverless handler
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { to, message } = req.body || {};
  if (!to || !message) {
    res.status(400).json({ error: "Missing `to` or `message` in body" });
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to,
      subject: "A Holiday Wish For You 🎁",
      html: `<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.5">${String(
        message
      ).replace(/\n/g, "<br/>")}</div>`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("resend send error:", err);
    res.status(500).json({ error: "Send failed" });
  }
}
