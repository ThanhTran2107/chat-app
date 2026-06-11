import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(
  __dirname,
  "templates",
  "reset-password-form.html",
);
const resetPasswordTemplate = fs.readFileSync(templatePath, "utf-8");

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

export const sendPasswordResetEmail = async ({ to, url }) => {
  const html = formatTemplate(resetPasswordTemplate, {
    email: to,
    resetLink: url,
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Reset your chat-app password",
    html,
  });

  return info;
};
