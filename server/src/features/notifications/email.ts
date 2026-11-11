import nodemailer, { type Transporter } from "nodemailer";
import type { FastifyBaseLogger } from "fastify";
import type { Config } from "../../config.js";

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
}

/**
 * The invite and welcome mail. With no SMTP host it is a mock: it only logs that it would have sent.
 * A failed send is logged and swallowed, so a mail problem never fails a request.
 */
export function createMailer(smtp: Config["smtp"], log: Pick<FastifyBaseLogger, "info" | "error">) {
  const useReal = Boolean(smtp.host);
  let transporter: Transporter | null = null;

  function getTransporter(): Transporter {
    if (transporter) return transporter;
    if (useReal && smtp.host) {
      transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: smtp.user && smtp.pass ? { user: smtp.user, pass: smtp.pass } : undefined,
      });
    } else {
      // Mock transport: sends nothing, only builds the message.
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
    return transporter;
  }

  return {
    mode: useReal ? ("smtp" as const) : ("mock" as const),
    async send(msg: MailMessage): Promise<void> {
      try {
        await getTransporter().sendMail({
          from: smtp.from,
          to: msg.to,
          subject: msg.subject,
          html: msg.html,
        });
        if (!useReal) {
          log.info(`[email:mock] → ${msg.to} | ${msg.subject}`);
        }
      } catch (err) {
        log.error(`[email] send failed: ${(err as Error).message}`);
      }
    },
  };
}

export type Mailer = ReturnType<typeof createMailer>;
