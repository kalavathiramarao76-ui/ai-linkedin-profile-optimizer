const rateMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

export function rateLimit(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateMap.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateMap.entries()) {
      if (now > value.resetAt) rateMap.delete(key);
    }
  }, 5 * 60_000);
}
