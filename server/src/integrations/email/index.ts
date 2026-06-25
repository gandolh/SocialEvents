import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../../config/env.js";

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
}

let transporter: Transporter | null = null;
const useReal = Boolean(config.smtp.host);

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (useReal) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host!,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth:
        config.smtp.user && config.smtp.pass
          ? { user: config.smtp.user, pass: config.smtp.pass }
          : undefined,
    });
  } else {
    // Mock transport: logs to console instead of sending.
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }
  return transporter;
}

export async function sendMail(msg: MailMessage): Promise<void> {
  try {
    const info = await getTransporter().sendMail({
      from: config.smtp.from,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
    });
    if (!useReal) {
      // eslint-disable-next-line no-console
      console.log(`[email:mock] → ${msg.to} | ${msg.subject}`);
      void info;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email] send failed:", (err as Error).message);
  }
}

export function emailMode(): "smtp" | "mock" {
  return useReal ? "smtp" : "mock";
}
