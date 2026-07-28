import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resetTemplatePath = path.join(
  __dirname,
  "templates",
  "reset-password-form.html",
);
const verifyTemplatePath = path.join(
  __dirname,
  "templates",
  "verify-email-form.html",
);

const resetPasswordTemplate = fs.readFileSync(resetTemplatePath, "utf-8");
const verifyEmailTemplate = fs.readFileSync(verifyTemplatePath, "utf-8");

const logoPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "client",
  "public",
  "main-logo.png",
);
const logoCid = "tetra-logo@tetra";
const logoAttachment = fs.existsSync(logoPath)
  ? [{ filename: "main-logo.png", path: logoPath, cid: logoCid }]
  : [];
const logoAttachmentForSendGrid = fs.existsSync(logoPath)
  ? [
      {
        content: fs.readFileSync(logoPath).toString("base64"),
        filename: "main-logo.png",
        type: "image/png",
        disposition: "inline",
        content_id: logoCid,
      },
    ]
  : [];

const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) sgMail.setApiKey(sendgridApiKey);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
  connectionTimeout: 10000,
});

const formatTemplate = (template, values) =>
  Object.entries(values).reduce(
    (html, [key, value]) => html.replace(new RegExp(`{{${key}}}`, "g"), value),
    template,
  );

const sendMailWithSendGrid = async ({ to, subject, html }) => {
  if (!sendgridApiKey) throw new Error("SendGrid API key is not configured");

  const msg = {
    to,
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    subject,
    html,
    attachments: logoAttachmentForSendGrid,
  };

  return sgMail.send(msg);
};

const sendMailWithSMTP = async ({ to, subject, html }) =>
  transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    attachments: logoAttachment,
  });

const sendEmail = async ({ to, subject, html }) =>
  sendgridApiKey
    ? sendMailWithSendGrid({ to, subject, html })
    : sendMailWithSMTP({ to, subject, html });

export const sendPasswordResetEmail = async ({ to, url }) => {
  const html = formatTemplate(resetPasswordTemplate, {
    email: to,
    resetLink: url,
    logoCid: `cid:${logoCid}`,
  });

  return sendEmail({
    to,
    subject: "Reset your Tetra password",
    html,
  });
};

export const sendVerificationEmail = async ({ to, url }) => {
  const html = formatTemplate(verifyEmailTemplate, {
    email: to,
    verifyLink: url,
    logoCid: `cid:${logoCid}`,
  });

  return sendEmail({
    to,
    subject: "Verify your Tetra email",
    html,
  });
};
