import express from "express";
import Resend from "resend";

const app = express();
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/send-email", async (req, res) => {
  const { to, message } = req.body || {};
  if (!to || !message)
    return res.status(400).json({ error: "Missing to or message" });

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to,
      subject: "A Holiday Wish For You 🎁",
      html: `<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.5">${String(
        message
      ).replace(/\n/g, "<br/>")}</div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("resend send error:", err);
    res.status(500).json({ error: "Send failed" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Resend demo server listening on ${port}`));
