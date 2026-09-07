import { Resend } from 'resend';

let instance: Resend | null = null;

/**
 * Lazily-created Resend client.
 *
 * Deferring construction avoids crashing at import time when
 * `RESEND_API_KEY` is not set (e.g. local dev without e-mail configured) and
 * sidesteps env-load ordering issues.
 */
export function getResend(): Resend {
  if (!instance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    instance = new Resend(apiKey);
  }

  return instance;
}
