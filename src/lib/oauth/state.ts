// src/lib/oauth/state.ts
import crypto from 'crypto';

const secret = process.env.CRYPTO_SECRET!;

export function buildState(userId: string, provider: string) {
  const ts = Date.now().toString();
  const core = `${userId}.${provider}.${ts}`;
  const sig = crypto.createHmac('sha256', secret).update(core).digest('hex').slice(0, 16);
  return Buffer.from(`${core}.${sig}`).toString('base64url');
}

export function verifyState(state: string, maxAgeMs = 10 * 60 * 1000) {
  try {
    const raw = Buffer.from(state, 'base64url').toString('utf8');
    const [userId, provider, ts, sig] = raw.split('.');
    const expected = crypto.createHmac('sha256', secret)
      .update(`${userId}.${provider}.${ts}`).digest('hex').slice(0, 16);
    if (sig !== expected) return null;
    if (Date.now() - Number(ts) > maxAgeMs) return null;
    return { userId, provider };
  } catch {
    return null;
  }
}
